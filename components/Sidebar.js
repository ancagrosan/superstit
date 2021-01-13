import FBIcon from '../public/images/facebook.svg';
import TwitterIcon from '../public/images/twitter.svg';
import InstagramIcon from '../public/images/instagram.svg';
import EnvelopeIcon from '../public/images/envelope.svg';

const Sidebar = () => {
  return (
    <header className="nav">
      <h1>
        <a className="logo" href="/">
          <div className="text-gradient super">Superstitious</div>
          <div className="text-gradient">Network</div>
        </a>
      </h1>
      <h2>
        The invisible network that holds our world together.
      </h2>
      <div className="social">
        <a href="https://www.facebook.com/superstitiousnetwork/" title="facebook" target="_blank" rel='noreferrer noopener'>
          <FBIcon />
        </a>
        <a href="https://twitter.com/superstitiousnw" title="twitter" target="_blank" rel='noreferrer noopener'>
          <TwitterIcon />
        </a>
        <a href="https://www.instagram.com/superstitious.network" title="instagram" target="_blank" rel='noreferrer noopener'>
          <InstagramIcon />
        </a>
        <a href="mailto:contact@superstitious.network">
          <EnvelopeIcon />
        </a>
      </div>
      <div className="copy">&copy; {new Date().getFullYear()}, Transylvania</div>
    </header>
  );
}

export default Sidebar;