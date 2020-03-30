import CustomHead from '../components/CustomHead';
import Home from '../components/Home';
import '../resources/index.scss';

const Index = () => (
  <div className="container">
    <CustomHead />
    <main>
      <Home />
    </main>
  </div>
);

export default Index;
