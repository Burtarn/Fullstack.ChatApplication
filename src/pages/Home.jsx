import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/posts');
            if (response.ok) {
            const data = await response.json();
            setPosts(data);
            } else {
            console.error('Fel vid hämtning av inlägg:', response.status);
            }
        } catch (err) {
            console.error('Nätverksfel:', err);
        }
        };

        fetchPosts();
    }, []);

    return (
        <div>
        <h1>Välkommen till Inläggssidan!</h1>
        <p>Här är en lista på alla inlägg:</p>

        {posts.map((post) => (
            <div key={post.post_id}>
            <Link to={`/posts/${post.post_id}`}>{post.title}</Link>
            </div>
        ))}
        </div>
    );
};

export default Home;
