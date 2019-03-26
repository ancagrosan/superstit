import React, { Component } from 'react';

import fire from './fire';
import Sidebar from './Sidebar'
import List from './List';

class MapPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
			country: this.props.params.country,
			messages: []
		};
	}

	componentWillMount(){
		const country = this.state.country;
		let ref = fire.database().ref().child('messages');
		let messages = [];

		ref.orderByChild('country').equalTo(country).on("child_added",(snapshot) => {
			let message = {...snapshot.val(), id: snapshot.key};
			messages.push(message)
			this.setState({messages: messages})
		});
	}

    render() {

        return (
            <div className="container">
                <Sidebar/>
                <div className="feedContainer">
					<h2>News from {this.state.country}:</h2>

					<div>
						<List items={this.state.messages}/>
						{ this.state.isLoading &&
							<div className="loading-info">
							<i className="fas fa-spin fa-cat"></i> Loading
							</div>
						}
						{ this.state.reachedEnd &&
							<div className="loading-info">
							<i className="fas fa-cat"></i> That's that.
							</div>
						}
					</div>
                </div>
            </div>
        );
    }
}

export default MapPage;