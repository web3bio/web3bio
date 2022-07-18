import { ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    uri: 'https://relation-service.nextnext.id/',
    cache: new InMemoryCache(),
});

export default client