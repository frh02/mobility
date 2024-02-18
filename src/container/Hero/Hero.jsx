import React from 'react';
import { images } from '../../constants';
import {IconScroll} from '../../components';
import './Hero.css';

const Hero = () => {

  return (
    <div className="hero">
      <div className="row align-items-center">
        <div className="col-md-6 col-12">
          <h1 className="title"> Empowering remote physiotherapy with AI precision</h1>
          <p className="py-4">Nightingale.ai envisions revolutionizing physiotherapy with AI-driven personalized care, aiming to enhance accessibility and effectiveness for patients while supporting therapists' workflow.</p>
          <button className="btn-positivus">Book a session</button>
        </div>
        <div className="col-md-6 col-12 mt-md-0 mt-4">
          <img className="img-fluid" src={images.hero} alt="design" />
        </div>
      </div>
      
      <IconScroll />
    </div>
    
  )
}

export default Hero