import { useState } from 'react';

import Form from '../components/Form';
import Modal from '../components/Modal';
import PenIcon from '../public/images/pen.svg';

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button className="add-new-sup-container" onClick={toggleModal}>
        <PenIcon />
      </button>

      {isModalOpen &&
        <Modal onClose={toggleModal}>
          <div className="modal-form-container">
            <Form />
          </div>
        </Modal>
      }
    </>
  )
};

export default AddNewButton;