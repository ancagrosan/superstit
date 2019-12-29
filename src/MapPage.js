import React, { useState, useEffect } from 'react';

import fire from './fire';
import Sidebar from './Sidebar'
import List from './List';

const MapPage = (props) => {
	const country = props.params.country;
	const [isLoading, setIsLoading] = useState(true);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		let ref = fire.database().ref().child('messages');
		let incomingMessages = [];

		ref.orderByChild('country').equalTo(country).on("child_added", (snapshot) => {
			let message = { ...snapshot.val(), id: snapshot.key };
			incomingMessages.push(message);

			setMessages([...incomingMessages]);
			setIsLoading(false);
		});
	}, []);

	let sortedMessages = [...messages];
	sortedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

	let content = (
		<div className="loading-info">
			<i className="fas fa-spin fa-cat"></i> Loading
		</div>
	);

	if (!isLoading) {
		content = (
			<main className="feedContainer">
				<div>
					<h2>We have {sortedMessages.length}
						&nbsp;superstition{sortedMessages.length > 1 ? 's' : ''} from {country}!
						</h2>
					<List items={sortedMessages} />
				</div>
			</main>
		);
	}

	return (
		<div className="container">
			<Sidebar />
			{content}
		</div>
	);

}

export default MapPage;