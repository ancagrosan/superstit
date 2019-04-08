import React, { Component } from 'react';

class Sidebar extends Component {
    render() {
        return (
            <header className="nav">
                <h1><a className="logo" href="/"><span>Superstitious</span> Network</a></h1>
                <h2>
                    The invisible network that holds our world together.
                </h2>
                <div className="social">
                <a href="https://www.facebook.com/superstitiousnetwork/" target="_blank" rel='noreferrer noopener'>
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com/superstitiousnw" target="_blank" rel='noreferrer noopener'>
                    <i className="fab fa-twitter"></i>
                </a>
                <a href="mailto:contact@superstitious.network">
                    <i className="fas fa-envelope"></i>
                </a>
                </div>
                <div className="copy">&copy; 2019, Transylvania</div>
          </header>
        );
    }
}

export default Sidebar;