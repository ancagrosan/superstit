import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, withRouter } from 'next/router';

import fire from '../../utils/fire';
import Sidebar from '../../components/Sidebar';
import List from '../../components/List';
import CustomHead from '../../components/CustomHead';
import AddNewButton from '../../components/AddNewButton';

import ArrowRight from '../../public/images/arrow-right.svg';
import ArrowLeft from '../../public/images/arrow-left.svg';

const SuperstitionPage = () => {
  const [nextId, setNextId] = useState(null);
  const [prevId, setPrevId] = useState(null);
  const [title, setPageTitle] = useState('The Superstitious Network');

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
        if (id === currentSupId) {

          // update the page title
          const supText = snapshot.val()[currentSupId].text;
          setPageTitle(supText.length > 30
            ? `${supText.replace(/^(.{30}[^\s]*).*/, "$1")}... | The Superstitious Network`
            : `${supText} | The Superstitious Network`
          );
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

  let item = {
    id: superstitionId,
    standalone: true,
    showComments: true
  };

  return (
    <>
      <CustomHead title={title} />

      <div className="container superstition-page">
        <Sidebar />
        <AddNewButton />
        <main className="feedContainer">
          <List items={[item]} />
          <nav className="sup-nav">
            {prevId &&
              <Link
                href="/superstition/[id]"
                as={`/superstition/${prevId}`}
              >
                <a><ArrowLeft /></a>
              </Link>
            }
            {nextId &&
              <Link
                href="/superstition/[id]"
                as={`/superstition/${nextId}`}
              >
                <a><ArrowRight /></a>
              </Link>
            }
          </nav>
        </main>
      </div>
    </>
  );
}

export default withRouter(SuperstitionPage);