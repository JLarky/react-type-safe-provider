import React from "react";
import { useMemo, useState } from "react";
import { createTypeSafeContext } from "../..";

function useProviderValue() {
  const [isDark, setIsDark] = useState(false);
  return useMemo(() => ({ isDark, setIsDark }), [isDark]);
}

const {
  DarkProvider,
  useDark,
  useSafeDark: _,
} = createTypeSafeContext("Dark", useProviderValue);

export { DarkProvider, useDark };

export function useIsDark() {
  return useDark().isDark;
}

export function useSetDark() {
  return useDark().setIsDark;
}
