import React, { useState, useEffect } from 'react';
import fire from '../utils/fire';
import ReactTimeAgo from 'react-time-ago/no-tooltip';

import Link from 'next/link';

import Comment from './Comment';

const Superstition = (props) => {
    const item = props.item;

    const [message, setMessage] = useState(item);
    const [comments, setComments] = useState(item.comments || {});
    const [voteCount, setVoteCount] = useState(item.voteCount || 0);
    const [commentText, setCommentText] = useState('');
    const [formValid, setFormValid] = useState(false);
    const [showComments, setShowComments] = useState(item.showComments);
    const [popularityCount, setPopularityCount] = useState(0);

    useEffect(() => {
        const messageRef = fire.database().ref('messages/' + item.id);
        messageRef.on('value', snapshot => {
            const value = snapshot.val();
            if (value) {
                setMessage({ ...value, id: item.id });
                setComments(value.comments);
                setVoteCount(value.voteCount);
            }
        });
    }, []);

    useEffect(() => {
        const commentsLength = comments ? Object.keys(comments).length : 0;
        setPopularityCount(voteCount + commentsLength);
    }, [comments, voteCount]);

    const toggleVote = () => {
        // update likes list
        props.updateLikes(item.id);

        // update likes count
        let newVoteCount = props.userLiked
            ? (voteCount - 1)
            : (voteCount ? voteCount + 1 : 1)

        return fire.database()
            .ref('messages/' + item.id)
            .update({ voteCount: newVoteCount });
    }

    const textareaChange = (e) => {
        if (e.target.value.trim().length > 0 && e.target.value.trim().length < 500) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
        setCommentText(e.target.value);
    }

    const toggleCommentsSection = () => {
        setShowComments(!showComments)
    }

    const addComment = (e) => {
        e.preventDefault();
        props.updateComments(item.id);

        fire.database().ref('messages/' + item.id + '/comments').push({
            text: commentText,
            timestamp: Date.now()
        });

        // Reset comment form
        setCommentText("");
        setFormValid(false);
    }

    let userLiked = props.userLiked;
    let userCommented = props.userCommented;

    if (!message.timestamp) {
        return (
            <div className="loading-info">
                <i className="fas fa-spin fa-cat"></i> Loading
            </div>
        );
    }

    let supLink;

    if (item.standalone) {
        supLink = <ReactTimeAgo children={message.timestamp} />;
    } else {
        supLink = <Link href="/superstition/[id]" as={`/superstition/${message.id}`}><a><ReactTimeAgo children={message.timestamp} /></a></Link>
    }

    return (
        <li
            className={(
                popularityCount >= 9 ? "highlight very-popular"
                    : popularityCount >= 7 ? "highlight popular"
                        : popularityCount >= 5 ? "highlight pretty-popular" : ""
            )}
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
                        <Link href="/from/[country]" as={`/from/${encodeURIComponent(message.country)}`}><a>{message.country}</a></Link>
                    </span>
                }
            </div>

            <div className="superstition-text">
                {message.text}
            </div>

            <div className={"comments " + (showComments ? "open" : "")}>
                {comments &&
                    <ul className="comment-list">
                        {Object.keys(comments).map(key =>
                            <Comment
                                item={comments[key]}
                                key={key}
                            />
                        )}
                    </ul>
                }

                <form onSubmit={addComment} >
                    <textarea
                        className={"new-comment " + (formValid ? 'has-input' : '')}
                        type="text"
                        onChange={textareaChange}
                        placeholder="got something to add?"
                        rows="3"
                        value={commentText} />

                    <button
                        disabled={!formValid}
                        type="submit"
                        className="add-comment-btn">
                        COMMENT
                    </button>
                </form>
            </div>

            <hr />
            <div className="actions">
                <span className="upvotes">
                    <span className="empty-heart" onClick={toggleVote}>
                        <i className={(userLiked ? 'fas' : 'far') + " fa-heart"}></i>
                    </span>
                    <span className="count">{voteCount}</span>
                </span>

                <span className="comments-icon">
                    <i
                        className={"fa-comment " + (userCommented ? 'fas' : 'far')}
                        onClick={toggleCommentsSection}>
                    </i>

                    {comments &&
                        <span className="count">{Object.keys(comments).length}</span>
                    }
                </span>
            </div>
        </li>
    );
}

export default Superstition;