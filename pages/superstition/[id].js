import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, withRouter } from 'next/router';

import fire from '../../utils/fire';
import Sidebar from '../../components/Sidebar';
import List from '../../components/List';
import CustomHead from '../../components/CustomHead';

const SuperstitionPage = () => {
    const [nextId, setNextId] = useState(null);
    const [prevId, setPrevId] = useState(null);

    const router = useRouter();
    const superstitionId = router.query.id;

    // get the next/prev superstitions
    useEffect(() => {
        fetchSupData(superstitionId)
    }, [superstitionId]);

    const fetchSupData = (currentSupId) => {
        if (!currentSupId) {
            return;
        }
        const ref = fire.database().ref("messages").orderByKey();

        ref.endAt(currentSupId).limitToLast(2).once("value").then((snapshot) => {
            Object.keys(snapshot.val()).forEach((id) => {
                setNextId(id);
            });
        });

        ref.startAt(currentSupId).limitToFirst(2).once("value").then((snapshot) => {
            let prevId = Object.keys(snapshot.val()).find((id) => {
                return id !== currentSupId;
            });
            setPrevId(prevId)
        });
    }

    let item = {
        id: superstitionId,
        standalone: true,
        showComments: true
    };

    return (
        <>
            <CustomHead />
            <div className="container superstition-page">
                <Sidebar />
                <main className="feedContainer">
                    <List items={[item]} />
                    <nav className="sup-nav">
                        {prevId &&
                            <Link
                                href="/superstition/[id]"
                                as={`/superstition/${prevId}`}
                            >
                                <a><i className="fas fa-long-arrow-alt-left"></i></a>
                            </Link>
                        }
                        {nextId &&
                            <Link
                                href="/superstition/[id]"
                                as={`/superstition/${nextId}`}
                            >
                                <a><i className="fas fa-long-arrow-alt-right"></i></a>
                            </Link>
                        }
                    </nav>
                </main>
            </div>
        </>
    );
}

export default withRouter(SuperstitionPage);