import React, { Component } from 'react';
import fire from './fire';

import JavascriptTimeAgo from 'javascript-time-ago'
import TimeAgo from 'react-time-ago/no-tooltip'
import en from 'javascript-time-ago/locale/en'

import Form from './Form.js'

JavascriptTimeAgo.locale(en)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      messages: [], 
    };
  }
  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */

      let message = {
        text: snapshot.val().text,
        type: snapshot.val().type,
        country: snapshot.val().country,
        timestamp: snapshot.val().timestamp,
        voteCount: snapshot.val().voteCount,
        id: snapshot.key
      };
      
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }

  upVote(e) {
    console.log("clicking up: ", this.message.voteCount);
    let count = !!this.message.voteCount
    this.setState({ voteCount: count+1 });
  }

  render() {
    return (
      <div className="feedContainer">

        <Form/>

        <div className="feed">
          <ul>
            { /* Render the list of superstitions */
              this.state.messages.map( message => 
              <li key={message.id}>
                {message.text} 
                <hr/>
                type: {message.type}

                {message.country &&
                  <span>
                    origin:&nbsp;
                    {message.country}
                  </span>
                }
                
                {message.timestamp && 
                  <span>posted on:&nbsp;
                    <TimeAgo>
                      {message.timestamp}
                    </TimeAgo>
                  </span>
                }

                <span 
                  className="upvotes"
                  onClick={this.upVote.bind(this)}>
                  count: -{message.voteCount}-
                  up
                </span>
              </li> )
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
