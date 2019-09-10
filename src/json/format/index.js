/* eslint-disable no-console */

import { formatCompilers as dateTimeFormat } from './date-time';
import { formatCompilers as regexFormat } from './string';

export function getDefaultFormatCompilers() {
  return { ...dateTimeFormat, ...regexFormat };
}
