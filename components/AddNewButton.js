import router from 'next/router';
import PenIcon from '../public/images/pen.svg';

const AddNewButton = () => (
  <button className="add-new-sup-container" onClick={() => router.push('/new')}>
    <PenIcon />
  </button>
);

export default AddNewButton;