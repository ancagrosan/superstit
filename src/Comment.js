import React from 'react';
import TimeAgo from 'react-time-ago/no-tooltip'

const Comment = (props) => {
  let comment = props.item;

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

export default Comment;
