'use client';

import { useState } from 'react';

export default function ShareMealForm() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState('');
  const [creator, setCreator] = useState('');
  const [creator_email, setCreatorEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log('Form submitted:', Object.fromEntries(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="share-form">
      <h2>Share Your Meal</h2>
      <div className="form-row">
        <label htmlFor="title">Meal Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="creator">Your Name</label>
        <input
          id="creator"
          type="text"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="creator_email">Your Email</label>
        <input
          id="creator_email"
          type="email"
          value={creator_email}
          onChange={(e) => setCreatorEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Share Meal</button>
    </form>
  );
}