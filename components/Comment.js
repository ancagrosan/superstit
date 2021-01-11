import ReactTimeAgo from 'react-time-ago/no-tooltip'

const Comment = (props) => {
  let comment = props.item;

  return (
    <li>
      <ReactTimeAgo children={comment.timestamp} className="info" />
      <div className="comment-text">
        {comment.text}
      </div>
    </li>
  );
}

export default Comment;
