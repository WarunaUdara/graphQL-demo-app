import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # -------------------------------------------
  # Enums — constrained string values
  # Real-world use: order status, user roles
  # -------------------------------------------
  enum ReadStatus {
    WANT_TO_READ
    READING
    FINISHED
    ABANDONED
  }

  # -------------------------------------------
  # Types — the shape of your data
  # These are what clients receive back
  # -------------------------------------------
  type Author {
    id: ID!
    name: String!
    bio: String
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    description: String
    publishedYear: Int
    rating: Float
    isFavorite: Boolean!
    status: ReadStatus!
    author: Author!
    createdAt: String!
  }

  # -------------------------------------------
  # Input types — for mutations (write operations)
  # Separate from output types intentionally
  # -------------------------------------------
  input AddBookInput {
    title: String!
    description: String
    publishedYear: Int
    authorId: ID!
    status: ReadStatus
  }

  input UpdateBookInput {
    title: String
    description: String
    publishedYear: Int
    rating: Float
    status: ReadStatus
    isFavorite: Boolean
  }

  # -------------------------------------------
  # Query — read operations (like GET in REST)
  # -------------------------------------------
  type Query {
    books: [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    booksByStatus(status: ReadStatus!): [Book!]!
    searchBooks(query: String!): [Book!]!
  }

  # -------------------------------------------
  # Mutation — write operations (POST/PUT/DELETE)
  # -------------------------------------------
  type Mutation {
    addBook(input: AddBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!
    toggleFavorite(id: ID!): Book!
    addAuthor(name: String!, bio: String): Author!
  }

  # -------------------------------------------
  # Subscription — real-time events via WebSocket
  # -------------------------------------------
  type Subscription {
    bookAdded: Book!
  }
`;
