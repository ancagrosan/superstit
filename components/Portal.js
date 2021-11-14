import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Portal = props => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    const element = document.querySelector(props.selector);
    return ReactDOM.createPortal(props.children, element);
  }

  return null;
};

Portal.propTypes = {
  selector: PropTypes.string,
  children: PropTypes.node,
};

Portal.defaultProps = {
  selector: 'body',
};

export default Portal;
