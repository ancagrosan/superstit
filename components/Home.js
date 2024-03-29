import { useState, useEffect, useRef } from 'react';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import fire from '../utils/fire';
import Sidebar from './Sidebar';
import Form from './Form';
import List from './List';
import AddNewButton from './AddNewButton';

import CatIcon from '../public/images/cat.svg';

JavascriptTimeAgo.locale(en)

const IPP = 20;
let referenceToOldestKey = "";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reachedEnd, setReachedEnd] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
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
      referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];

      setMessages(results);
    });
  }, []);

  const handleScroll = () => {
    if (containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight) {
      loadMoreItems();
    }
  }

  useEffect(() => {
    containerRef?.current?.addEventListener('scroll', handleScroll);
    return () => containerRef?.current?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const loadMoreItems = () => {
    // know when to stop
    if (messages.length && !referenceToOldestKey) {
      setReachedEnd(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    fire.database()
      .ref("messages")
      .orderByKey()
      .endAt(referenceToOldestKey)
      .limitToLast(IPP)
      .once("value")
      .then((snapshot) => {
        let arrayOfKeys = Object.keys(snapshot.val()).sort().reverse().slice(1);

        let results = arrayOfKeys.map((key) => ({
          ...snapshot.val()[key],
          id: key
        }));

        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];

        setMessages([...messages, ...results]);
        setIsLoading(false);
        setReachedEnd(arrayOfKeys.length > 0 ? false : true);
      });
  }

  // when a user adds a new item, add it to the stack
  const afterSubmit = (message) => {
    setMessages([message, ...messages]);
  }

  return (
    <div className="container" ref={containerRef}>
      <Sidebar />
      <main className="feedContainer">
        <Form afterSubmit={afterSubmit} />
        <AddNewButton />
        <div>
          <List items={messages} />
          {isLoading &&
            <div className="loading-info">
              <CatIcon className="spinning" /> Loading
            </div>
          }
          {reachedEnd &&
            <div className="loading-info">
              <CatIcon /> That's that.
            </div>
          }
        </div>
      </main>
    </div>
  );
}

export default Home;
