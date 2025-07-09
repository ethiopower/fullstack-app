'use client';

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    // Fetch message from backend
    fetch('http://localhost:3001')
      .then(res => res.json())
      .then(data => setBackendMessage(data.message))
      .catch(err => console.error('Error fetching from backend:', err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Our Online Store
      </h1>
      <p className="text-xl">
        Frontend is running!
      </p>
      {backendMessage && (
        <p className="mt-4 text-green-600">
          Backend says: {backendMessage}
        </p>
      )}
    </main>
  );
} 