import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext<any>({});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColor = Appearance.getColorScheme();
  const [colorScheme, setColorScheme] = useState(systemColor);
  const { setColorScheme: setNativewindColorScheme } = useColorScheme();

  const toggleColorScheme = () => {
    const nextScheme = colorScheme === "light" ? "dark" : "light";
    setColorScheme(nextScheme);
    setNativewindColorScheme(nextScheme);
    AsyncStorage.setItem("colorScheme", nextScheme);
  };

  useEffect(() => {
    const fetchScheme = async () => {
      const scheme = await AsyncStorage.getItem("colorScheme");
      if (scheme === "light" || scheme === "dark") {
        setColorScheme(scheme);
        setNativewindColorScheme(scheme);
      }
    };
    fetchScheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

export const useAppColorTheme = () => useContext(ThemeContext);
