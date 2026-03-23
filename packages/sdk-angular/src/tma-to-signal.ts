import {
  assertInInjectionContext,
  DestroyRef,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  type Signal,
} from '@angular/core';

/**
 * Options describing a single `sub` call in the TMA signal contract.
 */
export type TmaSignalSubOptions = { once?: boolean };

/**
 * Minimal shape of a Telegram Mini Apps signal compatible with {@link tmaToSignal}.
 */
export type TmaSignal<T> = {
  (): T;
  sub(fn: (v: T) => void): VoidFunction;
};

/**
 * Converts a Telegram Mini Apps signal to a read-only Angular {@link Signal}.
 *
 * Subscribes to the TMA signal immediately and unsubscribes when the owning
 * injector is destroyed (component, directive, or any environment injector).
 *
 * Must be called in an injection context **or** an explicit `injector` must be
 * supplied via `options.injector` — the same pattern as Angular's built-in `toSignal`.
 *
 * @param source - a Telegram Mini Apps signal to convert.
 * @param options.injector - optional injector; allows calling the function
 *   outside of injection context (e.g. inside a `Promise` or `setTimeout`).
 *
 * @example
 * ```ts
 * // Field initializer (injection context – no options needed)
 * readonly bgColor = tmaToSignal(themeParams.backgroundColor);
 *
 * // Outside injection context – pass an explicit injector
 * readonly bgColor = tmaToSignal(themeParams.backgroundColor, { injector: this.injector });
 * ```
 */
export function tmaToSignal<T>(
  source: TmaSignal<T>,
  options?: { injector?: Injector },
): Signal<T> {
  if (!options?.injector) {
    assertInInjectionContext(tmaToSignal);
  }

  const injector = options?.injector ?? inject(Injector);

  return runInInjectionContext(injector, () => {
    const destroyRef = inject(DestroyRef);
    const internal = signal(source());
    const unsub = source.sub(v => internal.set(v));

    destroyRef.onDestroy(unsub);

    return internal.asReadonly();
  });
}
