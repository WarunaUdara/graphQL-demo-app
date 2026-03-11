import { gql } from '@apollo/client';
import { BOOK_FIELDS } from '../queries/index.js';

export const BOOK_ADDED_SUBSCRIPTION = gql`
  ${BOOK_FIELDS}
  subscription OnBookAdded {
    bookAdded {
      ...BookFields
    }
  }
`;
