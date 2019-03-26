import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import fire from './fire';
import Sidebar from './Sidebar'
import List from './List';

class SuperstitionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nextId: '',
            prevId: ''
        };
    }
    componentWillMount() {
        let currentSupId = this.props.params.id;
        let ref = fire.database().ref("messages").orderByKey();

        // get the next/prev superstitions
        ref.endAt(currentSupId).limitToLast(2).once("value").then((snapshot) => {
            Object.keys(snapshot.val()).forEach((id) => {

                // while we're here, update the page title
                if (id === currentSupId) {
                    const supText = snapshot.val()[currentSupId].text;

                    document.title = supText.length > 30
                        ? supText.substring(0,30)+ '... | The Superstitious Network'
                        : supText + ' | The Superstitious Network';

                } else {
                    this.setState({nextId: id});
                }
            });
        });

        ref.startAt(currentSupId).limitToFirst(2).once("value").then((snapshot) => {
            let prevId = Object.keys(snapshot.val()).find((id) => {
                return id !== currentSupId;
            });
            this.setState({prevId: prevId});
        });
    }

    render() {
        let item = {
            id: this.props.params.id,
            standalone: true,
            showComments: true
        };
        return (
            <div className="container superstition-page">
                <Sidebar/>
                <div className="feedContainer">
                    <List items={[item]}/>
                    <nav className="sup-nav">
                        {this.state.prevId &&
                            <Link to={'/superstition/' + this.state.prevId}><i className="fas fa-long-arrow-alt-left"></i></Link>
                        }
                        {this.state.nextId &&
                            <Link to={'/superstition/' + this.state.prevId}><i className="fas fa-long-arrow-alt-right"></i></Link>
                        }
                    </nav>
                </div>
            </div>
        );
    }
}

export default SuperstitionPage;