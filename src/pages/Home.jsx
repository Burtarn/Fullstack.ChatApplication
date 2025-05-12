
import React from 'react';
import { Link } from 'react-router-dom';

    const Home = () => {
    return (
        <div>
        <h1>Välkommen till Inläggssidan!</h1>
        <p>Här är en lista på alla inlägg:</p>
        <Link to="/posts/1">Inlägg 1</Link>
        <br />
        <Link to="/posts/2">Inlägg 2</Link>

        </div>
    );
};

export default Home;
