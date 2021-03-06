import Link from 'next/link'

import CustomHead from '../components/CustomHead';
import CatIcon from '../public/images/cat.svg';

const Error = () => {
  return (
    <>
      <CustomHead />
      <div className="not-found">
        <div className="content">
          <div>We're sorry, something went wrong :(</div>
          <Link href="/">
            <a><CatIcon /></a>
          </Link>
          <div>Click on the cat to go home.</div>
        </div>
      </div>
    </>
  );
}

export default Error;