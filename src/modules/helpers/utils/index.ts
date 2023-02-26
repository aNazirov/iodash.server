import { Request } from 'express';

export * from './errorHandler';

export const getUrl = (req: Request) =>
  `${req.protocol}://${req.get('Host')}${req.originalUrl}`;

export const parse = (query: string = '{}') => {
  const parsed = JSON.parse(query);

  if (typeof parsed === 'object') {
    return parsed;
  }

  return {};
};

export const trim = (values?: string) =>
  typeof values === 'string' ? values.trim() : '';

export const toBoolean = (value: string): boolean => {
  value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
};
