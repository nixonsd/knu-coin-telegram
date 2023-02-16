import pino from 'pino';
import { getAppConfig } from '../config';

const appConfig = getAppConfig();

const formatters = {
  level(label: string) {
    return { level: label.toUpperCase() };
  },
};

export const logger: pino.Logger = pino({
  level: appConfig.logLevel,
  formatters,
  mixinMergeStrategy(mergeObject, mixinObject) {
    return Object.assign({}, mergeObject, mixinObject);
  },
});
