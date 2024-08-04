import React from "react";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";

/**
 * Create a type-safe context with a provider and hooks.
 *
 * Example:
 * ```tsx
 * import { useMemo, useState } from "react";
 * import {createTypeSafeContext} from "@jlarky/react-type-safe-provider";
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
  DefaultValue = undefined
>(
  displayName: Name,
  useProviderValue: () => T,
  defaultValue: DefaultValue = undefined as DefaultValue
) {
  type Context = ReturnType<typeof useProviderValue>;

  const Context = createContext<Context | DefaultValue>(defaultValue);
  const providerDisplayName = `${displayName}Provider` as const;
  Context.displayName = `${displayName}Provider`;

  const Provider = (props: PropsWithChildren) => {
    const value = useProviderValue();
    return React.createElement(Context.Provider, { value, ...props });
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
