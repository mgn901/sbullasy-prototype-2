/* eslint-disable import/no-extraneous-dependencies */
import { access, constants, mkdir, readFile, readdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { FastifySchema } from 'fastify';
import type { OpenAPIV3 } from 'openapi-types';
import { format } from 'prettier';
import SwaggerParser from 'swagger-parser';
import { load } from 'js-yaml';

const getOpenAPIDocument = async (path: string) =>
  SwaggerParser.prototype.dereference(path, {
    dereference: {
      circular: true,
    },
  });

const getTypeNameFromPathString = (path: string, methodName: string): string => {
  const words = path.replace(/(\/\{|\}\/|\/|\{|\})/g, '_').split('_');
  return (
    words
      .map((word, idx) => {
        if (word.length === 0) {
          return '';
        }
        if (idx === 1) {
          return word;
        }
        return word[0].toUpperCase() + word.slice(1);
      })
      .join('') +
    methodName[0].toUpperCase() +
    methodName.slice(1)
  );
};

const getFastifySchemaFromOperationObject = (
  operationObject: OpenAPIV3.OperationObject,
): FastifySchema => {
  const { parameters, requestBody, responses } = operationObject;

  const querystringEntries: [string, OpenAPIV3.SchemaObject][] = [];
  const querystringRequiredArray: string[] = [];
  const paramEntries: [string, OpenAPIV3.SchemaObject][] = [];
  const paramRequiredArray: string[] = [];
  parameters?.forEach((parameter) => {
    if (!('name' in parameter)) {
      return;
    }
    if (parameter.in === 'query' && parameter.schema && !('$ref' in parameter.schema)) {
      querystringEntries.push([parameter.name, parameter.schema]);
      if (parameter.required) querystringRequiredArray.push(parameter.name);
    }
    if (parameter.in === 'path' && parameter.schema && !('$ref' in parameter.schema)) {
      paramEntries.push([parameter.name, parameter.schema]);
      if (parameter.required) paramRequiredArray.push(parameter.name);
    }
  });

  const responseEntries: [string, OpenAPIV3.SchemaObject][] = [];
  const responseEntriesOriginal = Object.entries(responses);
  responseEntriesOriginal.forEach(([status, responseObject]) => {
    if (
      'content' in responseObject &&
      responseObject.content &&
      'application/json' in responseObject.content &&
      responseObject.content['application/json'] &&
      'schema' in responseObject.content['application/json'] &&
      responseObject.content['application/json'].schema &&
      !('$ref' in responseObject.content['application/json'].schema)
    ) {
      responseEntries.push([status, responseObject.content['application/json'].schema]);
    }
  });

  const body: FastifySchema['body'] = (() => {
    if (
      requestBody &&
      'content' in requestBody &&
      'application/json' in requestBody.content &&
      requestBody.content['application/json'] &&
      'schema' in requestBody.content['application/json'] &&
      requestBody.content['application/json'].schema &&
      !('ref' in requestBody.content['application/json'].schema)
    ) {
      return requestBody.content['application/json'].schema;
    }
    return {};
  })();
  const querystring: FastifySchema['querystring'] = {
    type: 'object',
    properties: Object.fromEntries(querystringEntries),
    required: querystringRequiredArray,
  };
  const params: FastifySchema['params'] = {
    type: 'object',
    properties: Object.fromEntries(paramEntries),
    required: paramRequiredArray,
  };
  const response: FastifySchema['response'] = Object.fromEntries(responseEntries);
  return { body, querystring, params, response };
};

const getTypeScriptFromOperationObject = async (
  typeName: string,
  operationObject: OpenAPIV3.OperationObject,
) => {
  const fastifySchema = getFastifySchemaFromOperationObject(operationObject);
  const json = JSON.stringify(fastifySchema);
  const code = `const ${typeName} = ${json} as const;

export { ${typeName} };
`;
  const formattedCode = await format(code, {
    parser: 'typescript',
    printWidth: 100,
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    endOfLine: 'lf',
  });
  return formattedCode;
};

const mkdirIfNotExists = async (path: string) => {
  try {
    await access(path, constants.R_OK);
  } catch (e) {
    mkdir(path);
  }
};

const getCamelCaseFromKebabCaseFileName = (fileName: string): string => {
  const words = fileName.replace(/\.yaml/g, '').split('-');
  const camelCaseWords = words.map((word, idx) => {
    if (idx === 0) return word;
    if (word.length === 0) return word;
    return word[0].toUpperCase() + word.slice(1);
  });
  return camelCaseWords.join('');
};

const getInterfaceNameFromKebabCaseFileName = (fileName: string): string => {
  if (fileName.length === 0) return '';
  const camelCase = getCamelCaseFromKebabCaseFileName(fileName);
  return `I${camelCase[0].toUpperCase()}${camelCase.slice(1)}`;
};

type TPrimitiveTypes = bigint | boolean | number | string | symbol | undefined;

const flattenObject = (
  obj: Record<string, any>,
  path: string[] = [],
): [string, TPrimitiveTypes][] =>
  Object.entries(obj).reduce<[string, TPrimitiveTypes][]>((result, [key, value]) => {
    const newPath = path.concat(key);

    if (Array.isArray(value)) {
      result.push(
        ...flattenObject(
          Object.fromEntries(value.map((_value, idx) => [`${newPath.join('.')}.${idx}`, _value])),
        ),
      );
    } else if (typeof value === 'object' && value !== null) {
      result.push(...flattenObject(value, newPath));
    } else {
      result.push([newPath.join('.'), value]);
    }

    return result;
  }, []);

class ReferenceTree {
  private readonly map: Map<string, string[]>;

  public constructor(map: Map<string, string[]>) {
    this.map = map;
  }

  public get(name: string): string[] {
    const referencesOriginal = this.map.get(name) ?? [];
    const references = referencesOriginal.reduce<string[]>((result, reference) => {
      result.push(...this.get(reference));
      return result;
    }, referencesOriginal);
    return [...new Set(references)];
  }
}

(async () => {
  const dirName = dirname(fileURLToPath(import.meta.url));
  const outDirPath = join(dirName, '../src/server/schemas');
  await mkdirIfNotExists(outDirPath);

  // #region OpenAPI Document -> Fastify Schema

  const yamlPath = join(dirName, '../spec/openapi.yaml');
  const { paths } = (await getOpenAPIDocument(yamlPath)) as { paths: OpenAPIV3.PathsObject };

  if (paths) {
    const pathEntries = Object.entries(paths);
    pathEntries.forEach(async ([pathString, pathItemObject]) => {
      if (!pathItemObject) {
        return;
      }

      const operationEntriesOriginal = Object.entries(pathItemObject);

      const codeEntries = await Promise.all(
        operationEntriesOriginal
          .filter(([methodName, operationObject]) => {
            const methodNames = [
              'get',
              'put',
              'post',
              'delete',
              'options',
              'head',
              'patch',
              'trace',
            ];
            return (
              methodNames.includes(methodName) &&
              operationObject &&
              typeof operationObject === 'object' &&
              'responses' in operationObject
            );
          })
          .map(async ([methodName, operationObject]) => {
            const typeName = getTypeNameFromPathString(pathString, methodName);
            const code = await getTypeScriptFromOperationObject(
              typeName,
              operationObject as OpenAPIV3.OperationObject,
            );
            return [typeName, code] as const;
          }),
      );

      codeEntries.forEach(async ([typeName, code]) => {
        await writeFile(join(outDirPath, `${typeName}.ts`), code, { encoding: 'utf-8' });
      });
    });
  }

  // #endregion

  // #region JSON Schema -> TypeScript types

  const dirents = await readdir(join(dirName, '../spec/http-api-json-schemas'), {
    withFileTypes: true,
  });

  const yamlEntries = await Promise.all(
    dirents
      .filter((dirent) => dirent.isFile())
      .map(
        async (dirent) =>
          [
            dirent.name,
            await readFile(join(dirName, '../spec/http-api-json-schemas', dirent.name), 'utf-8'),
          ] as const,
      ),
  );

  const schemaEntries = yamlEntries.map(([name, yaml]) => [name, load(yaml) as Object] as const);

  const referenceEntries = schemaEntries.map(([name, schema]) => {
    const referencesOriginal = flattenObject(schema).filter(([key]) =>
      key.endsWith('$ref'),
    ) as unknown as [string, string][];
    const references = referencesOriginal.map((entry) => entry[1]);
    return [name, references] as const;
  });
  const referenceMap = new Map();
  referenceEntries.forEach(([name, reference]) => {
    referenceMap.set(name, reference);
  });

  const tree = new ReferenceTree(referenceMap);

  const codeEntries = await Promise.all(
    schemaEntries.map(async ([name, schema]) => {
      const references = tree.get(name);
      const imports = references
        .map(
          (reference) =>
            `import { ${getCamelCaseFromKebabCaseFileName(
              reference,
            )} } from './${getInterfaceNameFromKebabCaseFileName(reference)}.ts'`,
        )
        .join('\n');
      const referenceArray = references
        .map((reference) => `typeof ${getCamelCaseFromKebabCaseFileName(reference)}`)
        .join(', ');
      const varName = getCamelCaseFromKebabCaseFileName(name);
      const fileName = getInterfaceNameFromKebabCaseFileName(name);
      const code = `import { FromSchema } from 'json-schema-to-ts';
${imports}

export const ${varName} = ${JSON.stringify(schema)} as const;

export type ${fileName} = FromSchema<typeof ${varName}, { references: [${referenceArray}]}>;
`;
      const formattedCode = await format(code, {
        parser: 'typescript',
        printWidth: 100,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        endOfLine: 'lf',
      });
      return [fileName, formattedCode] as const;
    }),
  );

  codeEntries.forEach(async ([fileName, code]) => {
    await writeFile(join(outDirPath, `${fileName}.ts`), code, { encoding: 'utf-8' });
  });

  // #endregion
})();
