import React from 'react';
import { Headings } from '../../components';
import { data } from '../../constants';
import Nav from 'react-bootstrap/Nav';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import './Services.css';


const Services = () => {
  return (
    <div id="services" className="d-block pt-md-4">
      <Headings title="Services" text=" Nightingale’s software Mobility Mate will automatically analyze and assess your mobility. These are the services we offer:" />

      <div className="row">
        {data.ServicesData.map(({ titleone, titletwo , link, itemclass, imgURL }, index) => (
          <div className="col-lg-6 col-12" key={index}>
          <div className={`row ${itemclass}`}>
              <div className="col-md-6 box">
             <div>  <span>{titleone} </span> 
               <span>{titletwo}</span> 
               </div>
                <a href={link} alt={titleone} className="readmore"> <BsFillArrowUpRightCircleFill /> Learn more </a>
              </div>
              <div className="col-md-6 text-end"><img src={imgURL} alt={titleone} className="img-fluid img-services" /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services