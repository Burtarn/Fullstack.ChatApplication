import React, { useState } from 'react';

const AddComment = ({ onAddComment }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
        onAddComment(content);
        setContent(''); // Rensa formuläret
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Skriv en kommentar"
            required
        />
        <button type="submit">Skicka kommentar</button>
        </form>
    );
};

export default AddComment;
