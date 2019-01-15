import React, { Component } from 'react';
import fire from './fire';
import TimeAgo from 'react-time-ago/no-tooltip'

import Comment from './Comment.js';

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
    toggleCommentsSection(e){
        this.setState({showComments: !this.state.showComments});
    }
    addComment(e){
        e.preventDefault();
        const timestamp = Date.now();

        this.props.updateComments(this.props.item.id);

        fire.database().ref('messages/' + this.props.item.id + '/comments').push({
            text: this.state.commentText,
            timestamp: timestamp
        });

        this.setState({
            commentText: '',
            timestamp: timestamp,
            formValid: false
        });    
    }

    render() {
        let message = this.props.item;
        let userLiked = this.props.userLiked;
        let userCommented = this.props.userCommented;

        return (
            <li 
                key={message.id}
                className={ 
                        (
                            this.state.voteCount >= 9 ? "highlight very-popular" : 
                            this.state.voteCount >= 7 ? "highlight popular" : 
                            this.state.voteCount >= 5 ? "highlight pretty-popular" : ""
                        )
                    }
                >
                
                <div className="meta-info info">
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
                </div>

                <div className="superstition-text">
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
                            className={"new-comment " + (this.state.formValid ? 'has-input' : '')}
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
                <div className="actions">                    
                    <span className="upvotes">
                        {userLiked ? (
                            <i className="fas fa-heart"></i>
                        ) : (
                            <span className="empty-heart" onClick={this.upVote.bind(this)}>
                                <i className="far fa-heart"></i>
                            </span>
                        )}
                        <span className="count">{this.state.voteCount}</span>
                    </span>

                    <span className="comments-icon">
                        <i 
                            className={"fa-comment " + (userCommented ? 'fas' : 'far')}
                            onClick={this.toggleCommentsSection.bind(this)}>
                        </i>
                        
                        {this.state.comments &&
                            <span className="count">{Object.keys(this.state.comments).length}</span>
                        }
                    </span>
                </div>
            </li>        
        );
    }
}

export default Superstition;