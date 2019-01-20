import React, { Component } from 'react';

import Sidebar from './Sidebar'
import Superstition from './Superstition';

class SuperstitionPage extends Component {

    render() {
        let item = {
            id: this.props.params.id
        };
        return (
            <div className="container">
                <Sidebar/>
                <div className="feedContainer">
                    <ul className="superstition-list">
                        <Superstition item={item} showComments={true}/>
                    </ul>
                </div>
            </div>
        );
    }
}

export default SuperstitionPage;