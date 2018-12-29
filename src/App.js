import React, { Component } from 'react';
import fire from './fire';

import Form from './Form.js'
import Superstition from './Superstition.js'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      messages: [], 
    };
  }
  componentWillMount() {
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

  render() {
    return (
      <div className="container">
        <div className="nav">
          <h1><span className="word">Superstitious</span> Network</h1>
          <div className="social">
            <a href="#">
              <img src="/images/facebook.svg" alt="facebook"/>
            </a>
            <a href="#">
              <img src="/images/twitter.svg" alt="twitter"/>
            </a>
          </div>
        </div>
        <div className="feedContainer">

          <Form/>

          <div className="feed">
            <ul>
              { /* Render the list of superstitions */
                this.state.messages.map( message => 
                  <Superstition item={message} key={message.id} />)
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
