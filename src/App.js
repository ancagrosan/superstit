import React, { Component } from 'react';
import fire from './fire';
import Cookies from 'universal-cookie';

import Form from './Form.js'
import Superstition from './Superstition.js'

const cookies = new Cookies();
const IPP = 20;
let referenceToOldestKey = "";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      messages: [], 
      userLikes: [],
      page: 1,
      isLoading: true,
      reachedEnd: false
    };
  }
  componentWillMount() {
    // first page load
    fire.database().ref("messages").orderByKey().limitToLast(IPP).once("value").then((snapshot) => {
      
      // change to reverse chronological order (latest first)
      let arrayOfKeys = Object.keys(snapshot.val()).sort().reverse();
      
      // transform to array
      let results = arrayOfKeys
         .map((key) => ({
           ...snapshot.val()[key],
           id: key
         }));
      
      // store reference
      referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];

      this.setState({ messages: results });
    });

    // listen to new messages
    let messagesRef = fire.database().ref('messages').orderByKey();
    messagesRef.on('child_added', snapshot => {

      let message = {
        text: snapshot.val().text,
        type: snapshot.val().type,
        country: snapshot.val().country,
        timestamp: snapshot.val().timestamp,
        voteCount: snapshot.val().voteCount,
        id: snapshot.key
      };

      this.setState({ 
        messages: [message].concat(this.state.messages),
        isLoading: false
      });
    });

    // set sn cookie if not already there
    if (!cookies.get('superstitiousNw')) {
      cookies.set('superstitiousNw', [], {path: '/' });
    } else {
      this.setState({userLikes: cookies.get('superstitiousNw')});
    }
  }

  componentDidMount() {
    // add listener on scroll
    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=this.refs.iScroll.scrollHeight){
        this.loadMoreItems();
      }
    });
  }

  loadMoreItems(){
    // know when to stop
    if (!referenceToOldestKey) {
      this.setState({reachedEnd: true, isLoading: false});
      return;
    }

    fire.database()
      .ref("messages")
      .orderByKey()
      .endAt(referenceToOldestKey)
      .limitToLast(IPP)
      .once("value")
      .then((snapshot) => {
        
        let arrayOfKeys = Object.keys(snapshot.val()).sort().reverse().slice(1);
        
        let results = arrayOfKeys
          .map((key) => ({
            ...snapshot.val()[key],
            id: key
          }));
        
        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];
        this.setState({ 
          messages: this.state.messages.concat(results),
          isLoading: false,
          reachedEnd: arrayOfKeys.length > 0 ? false : true
        });
      });
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
      <div 
        className="container"
        ref="iScroll"
      >
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
            {/* <a href="mailto:contact@superstitious.network">
              <i class="fas fa-envelope"></i>
            </a> */}
          </div>
          <div className="copy">&copy; 2019</div>
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
