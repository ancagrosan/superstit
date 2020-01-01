import React from 'react';

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="content">
                <div>Having found a not found page is always a good sign!</div>
                <a href="/"><i className="fas fa-cat"></i></a>
                <div>Click on the cat to go home.</div>
            </div>
        </div>
    );
}

export default NotFound;