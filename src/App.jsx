// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Contact, Footer, Hero, Services, Rom, Sts, Tug} from './container';
// import { Menu } from './components';




// const App = () => (
//   <div className="container">
//     <Menu />
//     <Hero />
//     <Services />
//     <Contact />
//     <Footer />
//     <Rom />
//     <Sts />
//     <Tug />
//   </div>
// );

// export default App;

// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Rom, Sts, Tug} from './container';
import { Menu,Home} from './components';

const App = () => (
  <Router>
    <div className="container">
      <Menu />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/rom" element={<Rom />} />
        <Route path="/sts" element={<Sts />} />
        <Route path="/tug" element={<Tug />} />
      </Routes>
    </div>
  </Router>
);


export default App;
