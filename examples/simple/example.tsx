import React, { useEffect } from "react";
import {
  DarkProvider,
  useDark,
  useIsDark,
  useSetDark,
} from "./example_provider";

export const Example = () => {
  return (
    <DarkProvider>
      <Test1 />
      <Test2 />
    </DarkProvider>
  );
};

const Test1 = () => {
  const setDark = useSetDark();
  useEffect(() => {
    setDark(true);
  }, [setDark]);
  return null;
};

const Test2 = () => {
  const { isDark: _ } = useDark();
  const isDark = useIsDark();
  return <span>{isDark ? "dark" : "light"}</span>;
};
