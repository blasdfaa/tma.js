import { inject } from '@angular/core';
import {
  retrieveAndroidDeviceDataFrom,
  deepSnakeToCamelObjKeys,
  type AndroidDeviceData,
  type DeepConvertSnakeKeysToCamelCase,
  type RetrieveLaunchParamsResult,
} from '@tma.js/sdk';

import {
  TMA_ANDROID_DEVICE_DATA,
  TMA_LAUNCH_PARAMS,
  TMA_RAW_INIT_DATA,
  TMA_RAW_LAUNCH_PARAMS,
} from './tokens.js';

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 */
export function injectLaunchParams(camelCase?: false): RetrieveLaunchParamsResult;
/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 */
export function injectLaunchParams(
  camelCase: true,
): DeepConvertSnakeKeysToCamelCase<RetrieveLaunchParamsResult>;
export function injectLaunchParams(
  camelCase?: boolean,
): RetrieveLaunchParamsResult | DeepConvertSnakeKeysToCamelCase<RetrieveLaunchParamsResult> {
  const lp = inject(TMA_LAUNCH_PARAMS);
  return camelCase ? deepSnakeToCamelObjKeys(lp) : lp;
}

/**
 * @returns Launch parameters in a raw format from any known source.
 * @see retrieveRawLaunchParams
 */
export function injectRawLaunchParams(): string {
  return inject(TMA_RAW_LAUNCH_PARAMS);
}

/**
 * @returns Raw init data from any known source.
 */
export function injectRawInitData(): string | undefined {
  return inject(TMA_RAW_INIT_DATA);
}

/**
 * Retrieves Android device data from `navigator.userAgent`.
 * @see https://core.telegram.org/bots/webapps#additional-data-in-user-agent
 */
export function injectAndroidDeviceData(): AndroidDeviceData {
  return inject(TMA_ANDROID_DEVICE_DATA);
}

/**
 * Retrieves Android device data from the specified User Agent.
 * @see https://core.telegram.org/bots/webapps#additional-data-in-user-agent
 * @param userAgent - user agent string to parse.
 */
export function injectAndroidDeviceDataFrom(userAgent: string): AndroidDeviceData {
  return retrieveAndroidDeviceDataFrom(userAgent);
}
