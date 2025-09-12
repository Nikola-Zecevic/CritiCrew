import React from 'react';
import AboutUsText from './AboutUsText';

function AboutUsSection({ imageLink, reverse = false, section }) {
    return (
        <div className={`section ${reverse ? 'reverse' : ''}`}>
            <AboutUsText section={section} />
            <div className="image-container">
                <img src={imageLink} alt="Cinema" className="image" />
            </div>
        </div>
    );
}

export default AboutUsSection;