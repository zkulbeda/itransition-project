import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import { DateTime } from 'luxon';

export const conversationFieldsToIgnore = ['password'];
export function convertNumbersFromObject(obj: object) {
  const convertedObj = obj;
  Object.keys(convertedObj).forEach((key) => {
    if (conversationFieldsToIgnore.includes(key)) return;
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
  from(value: Date): DateTime {
    return value && DateTime.fromJSDate(value);
  },
  to(value: DateTime): Date {
    return value?.toJSDate();
  },
};

export const CRUD = ['create', 'read', 'update', 'delete'] as const;
export type CRUDType = typeof CRUD[number]
