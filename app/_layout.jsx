import React, { useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../components/Colors";
import { ThemeContext } from "../components/ThemeContext";

const Layout = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);
  const theme = isEnabled ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme }}>
      <StatusBar style={isEnabled ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
          headerRight: () => (
            <View style={{ marginRight: 12 }}>
              <Switch
                value={isEnabled}
                onValueChange={toggleSwitch}
                trackColor={{
                  false: Colors.dark.iconColor,
                  true: Colors.light.iconColor,
                }}
                thumbColor={
                  isEnabled
                    ? Colors.dark.iconColorFocused
                    : Colors.light.iconColorFocused
                }
              />
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: "C_GPA" }} />
      </Stack>
    </ThemeContext.Provider>
  );
};

export default Layout;

const styles = StyleSheet.create({});
