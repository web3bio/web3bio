import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { PHI_AUTH, PHI_GRAPHQL_END_POINT } from "../apis/philand";
import { TALLY_AUTH, TALLY_GRAPHQL_ENDPOINT } from "../apis/tally";
import { WidgetTypes } from "./widgets";

const defaultLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER,
});

const philandLink = new HttpLink({
  uri: PHI_GRAPHQL_END_POINT,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": PHI_AUTH,
  },
});

const tallyLink = new HttpLink({
  uri: TALLY_GRAPHQL_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "Api-Key": TALLY_AUTH,
  },
});

const client = new ApolloClient({
  link: ApolloLink.split(
    (o) => o.getContext().clientName === WidgetTypes.philand,
    philandLink,
    ApolloLink.split(
      (o) => o.getContext().clientName === WidgetTypes.tally,
      tallyLink,
      defaultLink
    )
  ),
  cache: new InMemoryCache(),
});

export default client;
