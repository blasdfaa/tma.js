import { InjectionToken } from '@angular/core';
import {
  retrieveAndroidDeviceData,
  retrieveLaunchParams,
  retrieveRawInitData,
  retrieveRawLaunchParams,
  type AndroidDeviceData,
  type RetrieveLaunchParamsResult,
} from '@tma.js/sdk';

/**
 * Provides the Telegram Mini Apps launch parameters.
 * Override in tests with a mock value to avoid calling the real SDK.
 *
 * @example
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [{ provide: TMA_LAUNCH_PARAMS, useValue: mockLaunchParams }],
 * });
 * ```
 */
export const TMA_LAUNCH_PARAMS = new InjectionToken<RetrieveLaunchParamsResult>(
  '@tma.js/sdk-angular: launchParams',
  { factory: () => retrieveLaunchParams() },
);

/**
 * Provides the raw launch parameters string from any known source.
 * Override in tests to avoid calling the real SDK.
 */
export const TMA_RAW_LAUNCH_PARAMS = new InjectionToken<string>(
  '@tma.js/sdk-angular: rawLaunchParams',
  { factory: () => retrieveRawLaunchParams() },
);

/**
 * Provides the raw init data string from any known source.
 * Override in tests to avoid calling the real SDK.
 */
export const TMA_RAW_INIT_DATA = new InjectionToken<string | undefined>(
  '@tma.js/sdk-angular: rawInitData',
  { factory: () => retrieveRawInitData() },
);

/**
 * Provides Android device data parsed from `navigator.userAgent`.
 * Override in tests to avoid calling the real SDK.
 */
export const TMA_ANDROID_DEVICE_DATA = new InjectionToken<AndroidDeviceData>(
  '@tma.js/sdk-angular: androidDeviceData',
  { factory: () => retrieveAndroidDeviceData() },
);
