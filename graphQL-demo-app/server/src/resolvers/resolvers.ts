import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { db } from '../data/db.js';

export const pubsub = new PubSub();

const BOOK_ADDED = 'BOOK_ADDED';

export const resolvers = {
  // -------------------------------------------
  // Query resolvers — handle read operations
  // Each function maps to a Query field in schema
  // -------------------------------------------
  Query: {
    books: () => db.getAllBooks(),

    book: (_: unknown, { id }: { id: string }) => {
      const book = db.getBookById(id);
      if (!book) {
        throw new GraphQLError(`Book with id "${id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return book;
    },

    authors: () => db.getAllAuthors(),

    booksByStatus: (_: unknown, { status }: { status: string }) =>
      db.getBooksByStatus(status as any),

    searchBooks: (_: unknown, { query }: { query: string }) =>
      db.searchBooks(query),
  },

  // -------------------------------------------
  // Mutation resolvers — handle write operations
  // -------------------------------------------
  Mutation: {
    addBook: (_: unknown, { input }: { input: any }) => {
      const author = db.getAuthorById(input.authorId);
      if (!author) {
        throw new GraphQLError(`Author with id "${input.authorId}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const book = db.createBook({
        title: input.title,
        description: input.description,
        publishedYear: input.publishedYear,
        authorId: input.authorId,
        isFavorite: false,
        status: input.status ?? 'WANT_TO_READ',
        rating: undefined,
      });

      // Publish event so subscribers get notified
      pubsub.publish(BOOK_ADDED, { bookAdded: book });

      return book;
    },

    updateBook: (_: unknown, { id, input }: { id: string; input: any }) => {
      const book = db.getBookById(id);
      if (!book) {
        throw new GraphQLError(`Book with id "${id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return db.updateBook(id, input);
    },

    deleteBook: (_: unknown, { id }: { id: string }) => {
      const book = db.getBookById(id);
      if (!book) {
        throw new GraphQLError(`Book with id "${id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return db.deleteBook(id);
    },

    toggleFavorite: (_: unknown, { id }: { id: string }) => {
      const book = db.getBookById(id);
      if (!book) {
        throw new GraphQLError(`Book with id "${id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return db.updateBook(id, { isFavorite: !book.isFavorite });
    },

    addAuthor: (_: unknown, { name, bio }: { name: string; bio?: string }) => {
      return db.createAuthor({ name, bio });
    },
  },

  // -------------------------------------------
  // Subscription resolvers — real-time events
  // -------------------------------------------
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator([BOOK_ADDED]),
    },
  },

  // -------------------------------------------
  // Type resolvers — resolve relationships
  // Book.author is resolved here, not in Query
  // This is called for every book that includes `author`
  // -------------------------------------------
  Book: {
    author: (book: { authorId: string }) => {
      return db.getAuthorById(book.authorId);
    },
  },

  Author: {
    books: (author: { id: string }) => {
      return db.getBooksByAuthorId(author.id);
    },
  },
};
