"use client";

import { Provider } from "react-redux";
import store from "./store";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).store = store;
}

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};


export default ReduxProvider;
