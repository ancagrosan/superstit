import Link from 'next/link'

import CustomHead from '../components/CustomHead';
import CatIcon from '../public/images/cat.svg';

const NotFound = () => {
  return (
    <>
      <CustomHead />
      <div className="not-found">
        <div className="content">
          <div>Having found a not found page is always a good sign!</div>
          <Link href="/">
            <a><CatIcon /></a>
          </Link>
          <div>Click on the cat to go home.</div>
        </div>
      </div>
    </>
  );
}

export default NotFound;