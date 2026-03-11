import { useState, useEffect } from 'react';
import { useSubscription, type OnDataOptions } from '@apollo/client/react';
import { BOOK_ADDED_SUBSCRIPTION } from '../subscriptions/index.js';
import type { Book } from '../types/index.js';

export function LiveFeed() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useSubscription(BOOK_ADDED_SUBSCRIPTION, {
    onData: (options: OnDataOptions<unknown>) => {
      const bookAdded = (options.data.data as { bookAdded?: Book } | undefined)?.bookAdded;
      if (bookAdded) {
        const message = `"${bookAdded.title}" by ${bookAdded.author.name} was just added`;
        setNotifications((prev) => [message, ...prev].slice(0, 5));
      }
    },
  });

  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(0, -1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [notifications]);

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column-reverse',
      gap: '8px',
      zIndex: 200,
    }}>
      {notifications.map((msg, i) => (
        <div
          key={i}
          style={{
            background: '#1e1e2e',
            color: '#e2e8f0',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            maxWidth: '320px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            borderLeft: '3px solid #6366f1',
            animation: 'slideIn 0.2s ease',
          }}
        >
          <span style={{ color: '#6366f1', fontWeight: 600 }}>New book: </span>
          {msg}
        </div>
      ))}
    </div>
  );
}
