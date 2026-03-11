import { gql } from '@apollo/client';
import { BOOK_FIELDS } from '../queries/index.js';

export const ADD_BOOK = gql`
  ${BOOK_FIELDS}
  mutation AddBook($input: AddBookInput!) {
    addBook(input: $input) {
      ...BookFields
    }
  }
`;

export const UPDATE_BOOK = gql`
  ${BOOK_FIELDS}
  mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      ...BookFields
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($id: ID!) {
    toggleFavorite(id: $id) {
      id
      isFavorite
    }
  }
`;

export const ADD_AUTHOR = gql`
  mutation AddAuthor($name: String!, $bio: String) {
    addAuthor(name: $name, bio: $bio) {
      id
      name
      bio
    }
  }
`;
