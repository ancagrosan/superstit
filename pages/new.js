import router from 'next/router';

import CustomHead from '../components/CustomHead';
import Form from '../components/Form';
import ArrowLeftIcon from '../public/images/arrow-left.svg'

const New = () => (
  <div className="container">
    <CustomHead title="Add a new superstition | The Superstitious Network" />
    <main className="add-new-superstition-page">
      <ArrowLeftIcon className="go-back-arrow" onClick={() => router.back()} />
      <Form />
    </main>
  </div>
);

export default New;
