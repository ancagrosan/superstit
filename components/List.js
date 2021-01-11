import { useState, useEffect } from 'react';

import Superstition from './Superstition';

import { addOrRemoveFromArray } from '../utils/general';
import { getStoredData, setLiked, setCommented } from '../utils/storage';

const List = (props) => {
	const [userLikes, setUserLikes] = useState([]);
	const [userComments, setUserComments] = useState([]);

	// get cookie data on first render
	useEffect(() => {
		let storedData = getStoredData();
		setUserLikes(storedData.userLikes);
		setUserComments(storedData.userComments);
	}, []);

	const updateLikes = (id) => {
		let likedIds = addOrRemoveFromArray(userLikes, id);
		setUserLikes(likedIds);
		setLiked(likedIds);
	}

	const updateComments = (id) => {
		let commentedIds = [...userComments, id];
		setUserComments(commentedIds);
		setCommented(commentedIds);
	}

	const userLiked = (id) => {
		return userLikes && userLikes.indexOf(id) > -1;
	}

	const userCommented = (id) => {
		return userComments && userComments.indexOf(id) > -1;
	}

	return (
		<ul className="superstition-list">
			{ /* Render the list of superstitions */
				props.items.map(message =>
					<Superstition
						key={message.id}
						item={message}
						userLiked={userLiked(message.id)}
						userCommented={userCommented(message.id)}
						updateLikes={updateLikes}
						updateComments={updateComments}
					/>
				)
			}
		</ul>
	);
}

export default List;