import React, { Component } from 'react';

import fire from './fire';
import Sidebar from './Sidebar';
import List from './List';
import MapView from './MapView';

class MapPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
			country: this.props.params.country,
			isLoading: true,
			messages: [],
			countPerCountry: {}
		};
	}

	componentWillMount(){
		const country = this.state.country;
		let countryOrderedSups = fire.database().ref().child('messages').orderByChild('country');

		// prepare the superstition count per country object
		countryOrderedSups.on("child_added", (snapshot) => {
			let countryName = snapshot.val().country;
			let countPerCountry = {...this.state.countPerCountry};

			// not all superstitions are tagged to a country
			if (countryName) {
				countPerCountry[countryName] = (countPerCountry[countryName] || 0) + 1;
				this.setState({
					countPerCountry: countPerCountry
				});
			}
		});

		// get the superstitions for current country
		// TODO CHECK WITH ONCE VALUE
		countryOrderedSups.equalTo(country).on("child_added", (snapshot) => {
			let messages = [...this.state.messages];
			let message = {...snapshot.val(), id: snapshot.key};

			messages.push(message);
			this.setState({
				messages: messages,
				isLoading: false
			})
		});
	}

    render() {
		let sortedMessages = [...this.state.messages];
		sortedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

		let content = <div className="loading-info">
			<i className="fas fa-spin fa-cat"></i> Loading
		</div>;

		if (!this.state.isLoading) {
			content = <main className="feedContainer">
				<div>
					<div id="map-container">
						<MapView country={this.state.country} countPerCountry={this.state.countPerCountry}/>
					</div>
					<h2>We have {sortedMessages.length}
						&nbsp;superstition{sortedMessages.length > 1 ? 's' : ''} from {this.state.country}!
					</h2>
					<List items={sortedMessages}/>
				</div>
			</main>;
		}

		return (
			<div className="container">
				<Sidebar/>
				{content}
			</div>
		);
    }
}

export default MapPage;