/* eslint-disable no-console */

import { formatCompilers as dateTimeFormats } from './date-time';
import { formatCompilers as stringFormats } from './string';

export function getDefaultFormatCompilers() {
  return {
    ...dateTimeFormats,
    ...stringFormats,
  };
}
