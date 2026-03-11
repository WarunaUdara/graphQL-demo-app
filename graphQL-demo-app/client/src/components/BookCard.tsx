import { type Book, type ReadStatus } from '../types/index.js';
import { useMutation } from '@apollo/client/react';
import { TOGGLE_FAVORITE, DELETE_BOOK, UPDATE_BOOK } from '../mutations/index.js';
import { GET_BOOKS } from '../queries/index.js';

const STATUS_LABELS: Record<ReadStatus, string> = {
  WANT_TO_READ: 'Want to Read',
  READING: 'Reading',
  FINISHED: 'Finished',
  ABANDONED: 'Abandoned',
};

const STATUS_COLORS: Record<ReadStatus, string> = {
  WANT_TO_READ: '#6366f1',
  READING: '#f59e0b',
  FINISHED: '#10b981',
  ABANDONED: '#6b7280',
};

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE);
  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onError: (err: Error) => alert(err.message),
  });
  const [updateBook] = useMutation(UPDATE_BOOK, {
    onError: (err: Error) => alert(err.message),
  });

  const handleStatusChange = (status: ReadStatus) => {
    updateBook({ variables: { id: book.id, input: { status } } });
  };

  const handleRating = (rating: number) => {
    updateBook({ variables: { id: book.id, input: { rating } } });
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      background: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      position: 'relative',
    }}>
      {/* Favorite button */}
      <button
        onClick={() => toggleFavorite({ variables: { id: book.id } })}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          opacity: book.isFavorite ? 1 : 0.3,
        }}
        title={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {book.isFavorite ? '★' : '☆'}
      </button>

      {/* Title */}
      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, paddingRight: '32px', lineHeight: 1.3 }}>
        {book.title}
      </h3>

      {/* Author */}
      <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
        by {book.author.name}
        {book.publishedYear && ` · ${book.publishedYear}`}
      </p>

      {/* Description */}
      {book.description && (
        <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: 1.5, fontStyle: 'italic' }}>
          {book.description}
        </p>
      )}

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
          background: `${STATUS_COLORS[book.status]}20`,
          color: STATUS_COLORS[book.status],
          border: `1px solid ${STATUS_COLORS[book.status]}40`,
        }}>
          {STATUS_LABELS[book.status]}
        </span>

        {/* Rating stars */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '0',
                color: (book.rating ?? 0) >= star ? '#f59e0b' : '#d1d5db',
              }}
              title={`Rate ${star}/5`}
            >
              ★
            </button>
          ))}
          {book.rating && (
            <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '4px' }}>
              {book.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Status changer */}
      <select
        value={book.status}
        onChange={(e) => handleStatusChange(e.target.value as ReadStatus)}
        style={{
          fontSize: '13px',
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          background: '#f9fafb',
          cursor: 'pointer',
          color: '#374151',
        }}
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {/* Delete */}
      <button
        onClick={() => {
          if (confirm(`Delete "${book.title}"?`)) {
            deleteBook({ variables: { id: book.id } });
          }
        }}
        style={{
          fontSize: '12px',
          padding: '4px 0',
          background: 'none',
          border: 'none',
          color: '#ef4444',
          cursor: 'pointer',
          textAlign: 'left',
          opacity: 0.7,
        }}
      >
        Remove from shelf
      </button>
    </div>
  );
}
