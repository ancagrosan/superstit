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
    textProp: "quote",
  },
  {
    button: TelegramShareButton,
    icon: TelegramIcon,
    textProp: "title",
  },
  {
    button: TwitterShareButton,
    icon: TwitterIcon,
    textProp: "title",
  },
  {
    button: WhatsappShareButton,
    icon: WhatsappIcon,
    textProp: "title",
  },
];

const SocialSharing = ({ shareURL, title }) => {
  return (
    <ul className="social-sharing-list">
      {options.map((op, index) => {
        const buttonProps = {
          url: shareURL,
          [op.textProp]: title
        };
        return <li key={index}>
          <op.button {...buttonProps}>
            <op.icon size={30} round />
          </op.button>
        </li>;
      })}
    </ul>
  );
};

SocialSharing.propTypes = {
  title: PropTypes.string.isRequired,
  shareURL: PropTypes.string.isRequired,
};

export default SocialSharing;
