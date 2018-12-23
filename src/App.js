import React, { Component } from 'react';
import fire from './fire';
import { CountryDropdown } from 'react-country-region-selector';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], text: '', country: '', type: 'general' }; // <- set up react state
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
        id: snapshot.key
      };
      
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }
  addMessage(e){
    e.preventDefault();
    
    fire.database().ref('messages').push({
      text: this.state.text,
      type: this.state.type,
      country: this.state.country
    });

    this.setState({
      text: '',
      country: '',
      type: 'general',
    });    
  }

  selectType(e){
    this.setState({ type: e.target.value });
  }
  selectCountry (val) {
    this.setState({ country: val });
  }
  textareaChange(e) {
    this.setState({ text: e.target.value });
  }

  render() {
    const { country } = this.state;

    return (
      <div>
        <form onSubmit={this.addMessage.bind(this)}>
          <textarea 
            className="new-superstitions" 
            type="text" 
            onChange={this.textareaChange.bind(this)}
            placeholder="Write your superstition here" 
            value={this.state.text} />
          
          <div>
            <input 
              onChange={this.selectType.bind(this)} 
              type="radio" 
              value="general" 
              name="type" 
              checked={this.state.type=="general"}/>
            General
            
            <input 
              onChange={this.selectType.bind(this)} 
              type="radio" 
              value="personal" 
              checked={this.state.type=="personal"}
              name="type"/>
            Personal
          </div>

          <CountryDropdown onChange={(val) => this.selectCountry(val)} value={country}/>

          <button type="submit">add</button>
        </form>

        <div className="feed">
          <ul>
            { /* Render the list of superstitions */
              this.state.messages.map( message => <li key={message.id}>
                {message.text} 
                <br/>
                type: {message.type}, origin: {message.country}
              </li> )
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
