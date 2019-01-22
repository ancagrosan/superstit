import React, { Component } from 'react';

import Sidebar from './Sidebar'
import Superstition from './Superstition';

import { getCookieData, setCookieData } from './utils/cookie';

class SuperstitionPage extends Component {
    componentWillMount() {
        let cookieData = getCookieData();
        this.setState(cookieData);
    }

    userLiked(id){
        return this.state.userLikes && this.state.userLikes.indexOf(id) > -1;
    }

    userCommented(id){
        return this.state.userComments && this.state.userComments.indexOf(id) > -1;
    }

    updateLikes(id){
        let likedIds = [ ...this.state.userLikes, id ];
        this.setState({userLikes: likedIds});

        let cookieData = getCookieData();
        let newCookieData = {
            ...cookieData,
            userLiked: likedIds
        };
        setCookieData(newCookieData);
    }

    updateComments(id){
        let commentedIds = [ ...this.state.userComments, id ]
        this.setState({userComments: commentedIds})

        let cookieData = getCookieData();
        let newCookieData = {
            ...cookieData,
            userComments: commentedIds
        };

        setCookieData(newCookieData);
    }

    render() {
        let item = {
            id: this.props.params.id
        };
        return (
            <div className="container superstition-page">
                <Sidebar/>
                <div className="feedContainer">
                    <ul className="superstition-list">
                        <Superstition
                            item={item}
                            standalone={true}
                            showComments={true}
                            userLiked={this.userLiked(item.id)}
                            userCommented={this.userCommented(item.id)}
                            updateLikes={this.updateLikes.bind(this)}
                            updateComments={this.updateComments.bind(this)}/>
                    </ul>
                </div>
            </div>
        );
    }
}

export default SuperstitionPage;