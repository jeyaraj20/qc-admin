import React from 'react';
import Button from '@material-ui/core/Button';

const ContactCard = () => {
  return (
    <div className="jr-card p-0">
      <div className="jr-card-header card-img-top mb-0 p-4 bg-grey lighten-4">
        <h3 className="card-heading">Our Office</h3>
      </div>

      <div className="card-body">
        <ul className="contact-list list-unstyled">
          <li className="media">
            <i className="zmdi zmdi-phone zmdi-hc-fw zmdi-hc-lg text-primary align-self-center"/>
            <span className="media-body">
                            +01-992-856-8535
                        </span>
          </li>
          <li className="media">
          <span className="media-body align-self-center">Test</span>
            <span className="media-body align-self-left">
                            bob.builder@jobportal.com
                        </span>
          </li>
          <li className="media">
          <span className="media-body align-self-center">Test</span>
            <span className="media-body">
                            jemmy.godbole
                        </span>
          </li>
          <li className="media">
          <span className="media-body align-self-center">Test</span>
            <span className="media-body">
                            twitter.godbole
                        </span>
          </li>
          <li className="media">
            <i className="zmdi zmdi-pin zmdi-hc-fw zmdi-hc-lg text-primary align-self-center"/>
            <span className="media-body">
                            488, blingum road, JP Street,
                            <br/>
                            NJ, KC45 5473
                        </span>
          </li>
        </ul>

        <Button size="small" color="primary">Get directions</Button>
      </div>
    </div>
  );
};

export default ContactCard;
