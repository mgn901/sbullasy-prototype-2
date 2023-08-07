/* eslint-disable import/no-extraneous-dependencies */
import { access, constants, mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { FastifySchema } from 'fastify';
import type { OpenAPIV3 } from 'openapi-types';
import { format } from 'prettier';
import SwaggerParser from 'swagger-parser';

const getSchema = async (path: string) =>
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

(async () => {
  const outDirPath = join(dirname(fileURLToPath(import.meta.url)), '../src/server/schemas');
  await mkdirIfNotExists(outDirPath);

  const yamlPath = join(dirname(fileURLToPath(import.meta.url)), '../spec/openapi.yaml');
  const { paths } = (await getSchema(yamlPath)) as { paths: OpenAPIV3.PathsObject };

  if (paths) {
    const pathEntries = Object.entries(paths);
    pathEntries.forEach(([pathString, pathItemObject]) => {
      if (!pathItemObject) {
        return;
      }

      const operationEntriesOriginal = Object.entries(pathItemObject);
      const operationEntries: [string, OpenAPIV3.OperationObject][] = [];
      operationEntriesOriginal.forEach(([methodName, operationObject]) => {
        const methodNames = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
        if (!methodNames.includes(methodName)) {
          return;
        }
        if (
          operationObject &&
          typeof operationObject === 'object' &&
          'responses' in operationObject
        ) {
          operationEntries.push([methodName, operationObject]);
        }
      });

      operationEntries.forEach(async ([operationName, operationObject]) => {
        const typeName = getTypeNameFromPathString(pathString, operationName);
        await writeFile(
          join(outDirPath, `${typeName}.ts`),
          await getTypeScriptFromOperationObject(typeName, operationObject),
        );
      });
    });
  }
})();
