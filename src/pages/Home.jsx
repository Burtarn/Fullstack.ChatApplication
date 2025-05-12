import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../src/redux/slices/postsSlice';

const Home = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);
    const postStatus = useSelector((state) => state.posts.status);
    const error = useSelector((state) => state.posts.error);

    useEffect(() => {
        if (postStatus === 'idle') {
        dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    let content;

    if (postStatus === 'loading') {
        content = <p>Laddar inlägg...</p>;
    } else if (postStatus === 'succeeded') {
        content = posts.map((post) => (
        <div key={post.post_id}>
            <Link to={`/posts/${post.post_id}`}>{post.title}</Link>
        </div>
        ));
    } else if (postStatus === 'failed') {
        content = <p>Fel vid hämtning: {error}</p>;
    }

    return (
        <div>
        <h1>Välkommen till Inläggssidan!</h1>
        <p>Här är en lista på alla inlägg:</p>
        {content}
        </div>
    );
};

export default Home;
