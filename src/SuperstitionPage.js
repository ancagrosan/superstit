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
        // get the next/prev superstitions
        this.fetchSupData(this.props.params.id);
    }

    componentDidUpdate(prevProps) {
        if (this.props.params.id !== prevProps.params.id) {
            // get the next/prev superstitions
            this.fetchSupData();
        }
    }

    fetchSupData(){
        let ref = fire.database().ref("messages").orderByKey();
        let currentSupId = this.props.params.id;

        ref.endAt(currentSupId).limitToLast(2).once("value").then((snapshot) => {
            Object.keys(snapshot.val()).forEach((id) => {
                if (id === currentSupId) {
                    // while we're here, update the page title
                    this.setPageTitle(snapshot.val()[currentSupId].text);
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

    setPageTitle(supText){
        document.title = supText.length > 30
            ? supText.substring(0,30)+ '... | The Superstitious Network'
            : supText + ' | The Superstitious Network';
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
                <main className="feedContainer">
                    <List items={[item]}/>
                    <nav className="sup-nav">
                        {this.state.prevId &&
                            <Link to={'/superstition/' + this.state.prevId}><i className="fas fa-long-arrow-alt-left"></i></Link>
                        }
                        {this.state.nextId &&
                            <Link to={'/superstition/' + this.state.nextId}><i className="fas fa-long-arrow-alt-right"></i></Link>
                        }
                    </nav>
                </main>
            </div>
        );
    }
}

export default SuperstitionPage;