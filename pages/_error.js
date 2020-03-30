import React from 'react';
import Link from 'next/link'

import CustomHead from '../components/CustomHead';
import '../resources/index.scss';

const Error = () => {
    return (
        <>
            <CustomHead />
            <div className="not-found">
                <div className="content">
                    <div>Having found a not found page is always a good sign!</div>
                    <Link href="/">
                        <a><i className="fas fa-cat"></i></a>
                    </Link>
                    <div>Click on the cat to go home.</div>
                </div>
            </div>
        </>
    );
}

export default Error;