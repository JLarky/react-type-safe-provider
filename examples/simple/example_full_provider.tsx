import React from "react";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";

function useProviderValue() {
  const [isDark, setIsDark] = useState(false);
  return useMemo(() => ({ isDark, setIsDark }), [isDark]);
}

export type Context = ReturnType<typeof useProviderValue>;

const DarkContext = createContext<Context | undefined>(undefined);
DarkContext.displayName = "DarkProvider";

export const DarkProvider = (props: PropsWithChildren) => {
  const value = useProviderValue();
  return <DarkContext.Provider value={value} {...props} />;
};

export function useDark() {
  const context = useContext(DarkContext);
  if (context === undefined) {
    throw new Error("useDark must be used within a DarkProvider");
  }
  return context;
}

export function useIsDark() {
  return useDark().isDark;
}

export function useSetDark() {
  return useDark().setIsDark;
}
