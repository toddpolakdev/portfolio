// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
    "http://localhost:4000/api/graphql",
  cache: new InMemoryCache(),
});

export default client;
