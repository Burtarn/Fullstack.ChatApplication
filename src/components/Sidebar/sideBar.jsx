import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaStickyNote, FaSignInAlt, FaComments, FaBars } from 'react-icons/fa';
import '../../components/Sidebar/sideBar.css';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
            <FaBars />
        </button>

        <nav>
            <ul>
            <li>
                <Link to="/">
                <FaHome className="icon" />
                {!collapsed && <span>Start</span>}
                </Link>
            </li>
            <li>
                <Link to="/login">
                <FaSignInAlt className="icon" />
                {!collapsed && <span>Logga in</span>}
                </Link>
            </li>
            <li>
                <Link to="/chat">
                <FaComments className="icon" />
                {!collapsed && <span>Chatt</span>}
                </Link>
            </li>
            </ul>
        </nav>
        </div>
    );
};

export default Sidebar;
