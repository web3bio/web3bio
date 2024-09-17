import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { LensGraphQLEndpoint } from "./lens";
import {
  AIRSTACK_GRAPHQL_ENDPOINT,
  PHI_API_ENDPOINT,
  SNAPSHOT_GRAPHQL_ENDPOINT,
  TALLY_GRAPHQL_ENDPOINT,
} from "./api";

const createHttpLink = (uri: string, headers: Record<string, string> = {}) => {
  return new HttpLink({
    uri,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
};

const defaultLink = createHttpLink(
  process.env.NEXT_PUBLIC_GRAPHQL_SERVER || "",
  {
    "x-api-key": process.env.NEXT_PUBLIC_RELATION_API_KEY || "",
  }
);

const linkMapping: Record<string, HttpLink> = {
  tally: createHttpLink(TALLY_GRAPHQL_ENDPOINT, {
    "api-key": process.env.NEXT_PUBLIC_TALLY_API_KEY || "",
  }),
  lens: createHttpLink(LensGraphQLEndpoint),
  airstack: createHttpLink(AIRSTACK_GRAPHQL_ENDPOINT),
  snapshot: createHttpLink(SNAPSHOT_GRAPHQL_ENDPOINT),
  philand: createHttpLink(PHI_API_ENDPOINT, {
    "x-api-key": process.env.NEXT_PUBLIC_PHI_API_KEY || "",
  }),
};

const getLink = (clientName?: string): HttpLink =>
  linkMapping[clientName || ""] || defaultLink;

const client = new ApolloClient({
  link: new ApolloLink((operation, forward) => {
    const clientName = operation.getContext().clientName;
    const selectedLink = getLink(clientName);
    return selectedLink.request(operation, forward);
  }),
  cache: new InMemoryCache(),
});

export default client;
