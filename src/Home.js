import React, { Component } from 'react';

import fire from './fire';
import Cookies from 'universal-cookie';
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

import Sidebar from './Sidebar'
import Form from './Form'
import Superstition from './Superstition'

JavascriptTimeAgo.locale(en)

const cookies = new Cookies();
const IPP = 20;
let referenceToOldestKey = "";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      messages: [], 
      userLikes: [],
      userComments: [],
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

    // set sn cookie if not already there
    if (!cookies.get('superstitiousNw')) {
      cookies.set('superstitiousNw', {userLikes: [], userComments: []}, {path: '/' });

    } else {
      let cookie = cookies.get('superstitiousNw');

      // since initially we could only have a list of likes set on the cookie, 
      // check if there's something in that list, and move it to userLikes if there is
      if (cookie.constructor === Array && cookie.length > 0){
        let likedSuperstitions = cookies.get('superstitiousNw');
        cookies.set('superstitiousNw', {userLikes: likedSuperstitions, userComments: []}, {path: '/' });

        this.setState({userLikes: likedSuperstitions, userComments: []});

      } else {
        this.setState({
          userLikes: cookies.get('superstitiousNw')['userLikes'],
          userComments: cookies.get('superstitiousNw')['userComments']
        });
      }
    }
  }

  componentDidMount() {
    // add listener on scroll event
    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=this.refs.iScroll.scrollHeight){
        this.loadMoreItems();
      }
    });
  }

  loadMoreItems(){
    // know when to stop
    if (this.state.messages.length && !referenceToOldestKey) {
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

  userLiked(id){
    return this.state.userLikes && this.state.userLikes.indexOf(id) > -1;
  }
  userCommented(id){
    return this.state.userComments && this.state.userComments.indexOf(id) > -1;
  }

  updateLikes(id){
    let likedIds = [ ...this.state.userLikes, id ];
    this.setState({userLikes: likedIds});

    let cookieData = cookies.get('superstitiousNw') || {};
    let newCookieData = {
      ...cookieData,
      userLiked: likedIds
    };
    
    cookies.set('superstitiousNw', newCookieData, {path: '/' });
  }
  updateComments(id){
    let commentedIds = [ ...this.state.userComments, id ]
    this.setState({userComments: commentedIds})

    let cookieData = cookies.get('superstitiousNw') || {};
    let newCookieData = {
      ...cookieData,
      userComments: commentedIds
    };
    
    cookies.set('superstitiousNw', newCookieData, {path: '/' });
  }

  render() {
    return (
        <div 
          className="container"
          ref="iScroll"
        >
          <Sidebar/>
          <div className="feedContainer">

            <Form/>

            <div>
              <ul className="superstition-list">
                { /* Render the list of superstitions */
                  this.state.messages.map( message => 
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

export default Home;
