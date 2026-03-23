---
outline: [ 2, 3 ]
---

# @tma.js/sdk-angular

<p style="display: inline-flex; gap: 8px">
  <a href="https://npmjs.com/package/@tma.js/sdk-angular">
    <img src="https://img.shields.io/npm/v/@tma.js/sdk-angular?logo=npm"/>
  </a>
  <a href="https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/sdk-angular">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

Angular package providing utilities that developers may find useful when developing a mini application.

> [!TIP]
> Since this package offers utility functions that extend the functionality of [@tma.js/sdk](./tma-js-sdk.md), it is
> recommended to review the SDK package documentation first.

## Installation

Before proceeding, it is assumed that you have already installed the `@angular/core` package (v18+), as it is a peer
dependency of this package.

::: code-group

```bash [pnpm]
pnpm i @tma.js/sdk-angular
```

```bash [npm]
npm i @tma.js/sdk-angular
```

```bash [yarn]
yarn add @tma.js/sdk-angular
```

:::

> [!INFO]
> This package fully re-exports the [@tma.js/sdk](./tma-js-sdk.md) package, so you don't need to install it separately.

## Usage

Here is a simple usage example:

```ts [app.component.ts]
import { Component } from '@angular/core';
import { init, backButton, tmaToSignal } from '@tma.js/sdk-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<p>Back button visible: {{ isVisible() }}</p>`,
})
export class AppComponent {
  constructor() {
    init();
    backButton.mount();
    backButton.show();
  }

  readonly isVisible = tmaToSignal(backButton.isVisible);
}
```

## `tmaToSignal`

Converts a Telegram Mini Apps [signal](./tma-js-signals.md) to a read-only Angular `Signal`. Subscribes to the TMA
signal immediately and automatically unsubscribes when the owning injector is destroyed (e.g. when the component is
destroyed).

Must be called in an injection context **or** an explicit `injector` must be supplied via `options.injector` — the same
pattern as Angular's built-in `toSignal`.

```ts
import { Component, Injector, effect } from '@angular/core';
import { backButton, tmaToSignal } from '@tma.js/sdk-angular';

@Component({ standalone: true, template: '' })
export class BackButtonHostComponent {
  constructor() {
    if (!backButton.isMounted()) {
      backButton.mount();
    }
  }

  // Field initializer — runs in injection context, no extra options needed.
  readonly isVisible = tmaToSignal(backButton.isVisible);

  private readonly logVisibility = effect(() => {
    console.log('The button is', this.isVisible() ? 'visible' : 'invisible');
  });
}
```

When you need to call `tmaToSignal` **outside** of an injection context (e.g. inside a `Promise` or `setTimeout`), pass
an explicit injector:

```ts
import { Component, Injector } from '@angular/core';
import { themeParams, tmaToSignal } from '@tma.js/sdk-angular';

@Component({ standalone: true, template: '' })
export class ExampleComponent {
  private readonly injector = inject(Injector);
  bgColor!: ReturnType<typeof tmaToSignal>;

  ngOnInit() {
    // Outside field initializer — pass injector explicitly.
    this.bgColor = tmaToSignal(themeParams.backgroundColor, { injector: this.injector });
  }
}
```

## `injectLaunchParams`

Retrieves the application launch parameters. It works like the `retrieveLaunchParams` function described in the
`@tma.js/bridge`
[documentation](./tma-js-bridge/launch-parameters#retrieving-launch-parameters).

```ts
import { Component } from '@angular/core';
import { injectLaunchParams } from '@tma.js/sdk-angular';

@Component({ standalone: true, template: '' })
export class ExampleComponent {
  readonly launchParams = injectLaunchParams();
  readonly launchParamsCamel = injectLaunchParams(true);
}
```

Passing `true` converts all snake_case keys to camelCase using `deepSnakeToCamelObjKeys`.

## `injectRawLaunchParams`

Returns launch parameters in a raw format from any known source.

```ts
import { injectRawLaunchParams } from '@tma.js/sdk-angular';

const raw = injectRawLaunchParams();
// 'tgWebAppBotInline=0&tgWebAppData=%7B%22user%22%3A%7B%7D...'
```

## `injectRawInitData`

Uses the [retrieveRawInitData](./tma-js-bridge/launch-parameters#retrieving-raw-init-data) function under the hood.

```ts
import { injectRawInitData } from '@tma.js/sdk-angular';

const data = injectRawInitData();
// '{"user":...,"auth_date":...,"query_id":...,...}' or undefined
```

## `injectAndroidDeviceData`

Retrieves [Android device data](https://core.telegram.org/bots/webapps#additional-data-in-user-agent) from
`navigator.userAgent`.

The function always returns an object describing the Android device data with all keys marked as optional.

```ts
import { injectAndroidDeviceData } from '@tma.js/sdk-angular';

const deviceData = injectAndroidDeviceData();
// Example complete output:
// {
//   manufacturer: 'Samsung',
//   performanceClass: 'AVERAGE',
//   model: 'SM-A155F',
//   androidVersion: '14',
//   sdkVersion: 34,
// }
```

## `injectAndroidDeviceDataFrom`

Same as [injectAndroidDeviceData](#injectandroiddevicedata), but accepts a custom user agent string. Unlike
`injectAndroidDeviceData`, this function does **not** use the DI token and can be called outside of an injection
context.

```ts
import { injectAndroidDeviceDataFrom } from '@tma.js/sdk-angular';

const deviceData = injectAndroidDeviceDataFrom(navigator.userAgent);
// Example complete output:
// {
//   manufacturer: 'Samsung',
//   performanceClass: 'AVERAGE',
//   model: 'SM-A155F',
//   androidVersion: '14',
//   sdkVersion: 34,
// }
```

## DI Tokens

The package exposes Angular `InjectionToken`s that back the inject helpers above. You can override them in tests to
avoid calling the real SDK.

| Token                    | Type                        | Backed by                    |
|--------------------------|-----------------------------|------------------------------|
| `TMA_LAUNCH_PARAMS`      | `RetrieveLaunchParamsResult`| `retrieveLaunchParams()`     |
| `TMA_RAW_LAUNCH_PARAMS`  | `string`                    | `retrieveRawLaunchParams()`  |
| `TMA_RAW_INIT_DATA`      | `string \| undefined`       | `retrieveRawInitData()`      |
| `TMA_ANDROID_DEVICE_DATA`| `AndroidDeviceData`         | `retrieveAndroidDeviceData()`|

### Overriding tokens in tests

```ts
import { TestBed } from '@angular/core/testing';
import { TMA_LAUNCH_PARAMS, TMA_ANDROID_DEVICE_DATA } from '@tma.js/sdk-angular';

TestBed.configureTestingModule({
  providers: [
    { provide: TMA_LAUNCH_PARAMS, useValue: { tgWebAppPlatform: 'web' } },
    {
      provide: TMA_ANDROID_DEVICE_DATA,
      useValue: { manufacturer: 'Samsung', model: 'SM-A155F' },
    },
  ],
});
```
