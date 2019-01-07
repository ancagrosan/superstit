import React, { Component } from 'react';
import fire from './fire';
import { CountryDropdown } from 'react-country-region-selector';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            text: '', 
            country: '', 
            type: 'general',
            textareaFontSize: '2',
            formValid: false,
            isFormVisible: false
        };
    }
    addMessage(e){
        e.preventDefault();
        const timestamp = Date.now();
        
        fire.database().ref('messages').push({
            text: this.state.text,
            type: this.state.type,
            country: this.state.country,
            timestamp: timestamp
        });

        this.setState({
            text: '',
            country: '',
            type: 'general',
            timestamp: timestamp
        });    
    }
    selectType(e){
        this.setState({ type: e.target.value });
    }
    selectCountry (val) {
        this.setState({ country: val });
    }
    textareaChange(e) {
        let length = e.target.value.length,
            fontSize = this.state.textareaFontSize,
            formValid = this.state.formValid;

        if (e.target.value.trim().length > 0 && e.target.value.trim().length < 500){
            formValid = true
        } else {
            formValid = false
        }

        if(length>120){
            fontSize = 1;
        } else if (length>90){
            fontSize = 1.25;
        } else if (length>60){
            fontSize = 1.5;
        } else if (length>30){
            fontSize = 1.75;
        } else {
            fontSize = 2;
        }

        this.setState({
            text: e.target.value,
            textareaFontSize: fontSize,
            formValid: formValid
        });
    }
    displayForm(){
        // on mobile, we don't show the add superstition form from the beginning
        this.setState({isFormVisible: true});
    }
    render() {
        const { country } = this.state;

        return (
            <div>
                <div 
                    onClick={this.displayForm.bind(this)}
                    className={"add-yours " + (this.state.isFormVisible ? 'hide' : '')}>
                    ADD YOURS
                </div>
                <form 
                    onSubmit={this.addMessage.bind(this)} 
                    className={this.state.isFormVisible ? "display-form" : ""}>
                    <textarea 
                        className="new-superstition"
                        style={{fontSize: this.state.textareaFontSize + 'rem'}}
                        type="text" 
                        onChange={this.textareaChange.bind(this)}
                        placeholder="What's your superstition about, is it personal, where is it from?"
                        rows="6"
                        value={this.state.text} />
                    
                    <div className="options-container">
                        <div className="type-select">
                            
                            <input 
                                onChange={this.selectType.bind(this)} 
                                type="radio" 
                                value="general" 
                                name="type" 
                                id="type-general"
                                className='form-radio'
                                checked={this.state.type==="general"}/>
                            <label htmlFor="type-general">General</label>
                            
                            <input 
                                onChange={this.selectType.bind(this)} 
                                type="radio" 
                                value="personal" 
                                name="type"
                                id="type-personal"
                                className='form-radio'
                                checked={this.state.type==="personal"}/>
                            <label htmlFor="type-personal">Personal</label>
                            
                        </div>

                        <div className="country-select">
                            <label>Origin:</label>
                            <CountryDropdown onChange={(val) => this.selectCountry(val)} value={country}/>
                        </div>
                    </div>
                    
                    <button 
                        disabled={! this.state.formValid}
                        type="submit"
                        className="add-btn">
                        ADD
                    </button>
                </form>
            </div>
        );
    }
}

export default Form;