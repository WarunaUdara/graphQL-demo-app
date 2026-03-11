import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS, GET_BOOKS_BY_STATUS } from '../queries/index.js';
import { BookCard } from './BookCard.js';
import { AddBookForm } from './AddBookForm.js';
import { LiveFeed } from './LiveFeed.js';
import type { Book, ReadStatus } from '../types/index.js';

type FilterStatus = 'ALL' | ReadStatus;

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'ALL', label: 'All books' },
  { value: 'READING', label: 'Reading' },
  { value: 'WANT_TO_READ', label: 'Want to Read' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'ABANDONED', label: 'Abandoned' },
];

export function BookShelf() {
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  const allBooksResult = useQuery(GET_BOOKS, { skip: filter !== 'ALL' });
  const filteredBooksResult = useQuery(GET_BOOKS_BY_STATUS, {
    variables: { status: filter },
    skip: filter === 'ALL',
  });

  const loading = filter === 'ALL' ? allBooksResult.loading : filteredBooksResult.loading;
  const error = filter === 'ALL' ? allBooksResult.error : filteredBooksResult.error;
  const books: Book[] = filter === 'ALL'
    ? ((allBooksResult.data as { books?: Book[] })?.books ?? [])
    : ((filteredBooksResult.data as { booksByStatus?: Book[] })?.booksByStatus ?? []);

  const favorites = books.filter((b) => b.isFavorite);
  const stats = {
    total: books.length,
    reading: books.filter((b) => b.status === 'READING').length,
    finished: books.filter((b) => b.status === 'FINISHED').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#1e1e2e' }}>BookShelf</span>
            <span style={{ fontSize: '13px', color: '#9ca3af', marginLeft: '10px' }}>GraphQL demo</span>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: '8px 18px', background: '#6366f1', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600,
            }}
          >
            + Add book
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'On the shelf', value: stats.total },
            { label: 'Currently reading', value: stats.reading },
            { label: 'Finished', value: stats.finished },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '10px', padding: '14px 20px', minWidth: '140px',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1e1e2e' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* GraphQL concept callout */}
        <div style={{
          background: '#f0f4ff', border: '1px solid #c7d2fe',
          borderRadius: '10px', padding: '14px 18px', marginBottom: '24px',
          fontSize: '13px', color: '#4338ca',
        }}>
          <strong>What's happening under the hood:</strong> Each component uses a different GraphQL concept.
          This filter uses <code style={{ background: '#e0e7ff', padding: '1px 5px', borderRadius: '3px' }}>useQuery</code> with variables.
          The heart button uses <code style={{ background: '#e0e7ff', padding: '1px 5px', borderRadius: '3px' }}>useMutation</code>.
          New books appear in the bottom-right via <code style={{ background: '#e0e7ff', padding: '1px 5px', borderRadius: '3px' }}>useSubscription</code>.
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: filter === opt.value ? '#6366f1' : '#e5e7eb',
                background: filter === opt.value ? '#6366f1' : '#fff',
                color: filter === opt.value ? '#fff' : '#374151',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: filter === opt.value ? 600 : 400,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Books grid */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
            Loading books...
          </div>
        )}

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: '10px', padding: '16px', color: '#dc2626',
          }}>
            <strong>Error:</strong> {error.message}
            <br />
            <small style={{ color: '#6b7280' }}>Make sure the server is running at http://localhost:4000</small>
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📚</div>
            <p>No books here yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '8px 18px', background: '#6366f1', color: '#fff',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: 600, marginTop: '8px',
              }}
            >
              Add your first book
            </button>
          </div>
        )}

        {books.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* Favorites section */}
        {filter === 'ALL' && favorites.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
              Favorites
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {favorites.map((book) => (
                <BookCard key={`fav-${book.id}`} book={book} />
              ))}
            </div>
          </div>
        )}
      </main>

      {showAddForm && <AddBookForm onClose={() => setShowAddForm(false)} />}
      <LiveFeed />
    </div>
  );
}
