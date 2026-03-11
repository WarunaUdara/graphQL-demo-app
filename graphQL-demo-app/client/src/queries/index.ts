import { gql } from '@apollo/client';

// Fragment: reusable field selections — define once, use everywhere
export const BOOK_FIELDS = gql`
  fragment BookFields on Book {
    id
    title
    description
    publishedYear
    rating
    isFavorite
    status
    createdAt
    author {
      id
      name
    }
  }
`;

// Get all books
export const GET_BOOKS = gql`
  ${BOOK_FIELDS}
  query GetBooks {
    books {
      ...BookFields
    }
  }
`;

// Get a single book by ID (uses a variable)
export const GET_BOOK = gql`
  ${BOOK_FIELDS}
  query GetBook($id: ID!) {
    book(id: $id) {
      ...BookFields
    }
  }
`;

// Get books by status (demonstrates enum variable)
export const GET_BOOKS_BY_STATUS = gql`
  ${BOOK_FIELDS}
  query GetBooksByStatus($status: ReadStatus!) {
    booksByStatus(status: $status) {
      ...BookFields
    }
  }
`;

// Get all authors
export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      bio
    }
  }
`;

// Search books by title
export const SEARCH_BOOKS = gql`
  ${BOOK_FIELDS}
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      ...BookFields
    }
  }
`;
