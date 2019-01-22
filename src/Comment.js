import React, { Component } from 'react';
import TimeAgo from 'react-time-ago/no-tooltip'

class Comment extends Component {
  render() {
    let comment = this.props.item;

    return (
        <li>
            <TimeAgo className="info">
                {comment.timestamp}
            </TimeAgo>
            <div className="comment-text">
                {comment.text}
            </div>
        </li>
    );
  }
}

export default Comment;
