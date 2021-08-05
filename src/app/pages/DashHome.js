import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import DashCard from '../components/DashCard';

import { getCount as getPlaceCount } from '../redux/slices/places';
import { getCount as getPhotoCount } from '../redux/slices/photos';
import { getCount as getCategoryCount } from '../redux/slices/category';

import earth from '../assets/earth.svg';

export default function DashHome() {
    const placeCount = useSelector(getPlaceCount);
    const photoCount = useSelector(getPhotoCount);
    const categoryCount = useSelector(getCategoryCount);

    const { url } = useRouteMatch();

    return (
        <div className="dash-home">
            <div className="dash-header">
                <DashCard className="dash-card" variant="primary">
                    <Link to={`${url}/categories`}>
                        <div className="dash-card-content">
                            <Typography color="inherit" variant="h4">Categories</Typography>
                            <h4 style={{ color: "inherit" }}>{categoryCount}</h4>
                        </div>
                    </Link>
                </DashCard>
                <DashCard className="dash-card" variant="secondary">
                    <Link to={`${url}/places`}>
                        <div className="dash-card-content">
                            <Typography variant="h4">Places</Typography>
                            <h4>{placeCount}</h4>
                        </div>
                    </Link>
                </DashCard>
                <DashCard className="dash-card" variant="secondary">
                    <Link to={`${url}/photos`}>
                        <div className="dash-card-content">
                            <Typography variant="h4">Photos</Typography>
                            <h4>{photoCount}</h4>
                        </div>
                    </Link>
                </DashCard>
                <DashCard className="dash-card" variant="primary-light">
                    <Link to={`${url}`}>
                        <div className="dash-card-content">
                            <Typography variant="h4" color="inherit">Services</Typography>
                            <h4 style={{ color: 'inherit' }}>0</h4>
                        </div>
                    </Link>
                </DashCard>
            </div>
            <div className="earth-container">
                <img src={earth} alt="earth" className="earth" />
            </div>
        </div>
    )
}
