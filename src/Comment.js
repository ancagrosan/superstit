import React, { Component } from 'react';

import JavascriptTimeAgo from 'javascript-time-ago'
import TimeAgo from 'react-time-ago/no-tooltip'
import en from 'javascript-time-ago/locale/en'

JavascriptTimeAgo.locale(en)

class Comment extends Component {
  render() {
    let comment = this.props.item;

    return (
        <li key={comment.id}>
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
