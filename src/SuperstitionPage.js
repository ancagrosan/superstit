import React, { Component } from 'react';

import fire from './fire';
import Sidebar from './Sidebar'
import Superstition from './Superstition';

import { getCookieData, setCookieData } from './utils/cookie';

class SuperstitionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nextId: '',
            prevId: '',
            userLikes: [],
            userComments: []
        };
    }
    componentWillMount() {
        let cookieData = getCookieData();
        this.setState(cookieData);

        let currentSupId = this.props.params.id;
        let ref = fire.database().ref("messages").orderByKey();

        // get the next/prev superstitions
        ref.endAt(currentSupId).limitToLast(2).once("value").then((snapshot) => {
            Object.keys(snapshot.val()).forEach((id) => {

                // while we're here, update the page title
                if (id === currentSupId) {
                    const supText = snapshot.val()[currentSupId].text;

                    document.title = supText.length > 30
                        ? supText.substring(0,30)+ '... | The Superstitious Network'
                        : supText + ' | The Superstitious Network';

                } else {
                    this.setState({nextId: id});
                }
            });
        });

        ref.startAt(currentSupId).limitToFirst(2).once("value").then((snapshot) => {
            let prevId = Object.keys(snapshot.val()).find((id) => {
                return id !== currentSupId;
            });
            this.setState({prevId: prevId});
        });
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
                    <nav className="sup-nav">
                        {this.state.prevId &&
                            <a href={'/superstition/' + this.state.prevId}><i className="fas fa-long-arrow-alt-left"></i></a>
                        }
                        {this.state.nextId &&
                            <a href={'/superstition/' + this.state.nextId}><i className="fas fa-long-arrow-alt-right"></i></a>
                        }
                    </nav>
                </div>
            </div>
        );
    }
}

export default SuperstitionPage;