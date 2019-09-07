/* eslint-disable no-console */

import { formatCompilers as dateTimeFormat } from './date-time';

export function getDefaultFormatCompilers() {
  return { ...dateTimeFormat };
}
