import React, { Component } from 'react';
import fire from './fire';

import JavascriptTimeAgo from 'javascript-time-ago'
import TimeAgo from 'react-time-ago/no-tooltip'
import en from 'javascript-time-ago/locale/en'

JavascriptTimeAgo.locale(en)

class Superstition extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            voteCount: this.props.item.voteCount || 0
        };
    }
    componentWillMount() {
        let message = fire.database().ref('messages/' + this.props.item.id);
        message.on('value', snapshot => {
            this.setState({ 
                voteCount: snapshot.val().voteCount,
            });
        });
    }
    upVote(e) {
        // update likes count
        let newVoteCount = this.state.voteCount ? this.state.voteCount + 1 : 1;

        this.props.updateLikes(this.props.item.id);

        return fire.database() 
            .ref('messages/' + this.props.item.id)
            .update({voteCount: newVoteCount});
    }

    render() {
        let message = this.props.item;
        let isLiked = this.props.isLiked;

        return (
            <li 
                key={message.id}
                className={ 
                        this.state.voteCount >= 9 ? "highlight very-popular" : 
                        this.state.voteCount >= 7 ? "highlight popular" : 
                        this.state.voteCount >= 5 ? "highlight pretty-popular" : ""
                    }
                >
            
                <div className="supertition-text">
                    {message.text}
                </div>
                
                <hr/>
                <div className="info">
                
                    {message.timestamp && 
                        <span className="info-box">
                            <i className="far fa-clock"></i>
                            <TimeAgo>
                                {message.timestamp}
                            </TimeAgo>
                        </span>
                    }

                    {message.type &&
                        <span className="info-box">
                            {message.type === 'personal'
                                ? 
                                <i className="fas fa-user"></i>
                                :
                                <i className="fas fa-users"></i>
                            }
                            {message.type}
                        </span>
                    }

                    {message.country &&
                        <span className="info-box">
                            <i className="fas fa-map-marker-alt"></i>
                            {message.country}
                        </span>
                    }

                    
                    <span className="upvotes">
                        {isLiked ? (
                            <i className="fas fa-heart"></i>
                        ) : (
                            <span className="empty-heart" onClick={this.upVote.bind(this)}>
                                <i className="far fa-heart"></i>
                            </span>
                        )}
                        {this.state.voteCount}
                    </span>
                </div>
            </li>        
        );
    }
}

export default Superstition;