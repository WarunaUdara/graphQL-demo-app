export type ReadStatus = 'WANT_TO_READ' | 'READING' | 'FINISHED' | 'ABANDONED';

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
  status: ReadStatus;
  author: Author;
  createdAt: string;
}
