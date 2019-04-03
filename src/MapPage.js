import React, { Component } from 'react';

import fire from './fire';
import Sidebar from './Sidebar'
import List from './List';

class MapPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
			country: this.props.params.country,
			isLoading: true,
			messages: []
		};
	}

	componentWillMount(){
		const country = this.state.country;
		let ref = fire.database().ref().child('messages');
		let messages = [];

		ref.orderByChild('country').equalTo(country).on("child_added",(snapshot) => {
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
			content = <div className="feedContainer">
				<div>
					<h2>We have {sortedMessages.length}
						&nbsp;superstition{sortedMessages.length > 1 ? 's' : ''} from {this.state.country}!
					</h2>
					<List items={sortedMessages}/>
				</div>
			</div>;
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