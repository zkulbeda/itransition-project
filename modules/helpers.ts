import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import { DateTime } from 'luxon';

export function convertNumbersFromObject(obj: object) {
  const convertedObj = obj;
  Object.keys(convertedObj).forEach((key) => {
    const value = convertedObj[key];
    if (typeof value === 'string' && value.trim() !== '') {
      const number = Number(value);
      if (!Number.isNaN(number)) convertedObj[key] = number;
    }
    if (isObject(value) || isArray(value)) {
      convertedObj[key] = convertNumbersFromObject(value);
    }
  });
  return convertedObj;
}

export const SqlDateTransformer = {
  from(value: string): DateTime {
    return DateTime.fromSQL(value);
  },
  to(value: DateTime): string {
    return value.toSQL();
  },
};
