import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { ADD_BOOK, ADD_AUTHOR } from '../mutations/index.js';
import { GET_AUTHORS, GET_BOOKS } from '../queries/index.js';
import type { ReadStatus } from '../types/index.js';

interface Author {
  id: string;
  name: string;
}

interface AddBookFormProps {
  onClose: () => void;
}

export function AddBookForm({ onClose }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [status, setStatus] = useState<ReadStatus>('WANT_TO_READ');
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorBio, setNewAuthorBio] = useState('');
  const [error, setError] = useState('');

  const { data: authorsData } = useQuery(GET_AUTHORS);
  const authors = (authorsData as { authors?: Author[] })?.authors ?? [];

  const [addBook, { loading: addingBook }] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onCompleted: () => onClose(),
    onError: (err: Error) => setError(err.message),
  });

  const [addAuthor, { loading: addingAuthor }] = useMutation(ADD_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
    onCompleted: (data: unknown) => {
      const result = data as { addAuthor: { id: string } };
      setAuthorId(result.addAuthor.id);
      setShowNewAuthor(false);
      setNewAuthorName('');
      setNewAuthorBio('');
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!authorId) { setError('Please select or add an author'); return; }

    addBook({
      variables: {
        input: {
          title: title.trim(),
          description: description.trim() || undefined,
          authorId,
          publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
          status,
        },
      },
    });
  };

  const handleAddAuthor = () => {
    if (!newAuthorName.trim()) return;
    addAuthor({
      variables: {
        name: newAuthorName.trim(),
        bio: newAuthorBio.trim() || undefined,
      },
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '16px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '28px',
        width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '20px' }}>Add a book</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dune"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
              Author *
            </label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              style={{ ...inputStyle, background: '#f9fafb' }}
            >
              <option value="">Select an author</option>
              {authors.map((a: Author) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewAuthor(!showNewAuthor)}
              style={{
                marginTop: '6px', fontSize: '13px', color: '#6366f1',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              {showNewAuthor ? 'Cancel' : '+ Add a new author'}
            </button>
          </div>

          {showNewAuthor && (
            <div style={{
              background: '#f0f4ff', borderRadius: '8px', padding: '12px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              <input
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
                placeholder="Author name *"
                style={inputStyle}
              />
              <input
                value={newAuthorBio}
                onChange={(e) => setNewAuthorBio(e.target.value)}
                placeholder="Short bio (optional)"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={handleAddAuthor}
                disabled={addingAuthor || !newAuthorName.trim()}
                style={{
                  padding: '8px', background: '#6366f1', color: '#fff',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                }}
              >
                {addingAuthor ? 'Adding...' : 'Add author'}
              </button>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this book about?"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
                Published year
              </label>
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
                placeholder="e.g. 1965"
                min="1000"
                max={new Date().getFullYear()}
                style={inputStyle}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReadStatus)}
                style={{ ...inputStyle, background: '#f9fafb' }}
              >
                <option value="WANT_TO_READ">Want to Read</option>
                <option value="READING">Reading</option>
                <option value="FINISHED">Finished</option>
                <option value="ABANDONED">Abandoned</option>
              </select>
            </div>
          </div>

          {error && (
            <p style={{ margin: 0, color: '#ef4444', fontSize: '13px', background: '#fef2f2', padding: '8px 12px', borderRadius: '6px' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '10px', border: '1px solid #e5e7eb',
                borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingBook}
              style={{
                flex: 1, padding: '10px', background: '#6366f1', color: '#fff',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
              }}
            >
              {addingBook ? 'Adding...' : 'Add to shelf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
