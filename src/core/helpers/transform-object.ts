import { UnknownRecord } from '../../types/unknown-record.type.js';
import { DEFAULT_STATIC_IMAGES } from '../../utils/constants.js';

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function transformProperty(
  property: string,
  someObject: UnknownRecord,
  transformFn: (object: UnknownRecord) => void
) {
  return Object.keys(someObject).forEach((key) => {
    if (key === property) {
      transformFn(someObject);
    } else if (isObject(someObject[key])) {
      transformProperty(
        property,
        someObject[key] as UnknownRecord,
        transformFn
      );
    }
  });
}

const getSinglePath = (target: UnknownRecord, property: string, staticPath: string, uploadPath: string) => {
  const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
  target[property] = `${rootPath}/${target[property]}`;
};

function getPathsArray(target: UnknownRecord, property: string, staticPath: string, uploadPath: string) {
  const targetItems = target[property] as string[];
  const resultPaths: string[] = [];
  targetItems.forEach((item) => {
    const rootPath = DEFAULT_STATIC_IMAGES.includes(item) ? staticPath : uploadPath;
    item = `${rootPath}/${item}`;
    resultPaths.push(item);
  });
  target[property] = resultPaths;
}

export function transformObject(
  properties: string[],
  staticPath: string,
  uploadPath: string,
  data: UnknownRecord
) {
  return properties.forEach((property) => transformProperty(property, data, (target: UnknownRecord) => {
    if (target[property] instanceof Array) {
      getPathsArray(target, property, staticPath, uploadPath);
    } else {
      getSinglePath(target, property, staticPath, uploadPath);
    }
  }));
}
