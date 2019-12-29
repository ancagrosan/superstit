import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import fire from './fire';
import Sidebar from './Sidebar'
import List from './List';

const SuperstitionPage = (props) => {
    const [nextId, setNextId] = useState(null);
    const [prevId, setPrevId] = useState(null);

    // get the next/prev superstitions
    useEffect(() => {
        fetchSupData()
    }, [props.params.id]);

    const fetchSupData = () => {
        let ref = fire.database().ref("messages").orderByKey();
        let currentSupId = props.params.id;

        ref.endAt(currentSupId).limitToLast(2).once("value").then((snapshot) => {
            Object.keys(snapshot.val()).forEach((id) => {
                if (id === currentSupId) {
                    // while we're here, update the page title
                    setPageTitle(snapshot.val()[currentSupId].text);
                } else {
                    setNextId(id);
                }
            });
        });

        ref.startAt(currentSupId).limitToFirst(2).once("value").then((snapshot) => {
            let prevId = Object.keys(snapshot.val()).find((id) => {
                return id !== currentSupId;
            });
            setPrevId(prevId)
        });
    }

    const setPageTitle = (supText) => {
        document.title = supText.length > 30
            ? supText.substring(0, 30) + '... | The Superstitious Network'
            : supText + ' | The Superstitious Network';
    }

    let item = {
        id: props.params.id,
        standalone: true,
        showComments: true
    };

    return (
        <div className="container superstition-page">
            <Sidebar />
            <main className="feedContainer">
                <List items={[item]} />
                <nav className="sup-nav">
                    {prevId &&
                        <Link to={'/superstition/' + prevId}><i className="fas fa-long-arrow-alt-left"></i></Link>
                    }
                    {nextId &&
                        <Link to={'/superstition/' + nextId}><i className="fas fa-long-arrow-alt-right"></i></Link>
                    }
                </nav>
            </main>
        </div>
    );
}

export default SuperstitionPage;