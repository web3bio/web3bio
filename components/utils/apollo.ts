import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { PHI_AUTH, PHI_GRAPHQL_END_POINT } from "../apis/philand";
import { TALLY_AUTH, TALLY_GRAPHQL_ENDPOINT } from "../apis/tally";
import { WidgetTypes } from "./widgets";
import { PlatformType } from "./platform";
import { LensGraphQLEndpoint } from "./lens";
import { AIRSTACK_GRAPHQL_ENDPOINT } from "../apis/airstack";
import { SNAPSHOT_GRAPHQL_ENDPOINT } from "../apis/snapshot";

const defaultLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_RELATION_API_KEY || "",
  },
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
  [WidgetTypes.philand]: philandLink,
  [WidgetTypes.tally]: tallyLink,
  [PlatformType.lens]: lensLink,
  [WidgetTypes.airstackScores]: airstackLink,
  [WidgetTypes.snapshot]: snapshotLink,
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
