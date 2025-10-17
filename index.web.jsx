import React from "react";
import { AppRegistry } from "react-native";
import App from "./app/index";
import { name as appName } from "./app.json";
import { createRoot } from "react-dom/client";

AppRegistry.registerComponent(appName, () => App);

const rootTag =
  document.getElementById("root") || document.getElementById("app");
const RootComponent = AppRegistry.getApplication(appName).element;

createRoot(rootTag).render(RootComponent);
