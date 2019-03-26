import React, { Component } from 'react';

import fire from './fire';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import Sidebar from './Sidebar';
import Form from './Form';
import List from './List';

JavascriptTimeAgo.locale(en)

const IPP = 20;
let referenceToOldestKey = "";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
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

  // when a user adds a new item, add it to the stack
  userSubmittedItem(message) {
    this.setState({
      messages: [message].concat(this.state.messages)
    });
  }

  render() {
    return (
        <div
          className="container"
          ref="iScroll"
        >
          <Sidebar/>
          <div className="feedContainer">

            <Form userSubmittedItem={this.userSubmittedItem.bind(this)}/>

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

export default Home;
