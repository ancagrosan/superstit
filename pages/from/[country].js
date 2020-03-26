import React, { useState, useEffect } from 'react';
import { useRouter, withRouter } from 'next/router';

import fire from '../../utils/fire';
import Sidebar from '../../components/Sidebar';
import List from '../../components/List';
import MapView from '../../components/MapView';
import CustomHead from '../../components/CustomHead';

const MapPage = () => {
	const router = useRouter();
	const country = router.query.country;

	const [messages, setMessages] = useState([]);
	const [countPerCountry, setCountPerCountry] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setMessages([]);
		let countryOrderedSups = fire.database().ref().child('messages').orderByChild('country');
		let incomingMessages = [];
		let incomingCountryData = {};

		// prepare the superstition count per country object
		countryOrderedSups.on("child_added", (snapshot) => {
			let countryName = snapshot.val().country;
			let message = { ...snapshot.val(), id: snapshot.key };

			// get the superstitions for current country
			if (countryName === country) {
				incomingMessages.push(message);
				setMessages([...incomingMessages]);
			}

			// not all superstitions are tagged to a country
			if (countryName) {
				incomingCountryData = {
					...incomingCountryData,
					[countryName]: (incomingCountryData[countryName] || 0) + 1
				};
			}

			setCountPerCountry({ ...incomingCountryData });
			setIsLoading(false);
		});
	}, [country]);

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
				<div id="map-container">
					<MapView country={country} countPerCountry={countPerCountry} />
				</div>
				<h2>
					{sortedMessages.length
						?
						<span>
							We have {sortedMessages.length}
							&nbsp;superstition{sortedMessages.length > 1 ? 's' : ''} from {country}!
							</span>
						:
						<span>
							Unfortunately there are no superstitions from {country} 😞
								<br />
							Please add some if you know any!
						</span>
					}

				</h2>
				<List items={sortedMessages} />
			</main>
		);
	}

	return (
		<>
			<CustomHead />
			<div className="container">
				<Sidebar />
				{content}
			</div>
		</>
	);
}

export default withRouter(MapPage);