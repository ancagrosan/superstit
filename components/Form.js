import { useState } from 'react';
import fire from '../utils/fire';
import { countries } from '../utils/constants';

const Form = (props) => {
    const [text, setText] = useState('');
    const [country, setCountry] = useState('');
    const [type, setType] = useState('general');
    const [textareaFontSize, setTextareaFontSize] = useState(2);
    const [formValid, setFormValid] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const addSuperstition = (e) => {
        e.preventDefault();
        let newSup = {
            text: text,
            type: type,
            country: country,
            timestamp: Date.now()
        };

        fire.database().ref('messages').push(newSup).then((snapshot) => {
            props.userSubmittedItem({
                ...newSup,
                id: snapshot.key
            });
        });

        setText('');
        setCountry('');
        setType('general');
        setFormValid(false);
    }

    const textareaChange = (e) => {
        let length = e.target.value.length;
        let fontSize = textareaFontSize;

        if (e.target.value.trim().length > 0 && e.target.value.trim().length < 500) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }

        if (length > 150) {
            fontSize = 1;
        } else if (length > 110) {
            fontSize = 1.25;
        } else if (length > 75) {
            fontSize = 1.5;
        } else if (length > 30) {
            fontSize = 1.75;
        } else {
            fontSize = 2;
        }

        setText(e.target.value);
        setTextareaFontSize(fontSize);
    }

    const displayForm = () => {
        // on mobile, we don't show the add superstition form from the beginning
        setIsFormVisible(true);
    }

    return (
        <div>
            <div
                onClick={displayForm}
                className={"add-yours " + (isFormVisible ? 'hide' : '')}>
                ADD YOURS
                </div>
            <form
                onSubmit={addSuperstition}
                className={"add-superstition-form " + (isFormVisible ? "display-form" : "")}>
                <textarea
                    className="new-superstition-text"
                    style={{ fontSize: textareaFontSize + 'rem' }}
                    type="text"
                    onChange={textareaChange}
                    placeholder="What's your superstition about, is it personal, where is it from?"
                    rows="6"
                    value={text} />

                <div className="options-container">
                    <div className="type-select">

                        <input
                            onChange={(e) => setType(e.target.value)}
                            type="radio"
                            value="general"
                            name="type"
                            id="type-general"
                            className='form-radio'
                            checked={type === "general"} />
                        <label htmlFor="type-general">General</label>

                        <input
                            onChange={(e) => setType(e.target.value)}
                            type="radio"
                            value="personal"
                            name="type"
                            id="type-personal"
                            className='form-radio'
                            checked={type === "personal"} />
                        <label htmlFor="type-personal">Personal</label>
                    </div>

                    <div className="country-select">
                        <label>Origin:</label>
                        <select
                            onChange={(e) => setCountry(e.target.value)}
                            value={country}
                        >
                            {Object.keys(countries).map(country => (
                                <option key={country} value={country}>{country}</option>
                            )
                            )}
                        </select>
                    </div>
                </div>

                <button
                    disabled={!formValid}
                    type="submit"
                    className="submit-superstition-btn">
                    ADD
                </button>
            </form>
        </div>
    );
}

export default Form;