"use client";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import store from "../../state";
export default function Provider({ children }: { children: React.ReactNode }) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
