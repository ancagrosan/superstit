import React, { Component } from 'react';
import fire from './fire';

import Sidebar from './Sidebar'
import Superstition from './Superstition';

class SuperstitionPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            message: {},
            comments: [],
            voteCount: 0,
            commentText: '',
            formValid: false,
            showComments: true
        };
    }
    
    componentWillMount() {
        let message = fire.database().ref('messages/' + this.props.params.id);
        this.setState({message: message});

        message.on('value', snapshot => {
            this.setState({
                comments: snapshot.val().comments,
                voteCount: snapshot.val().voteCount
            });
        });
    }

    render() {
        let message = this.state.message;

        return (
            <div>
                <Sidebar/>
                
                <Superstition 
                      item={message} 
                      key={message.id} 
                      userLiked={this.userLiked(message.id)} 
                      userCommented={this.userCommented(message.id)}
                      updateLikes={this.updateLikes.bind(this)}
                      updateComments={this.updateComments.bind(this)}
                    />
            </div>
        );
    }
}

export default SuperstitionPage;