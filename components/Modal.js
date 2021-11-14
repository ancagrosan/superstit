import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";

import Portal from "./Portal";
import CloseIcon from "../public/images/close.svg";

const propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node,
};

const defaultProps = {
  onClose: Function.prototype,
};

const Modal = ({ onClose, children }) => {
  return (
    <Portal selector="body">
      <div id="modal" className="modal-root">
        <div className="modal-background" />
        <div className="modal-content">
          <FocusTrap
            focusTrapOptions={{
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
              onDeactivate: onClose
            }}>
            <div role="dialog" aria-modal="true" className="modal-wrapper">
              <button className="modal-close" onClick={onClose}><CloseIcon /></button>
              <div>{children}</div>
            </div>
          </FocusTrap>
        </div>
      </div>
    </Portal>
  );
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
