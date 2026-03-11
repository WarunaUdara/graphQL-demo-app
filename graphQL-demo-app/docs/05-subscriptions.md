# 05 — Subscriptions

> Real-time data without polling. When something changes, the server tells you.

---

## What are subscriptions?

Subscriptions are long-lived connections (via WebSocket) where the server pushes updates to the client when specific events happen.

```
Client                    Server
  |                          |
  |  Subscribe: bookAdded    |
  |<------------------------>|  (WebSocket connection stays open)
  |                          |
  |                          |  Someone adds a book...
  |  { bookAdded: {...} }    |
  |<-------------------------|
  |                          |
  |                          |  Someone adds another book...
  |  { bookAdded: {...} }    |
  |<-------------------------|
```

No polling. No wasted requests. The server broadcasts when something happens.

---

## When to use subscriptions

Use subscriptions for:
- Live feeds (new posts, new messages)
- Collaborative editing (someone edited this document)
- Notifications (your order shipped)
- Real-time dashboards (stock prices, metrics)

Don't use subscriptions for:
- Data you only need once (use query)
- Changes triggered by the current user (they already know)
- Infrequent updates where polling is fine

---

## Subscription definition in schema

```graphql
type Subscription {
  bookAdded: Book!
}
```

---

## Server-side: PubSub

Apollo Server uses a publish/subscribe pattern:

```typescript
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

// In your mutation resolver:
const resolvers = {
  Mutation: {
    addBook: (_, { input }) => {
      const book = db.createBook(input);

      // Publish the event
      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED']),
    },
  },
};
```

When a book is added via mutation, `pubsub.publish` fires. Any active subscriber receives the payload.

---

## Client-side: useSubscription

```typescript
const BOOK_ADDED = gql`
  subscription OnBookAdded {
    bookAdded {
      id
      title
      author {
        name
      }
    }
  }
`;

function LiveFeed() {
  const { data } = useSubscription(BOOK_ADDED);

  return (
    <div>
      {data && (
        <p>Someone just added: {data.bookAdded.title}</p>
      )}
    </div>
  );
}
```

---

## Combining query + subscription

The typical pattern: load initial data with a query, then keep it fresh with a subscription.

```typescript
function BookList() {
  const { data: queryData } = useQuery(GET_BOOKS);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (queryData) setBooks(queryData.books);
  }, [queryData]);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      setBooks(prev => [...prev, data.data.bookAdded]);
    }
  });

  return <ul>{books.map(b => <li key={b.id}>{b.title}</li>)}</ul>;
}
```

Or use `subscribeToMore` from `useQuery` — it's cleaner:

```typescript
const { data, subscribeToMore } = useQuery(GET_BOOKS);

useEffect(() => {
  const unsubscribe = subscribeToMore({
    document: BOOK_ADDED,
    updateQuery: (prev, { subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded;
      return {
        books: [...prev.books, newBook]
      };
    }
  });
  return unsubscribe;
}, []);
```

---

## WebSocket transport

Subscriptions need a different transport than HTTP queries. Apollo Client uses `graphql-ws`:

```typescript
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
}));

// Send subscriptions over WebSocket, everything else over HTTP
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({ link: splitLink, cache: new InMemoryCache() });
```

---

## Real-world example: GitHub

GitHub uses subscriptions for:
- Pull request review notifications
- CI/CD pipeline status updates
- Issue comment live feeds

When you're watching a PR and it turns green, that's a subscription pushing to your browser.

---

## Next: [06 — Real-world Patterns](./06-real-world-patterns.md)
