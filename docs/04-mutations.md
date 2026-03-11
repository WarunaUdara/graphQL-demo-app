# 04 — Mutations

> Mutations change things. Add a book, update its rating, mark it as favorite, delete it. Same GraphQL syntax, different intent.

---

## Basic mutation

```graphql
mutation {
  addBook(input: {
    title: "Dune"
    authorId: "1"
    status: WANT_TO_READ
  }) {
    id
    title
    status
  }
}
```

Notice: mutations also return data. You ask for what you need after the change happens. No second query required.

---

## Why mutations return data

In REST, a POST returns the created resource. In GraphQL, same idea — but you control which fields come back:

```graphql
mutation AddBook($input: AddBookInput!) {
  addBook(input: $input) {
    id           # need this to update local cache
    title        # to display confirmation
    createdAt    # server-generated, client wants it
  }
}
```

If you only need the ID for cache updates:

```graphql
mutation DeleteBook($id: ID!) {
  deleteBook(id: $id)  # returns Boolean
}
```

---

## Mutations with variables (the right way)

```graphql
mutation AddBook($input: AddBookInput!) {
  addBook(input: $input) {
    id
    title
    author {
      name
    }
  }
}
```

Variables:

```json
{
  "input": {
    "title": "The Pragmatic Programmer",
    "authorId": "2",
    "publishedYear": 1999,
    "status": "WANT_TO_READ"
  }
}
```

In Apollo Client (React):

```typescript
const ADD_BOOK = gql`
  mutation AddBook($input: AddBookInput!) {
    addBook(input: $input) {
      id
      title
    }
  }
`;

const [addBook, { loading, error }] = useMutation(ADD_BOOK);

const handleSubmit = async (formData) => {
  await addBook({
    variables: { input: formData },
    refetchQueries: [{ query: GET_BOOKS }], // refresh the list
  });
};
```

---

## Update mutation

```graphql
mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
  updateBook(id: $id, input: $input) {
    id
    title
    rating
    status
  }
}
```

Variables:

```json
{
  "id": "1",
  "input": {
    "rating": 4.8,
    "status": "FINISHED"
  }
}
```

`UpdateBookInput` uses optional fields — only send what changed.

---

## Toggle favorite

```graphql
mutation ToggleFavorite($id: ID!) {
  toggleFavorite(id: $id) {
    id
    isFavorite
  }
}
```

The server flips `isFavorite` and returns the new state. Simple, idempotent-ish, clean.

---

## Error handling

GraphQL mutations don't return HTTP 4xx errors. Instead, errors live in the response:

```json
{
  "data": {
    "addBook": null
  },
  "errors": [
    {
      "message": "Author not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["addBook"],
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

In Apollo Client:

```typescript
const [addBook] = useMutation(ADD_BOOK, {
  onError: (error) => {
    console.error(error.message); // "Author not found"
    // show toast, set form error, etc.
  }
});
```

---

## Optimistic updates — snappy UI

Don't wait for the server to update the UI. Apollo Client can apply an optimistic response immediately:

```typescript
addBook({
  variables: { input: formData },
  optimisticResponse: {
    addBook: {
      __typename: 'Book',
      id: 'temp-id',
      title: formData.title,
      // ... other fields
    }
  }
});
```

If the server succeeds, the temp response is replaced. If it fails, it's rolled back. Your UI feels instant.

---

## Resolver on the backend

```typescript
const resolvers = {
  Mutation: {
    addBook: (_, { input }) => {
      const author = db.getAuthorById(input.authorId);
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      const book = db.createBook({
        ...input,
        id: generateId(),
        isFavorite: false,
        status: input.status ?? 'WANT_TO_READ',
        createdAt: new Date().toISOString(),
      });

      // notify subscribers
      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },
  },
};
```

---

## Next: [05 — Subscriptions](./05-subscriptions.md)
