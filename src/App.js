import React, { Component } from 'react';
import fire from './fire';
import Cookies from 'universal-cookie';

import Form from './Form.js'
import Superstition from './Superstition.js'

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      messages: [], 
      userLikes: []
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
    });

    // set sn cookie if not already there
    if (!cookies.get('superstitiousNw')) {
      cookies.set('superstitiousNw', [], {path: '/' });
    } else {
      this.setState({userLikes: cookies.get('superstitiousNw')});
    }
  }

  isLiked(id){
    return this.state.userLikes.indexOf(id) > -1;
  }

  updateLikes(id){
    let likedIds = [ ...this.state.userLikes, id ];
    this.setState({userLikes: likedIds});
    cookies.set('superstitiousNw', likedIds, {path: '/' });
  }

  render() {
    return (
      <div className="container">
        <div className="nav">
          <h1><span>Superstitious</span> Network</h1>
          <h2>
            The invisible network that holds our world together.
          </h2>
          <div className="social">
            <a href="https://www.facebook.com/superstitiousnetwork/" target="_blank" rel='noreferrer noopener'>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com/superstitiousnw" target="_blank" rel='noreferrer noopener'>
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
        <div className="feedContainer">

          <Form/>

          <div className="feed">
            <ul>
              { /* Render the list of superstitions */
                this.state.messages.map( message => 
                  <Superstition 
                    item={message} 
                    key={message.id} 
                    isLiked={this.isLiked(message.id)} 
                    updateLikes={this.updateLikes.bind(this)}
                  />
                )
              }
            </ul>
          </div>
        </div>

        <div className="sn-icons">
          <i className="fas fa-spin slower-spin fa-cat"></i>
          <i className="fas fa-spin slow-spin fa-cross"></i>
          <i className="fas fa-spin slower-spin fa-cloud-moon"></i>
          <i className="fas fa-spin slower-spin fa-bolt"></i>
          <i className="fas fa-spin fa-eye"></i>
        </div>
      </div>
    );
  }
}

export default App;
