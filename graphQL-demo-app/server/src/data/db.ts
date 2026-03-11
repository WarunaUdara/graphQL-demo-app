// In-memory "database" — swap this out for a real DB in production
// (Postgres, MongoDB, SQLite — the resolvers don't care)

export interface Author {
  id: string;
  name: string;
  bio?: string;
}

export interface Book {
  id: string;
  title: string;
  description?: string;
  publishedYear?: number;
  rating?: number;
  isFavorite: boolean;
  status: 'WANT_TO_READ' | 'READING' | 'FINISHED' | 'ABANDONED';
  authorId: string;
  createdAt: string;
}

let authorIdCounter = 3;
let bookIdCounter = 6;

function generateId(prefix: string, counter: number): string {
  return `${prefix}_${counter}`;
}

export const authors: Author[] = [
  {
    id: 'author_1',
    name: 'Frank Herbert',
    bio: 'American science fiction author best known for the Dune series. His work explored ecology, religion, and politics in ways that felt oddly relevant decades later.',
  },
  {
    id: 'author_2',
    name: 'David Thomas & Andy Hunt',
    bio: 'The two "Pragmatic Programmers" who wrote the book that shaped how a generation thinks about software craftsmanship.',
  },
  {
    id: 'author_3',
    name: 'Robert C. Martin',
    bio: 'Software engineer, instructor, and author. Best known as "Uncle Bob." Strong opinions delivered with conviction.',
  },
];

export const books: Book[] = [
  {
    id: 'book_1',
    title: 'Dune',
    description: 'A desert planet. A chosen one. A planet-scale ecological system used as a metaphor for oil dependency. It holds up.',
    publishedYear: 1965,
    rating: 4.9,
    isFavorite: true,
    status: 'FINISHED',
    authorId: 'author_1',
    createdAt: '2024-01-10T09:00:00.000Z',
  },
  {
    id: 'book_2',
    title: 'Dune Messiah',
    description: 'The sequel that subverts the hero\'s journey from the first book. Darker, shorter, better if you sit with it.',
    publishedYear: 1969,
    rating: 4.2,
    isFavorite: false,
    status: 'FINISHED',
    authorId: 'author_1',
    createdAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 'book_3',
    title: 'The Pragmatic Programmer',
    description: 'Not about any specific language or framework. About how to think. You\'ll read it twice.',
    publishedYear: 1999,
    rating: 4.8,
    isFavorite: true,
    status: 'FINISHED',
    authorId: 'author_2',
    createdAt: '2024-02-01T09:00:00.000Z',
  },
  {
    id: 'book_4',
    title: 'Clean Code',
    description: 'Rules for writing code other people (including future-you) can read. Controversial in places. Essential in most.',
    publishedYear: 2008,
    rating: 4.0,
    isFavorite: false,
    status: 'READING',
    authorId: 'author_3',
    createdAt: '2024-02-20T09:00:00.000Z',
  },
  {
    id: 'book_5',
    title: 'Clean Architecture',
    description: 'What Clean Code is to functions, this is to systems. The dependency rule changed how I think about folder structure.',
    publishedYear: 2017,
    rating: undefined,
    isFavorite: false,
    status: 'WANT_TO_READ',
    authorId: 'author_3',
    createdAt: '2024-03-01T09:00:00.000Z',
  },
];

// --- Data access functions (your "database layer") ---

export const db = {
  getAllBooks: (): Book[] => books,

  getBookById: (id: string): Book | undefined => books.find(b => b.id === id),

  getBooksByStatus: (status: Book['status']): Book[] =>
    books.filter(b => b.status === status),

  searchBooks: (query: string): Book[] => {
    const q = query.toLowerCase();
    return books.filter(b => b.title.toLowerCase().includes(q));
  },

  getAllAuthors: (): Author[] => authors,

  getAuthorById: (id: string): Author | undefined => authors.find(a => a.id === id),

  getBooksByAuthorId: (authorId: string): Book[] =>
    books.filter(b => b.authorId === authorId),

  createBook: (input: Omit<Book, 'id' | 'createdAt'>): Book => {
    const book: Book = {
      ...input,
      id: generateId('book', ++bookIdCounter),
      createdAt: new Date().toISOString(),
    };
    books.push(book);
    return book;
  },

  updateBook: (id: string, updates: Partial<Book>): Book | undefined => {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    books[index] = { ...books[index], ...updates };
    return books[index];
  },

  deleteBook: (id: string): boolean => {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
  },

  createAuthor: (input: { name: string; bio?: string }): Author => {
    const author: Author = {
      ...input,
      id: generateId('author', ++authorIdCounter),
    };
    authors.push(author);
    return author;
  },
};
