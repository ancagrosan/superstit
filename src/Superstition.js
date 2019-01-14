import React, { Component } from 'react';
import fire from './fire';

import JavascriptTimeAgo from 'javascript-time-ago'
import TimeAgo from 'react-time-ago/no-tooltip'
import en from 'javascript-time-ago/locale/en'

import Comment from './Comment.js';

JavascriptTimeAgo.locale(en)

class Superstition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: this.props.item.comments || [],
            voteCount: this.props.item.voteCount || 0,
            commentText: '',
            formValid: false,
            showComments: false
        };
    }
    componentWillMount() {
        let message = fire.database().ref('messages/' + this.props.item.id);
        message.on('value', snapshot => {
            this.setState({
                comments: snapshot.val().comments,
                voteCount: snapshot.val().voteCount
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
    textareaChange(e) {
        let formValid = this.state.formValid;

        if (e.target.value.trim().length > 0 && e.target.value.trim().length < 500){
            formValid = true
        } else {
            formValid = false
        }

        this.setState({
            commentText: e.target.value,
            formValid: formValid
        });
    }
    openComments(e){
        this.setState({showComments: true});
    }
    addComment(e){
        e.preventDefault();
        const timestamp = Date.now();

        fire.database().ref('messages/' + this.props.item.id + '/comments').push({
            text: this.state.commentText,
            timestamp: timestamp
        });

        this.setState({
            commentText: '',
            timestamp: timestamp
        });    
    }

    render() {
        let message = this.props.item;
        let isLiked = this.props.isLiked;

        return (
            <li 
                key={message.id}
                className={ "highlight " + 
                        (
                            this.state.voteCount >= 9 ? "very-popular" : 
                            this.state.voteCount >= 7 ? "popular" : 
                            this.state.voteCount >= 5 ? "pretty-popular" : ""
                        )
                    }
                >
            
                <div className="supertition-text">
                    {message.text}
                </div>

                <div className={"comments " + (this.state.showComments ? "open" : "")}>
                    {this.state.comments &&
                        <ul className="comment-list">                        
                            {Object.keys(this.state.comments).map(key => 
                                <Comment 
                                    item={this.state.comments[key]} 
                                    key={key} 
                                />
                            )}
                        </ul>
                    }
                    
                    <form onSubmit={this.addComment.bind(this)} >
                        <textarea 
                            className="new-comment"
                            type="text" 
                            onChange={this.textareaChange.bind(this)}
                            placeholder="got something to add?"
                            rows="3"
                            value={this.state.commentText} />

                        <button 
                            disabled={! this.state.formValid}
                            type="submit"
                            className="add-comment-btn">
                            COMMENT
                        </button>                 
                    </form>
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

                    <span className="comments-icon">
                        <i className="far fa-comment" onClick={this.openComments.bind(this)}></i>
                        {this.state.comments && 
                            <span>{Object.keys(this.state.comments).length}</span>
                        }
                    </span>
                    
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