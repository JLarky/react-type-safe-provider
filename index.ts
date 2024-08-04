// from https://jsr.io/@jlarky/react-type-safe-provider
import React, { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

/**
 * Create a type-safe context with a provider and hooks.
 *
 * Example:
 * ```tsx
 * import { useMemo, useState } from "react";
 * import { createTypeSafeContext } from "@jlarky/react-type-safe-provider";
 *
 * function useProviderValue() {
 *   const [isDark, setIsDark] = useState(false);
 *   return useMemo(() => ({ isDark, setIsDark }), [isDark]);
 * }
 *
 * const { DarkProvider, useDark, useSafeDark } = createTypeSafeContext("Dark", useProviderValue);
 *
 * export { DarkProvider, useDark, useSafeDark };
 * ```
 */
export function createTypeSafeContext<
  T,
  Name extends string,
  DefaultValue = undefined,
  ProviderValue = undefined
>(
  displayName: Name,
  useProviderValue: (value: ProviderValue) => T,
  defaultValue: DefaultValue = undefined as DefaultValue
): AddPrefix<Name, { Provider: typeof Provider }> &
  AddSuffix<
    Name,
    { use: typeof useContextValue; useSafe: typeof useSafeContextValue }
  > {
  type Context = ReturnType<typeof useProviderValue>;

  const Context = createContext<Context | DefaultValue>(defaultValue);
  const providerDisplayName = `${displayName}Provider` as const;
  Context.displayName = `${displayName}Provider`;

  const Provider = (props: PropsWithChildren<{ value: ProviderValue }>) => {
    const value = useProviderValue(props.value);
    return React.createElement(Context.Provider, { value }, props.children);
  };

  function useSafeContextValue() {
    return useContext(Context);
  }

  function useContextValue() {
    const context = useContext(Context);
    if (context === defaultValue) {
      throw new Error(
        `use${displayName} must be used within a ${displayName}Provider`
      );
    }
    return context as T;
  }

  return {
    [providerDisplayName]: Provider,
    [`use${displayName}`]: useContextValue,
    [`useSafe${displayName}`]: useSafeContextValue,
  } as AddPrefix<Name, { Provider: typeof Provider }> &
    AddSuffix<
      Name,
      { use: typeof useContextValue; useSafe: typeof useSafeContextValue }
    >;
}

type AddPrefix<N extends string, T> = {
  [K in keyof T as `${N}${K & string}`]: T[K];
};

type AddSuffix<N extends string, T> = {
  [K in keyof T as `${K & string}${N}`]: T[K];
};
