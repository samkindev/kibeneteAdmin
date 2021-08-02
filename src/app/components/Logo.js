import React from 'react';
import PropTypes from 'prop-types';
import LogoImage from '../assets/logo.svg';

export default function Logo(props) {
    const { size } = props;
    return (
        <div className="logo" style={{ width: size, height: size }}>
            <img src={LogoImage} alt="logo" />
        </div>
    );
}

Logo.propTypes = {
    size: PropTypes.number,
}
