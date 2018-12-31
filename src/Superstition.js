import React, { Component } from 'react';
import fire from './fire';

import JavascriptTimeAgo from 'javascript-time-ago'
import TimeAgo from 'react-time-ago/no-tooltip'
import en from 'javascript-time-ago/locale/en'

JavascriptTimeAgo.locale(en)

class Superstition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voteCount: this.props.item.voteCount || 0
        };
    }
    componentWillMount() {
        let message = fire.database().ref('messages/' + this.props.item.id);
        message.on('value', snapshot => {
            this.setState({ voteCount: snapshot.val().voteCount });
        });
    }
    upVote(e) {
        let newVoteCount = this.state.voteCount ? this.state.voteCount + 1 : 1;
        
        return fire.database() 
            .ref('messages/' + this.props.item.id)
            .update({voteCount: newVoteCount});
    }

    render() {
        let message = this.props.item;

        return (
            <li key={message.id}>
                <div className="supertition-text">
                    {message.text}
                </div>
                
                <hr/>
                <div className="info">
                
                    {message.timestamp && 
                        <span className="mr1">
                            <img src="/images/baseline-access_time-24px.svg" alt="posted" title="posted"/>
                            <TimeAgo>
                                {message.timestamp}
                            </TimeAgo>
                        </span>
                    }

                    {message.type &&
                        <span className="mr1">
                            {message.type === 'personal'
                                ? 
                                <img src="/images/baseline-person-24px.svg" alt="type" title="type"/>
                                :
                                <img src="/images/baseline-group_add-24px.svg" alt="type" title="type"/>
                            }
                            {message.type}
                        </span>
                    }

                    {message.country &&
                        <span className="mr1">
                            <img src="/images/baseline-location_on-24px.svg" alt="location" title="location"/>
                            {message.country}
                        </span>
                    }

                    <span className="upvotes">
                        <span onClick={this.upVote.bind(this)}>
                            <img src="/images/baseline-thumb_up-24px.svg" alt="upvote" title="I believe!"/>
                        </span>
                        {this.state.voteCount}
                    </span>
                </div>
            </li>        
        );
    }
}

export default Superstition;