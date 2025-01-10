// components/CreateCollectionModal.js

import React, { useState } from 'react';

export default function CreateCollectionModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null); // File
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      const response = await fetch('http://localhost:8000/libraries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust token retrieval as per your auth setup
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(); // Refresh collections
        onClose();
      } else {
        setError(data.message || 'Failed to create collection');
      }
    } catch (err) {
      setError('An error occurred while creating the collection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Collection Name</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full"
              onChange={handleThumbnailChange}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
