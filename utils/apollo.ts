import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { PHI_AUTH, PHI_GRAPHQL_END_POINT } from "../components/apis/philand";
import { TALLY_GRAPHQL_ENDPOINT } from "../components/apis/tally";

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
    "Api-Key": PHI_AUTH,
  },
});

const client = new ApolloClient({
  link: ApolloLink.split(
    (o) => o.getContext().clientName === "philand",
    philandLink,
    ApolloLink.split(
      (o) => o.getContext().clientName === "tally",
      tallyLink,
      defaultLink
    )
  ),
  cache: new InMemoryCache(),
});

export default client;
