import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const webStorage = {
  getItem: async (key) => {
    try {
      const value = window.localStorage.getItem(key);
      return value !== null ? value : null;
    } catch (e) {
      console.error("webStorage getItem error:", e);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.error("webStorage setItem error:", e);
    }
  },
  removeItem: async (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error("webStorage removeItem error:", e);
    }
  },
  multiRemove: async (keys) => {
    try {
      keys.forEach((key) => window.localStorage.removeItem(key));
    } catch (e) {
      console.error("webStorage multiRemove error:", e);
    }
  },
};

export default Platform.OS === "web" ? webStorage : AsyncStorage;
