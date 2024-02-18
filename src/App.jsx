import 'bootstrap/dist/css/bootstrap.min.css';
import { Contact, Footer, Hero, Services} from './container';
import { Menu } from './components';




const App = () => (
  <div className="container">
    <Menu />
    <Hero />
    <Services />
    <Contact />
    <Footer />
  </div>
);

export default App;
