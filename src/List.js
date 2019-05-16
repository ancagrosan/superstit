import React, { Component } from 'react';

import Superstition from './Superstition';

import { addOrRemoveFromArray } from './utils/general';
import { getCookieData, setCookieData } from './utils/cookie';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  userLikes: [],
		  userComments: [],
		};
	}

	componentWillMount() {
		let cookieData = getCookieData();
		this.setState(cookieData);
	}
    updateLikes(id){
		let likedIds = addOrRemoveFromArray(this.state.userLikes, id);
        this.setState({userLikes: likedIds});

        let cookieData = getCookieData();
        let newCookieData = {
            ...cookieData,
            userLikes: likedIds
        };
        setCookieData(newCookieData);
    }

    updateComments(id){
        let commentedIds = [ ...this.state.userComments, id ]
        this.setState({userComments: commentedIds})

        let cookieData = getCookieData();
        let newCookieData = {
            ...cookieData,
            userComments: commentedIds
        };

        setCookieData(newCookieData);
    }

	userLiked(id){
        return this.state.userLikes && this.state.userLikes.indexOf(id) > -1;
    }

    userCommented(id){
        return this.state.userComments && this.state.userComments.indexOf(id) > -1;
	}
	render() {
		return (
			<ul className="superstition-list">
			{ /* Render the list of superstitions */
			  this.props.items.map( message =>
				<Superstition
				  item={message}
				  key={message.id}
				  userLiked={this.userLiked(message.id)}
				  userCommented={this.userCommented(message.id)}
				  updateLikes={this.updateLikes.bind(this)}
				  updateComments={this.updateComments.bind(this)}
				/>
			  )
			}
		  </ul>
		);
	}
}

export default List;