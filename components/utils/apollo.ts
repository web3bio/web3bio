import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
// import { PHI_AUTH, PHI_GRAPHQL_END_POINT } from "../apis/philand";
import { LensGraphQLEndpoint } from "./lens";
import {
  AIRSTACK_GRAPHQL_ENDPOINT,
  SNAPSHOT_GRAPHQL_ENDPOINT,
  TALLY_GRAPHQL_ENDPOINT,
} from "./api";

const defaultLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_RELATION_API_KEY || "",
  },
});

const tallyLink = new HttpLink({
  uri: TALLY_GRAPHQL_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "Api-Key": process.env.NEXT_PUBLIC_TALLY_API_KEY || "",
  },
});
const airstackLink = new HttpLink({
  uri: AIRSTACK_GRAPHQL_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

const snapshotLink = new HttpLink({
  uri: SNAPSHOT_GRAPHQL_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

const lensLink = new HttpLink({
  uri: LensGraphQLEndpoint,
});

const linkMapping = {
  ["tally"]: tallyLink,
  ["lens"]: lensLink,
  ["airstack"]: airstackLink,
  ["snapshot"]: snapshotLink,
};

const getLink = (clientName) => linkMapping[clientName] || defaultLink;

const client = new ApolloClient({
  link: new ApolloLink((operation, forward) => {
    const clientName = operation.getContext().clientName;
    const selectedLink = getLink(clientName);
    return selectedLink.request(operation, forward);
  }),
  cache: new InMemoryCache(),
});

export default client;
