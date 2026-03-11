import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './apolloClient.js';
import { BookShelf } from './components/BookShelf.js';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BookShelf />
    </ApolloProvider>
  );
}
