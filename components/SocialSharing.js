import PropTypes from 'prop-types';
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  /* icons */
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

const options = [
  {
    button: FacebookShareButton,
    icon: FacebookIcon,
  },
  {
    button: TelegramShareButton,
    icon: TelegramIcon,
  },
  {
    button: TwitterShareButton,
    icon: TwitterIcon,
  },
  {
    button: WhatsappShareButton,
    icon: WhatsappIcon,
  },
];

const SocialSharing = ({ shareURL, title }) => {
  return (
    <ul className="social-sharing-list">
      {options.map((op, index) => (
        <li key={index}>
          <op.button url={shareURL} title={title}>
            <op.icon size={30} round />
          </op.button>
        </li>
      ))}
    </ul>
  );
};

SocialSharing.propTypes = {
  title: PropTypes.string.isRequired,
  shareURL: PropTypes.string.isRequired,
};

export default SocialSharing;
