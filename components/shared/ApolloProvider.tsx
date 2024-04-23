"use client";
import React from "react";
import { ApolloProvider as Provider } from "@apollo/client";
import client from "../utils/apollo";
export default function ApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider client={client}>{children}</Provider>;
}
