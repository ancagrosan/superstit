import React, { Component } from 'react';
import fire from './fire';
import TimeAgo from 'react-time-ago/no-tooltip'

import Comment from './Comment';

class Superstition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: this.props.item,
            comments: this.props.item.comments || {},
            voteCount: this.props.item.voteCount || 0,
            commentText: '',
            formValid: false,
            standalone: this.props.standalone,
            showComments: this.props.showComments,
            popularityCount: 0
        };
    }

    componentWillMount() {
        let messageRef = fire.database().ref('messages/' + this.props.item.id);
        messageRef.on('value', snapshot => {
            let value = snapshot.val();

            this.setState({
                message: {
                    ...value,
                    id: this.props.item.id
                },
                comments: value.comments,
                voteCount: value.voteCount
            });
        });
    }

    componentDidMount() {
        this.setState({popularityCount: this.state.voteCount + Object.keys(this.state.comments).length});
    }

    toggleVote() {
        // update likes list
        this.props.updateLikes(this.props.item.id);

        // update likes count
        let newVoteCount = this.props.userLiked
            ? (this.state.voteCount - 1)
            : (this.state.voteCount ? this.state.voteCount + 1 : 1)

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

    toggleCommentsSection(){
        this.setState({showComments: !this.state.showComments});
    }

    addComment(e){
        e.preventDefault();
        this.props.updateComments(this.props.item.id);

        fire.database().ref('messages/' + this.props.item.id + '/comments').push({
            text: this.state.commentText,
            timestamp: Date.now()
        });

        // Reset comment form
        this.setState({
            commentText: '',
            formValid: false
        });
    }

    render() {
        let message = this.state.message;
        let userLiked = this.props.userLiked;
        let userCommented = this.props.userCommented;

        if (!message.timestamp) {
            return (
                <div className="loading-info">
                    <i className="fas fa-spin fa-cat"></i> Loading
                </div>
            );
        }

        let supLink;
        if (this.state.standalone) {
            supLink = <TimeAgo>{message.timestamp}</TimeAgo>;
        } else {
            supLink = <a href={'/superstition/' + message.id}><TimeAgo>{message.timestamp}</TimeAgo></a>
        }

        return (
            <li
                className={
                        (
                            this.state.popularityCount >= 9 ? "highlight very-popular" :
                            this.state.popularityCount >= 7 ? "highlight popular" :
                            this.state.popularityCount >= 5 ? "highlight pretty-popular" : ""
                        )
                    }
                >

                <div className="meta-info info">
                    {message.timestamp &&
                        <span className="info-box">
                            <i className="far fa-clock"></i>
                            {supLink}
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
                        <span className="empty-heart" onClick={this.toggleVote.bind(this)}>
                            <i className={(userLiked ? 'fas' : 'far') + " fa-heart"}></i>
                        </span>
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