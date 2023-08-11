/* eslint-disable import/no-extraneous-dependencies */
import { access, constants, mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import SwaggerParser from 'swagger-parser';
import type { OpenAPIV3 } from 'openapi-types';
import { format } from 'prettier';

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

const mkdirIfNotExists = async (path: string) => {
  try {
    await access(path, constants.R_OK);
  } catch (e) {
    mkdir(path);
  }
};

const fileExists = async (path: string) => {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const getTypeScriptFromOperationObject = async (pathString: string, methodName: string) => {
  const typeName = getTypeNameFromPathString(pathString, methodName);
  const code = `import { ${typeName} } from '../schemas/${typeName}.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const ${typeName}ControllerFactory: TControllerFactory<typeof ${typeName}> = ({ repository }) => ({
  method: '${methodName}',
  url: '${pathString.replace(/\{(.+)\}/g, ':$1')}',
  handler: async (request, reply) => {
    const result = await INTERACTOR_HERE({
      repository,
      query: request.query,
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send();
    return reply;
  },
});
`;
  const codeFormatted = await format(code, {
    parser: 'typescript',
    printWidth: 100,
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    endOfLine: 'lf',
  });
  return codeFormatted;
};

(async () => {
  const dirName = dirname(fileURLToPath(import.meta.url));
  const outDirPath = join(dirName, '../src/server/controllers');
  await mkdirIfNotExists(outDirPath);

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
          .map(async ([methodName]) => {
            const typeName = getTypeNameFromPathString(pathString, methodName);
            const code = await getTypeScriptFromOperationObject(pathString, methodName);
            return [typeName, code] as const;
          }),
      );

      codeEntries.forEach(async ([typeName, code]) => {
        const outFilePath = join(outDirPath, `${typeName}ControllerFactory.fastify.ts`);
        if (await fileExists(outFilePath)) {
          return;
        }
        await writeFile(outFilePath, code, {
          encoding: 'utf-8',
        });
      });
    });
  }
})();
