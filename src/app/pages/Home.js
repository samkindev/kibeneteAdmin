import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { SideBar, TopBar } from '../components';
import UserProfile from './UserProfile';
import Places from './Places';
import Photos from './Photos';
import AddPhoto from './AddPhoto';
import AddPlace from './AddPlace';
import DashHome from './DashHome';
import AddCategory from './AddCategory';
import Categories from './Categories';
import SinglePlace from './SinglePlace';

import { getPlacesCount } from '../redux/slices/places';
import { getphotosCount } from '../redux/slices/photos';
import { getCategoriesCount } from '../redux/slices/category';

export default function Home() {
    const match = useRouteMatch();
    const [openSideBar, setOpenSideBar] = React.useState(false);

    const handleOpenSideBar = () => {
        setOpenSideBar(!openSideBar);
    };

    const dispatch = useDispatch();

    window.addEventListener('resize', (evt) => {
        if (evt.target.innerWidth <= 740) {
            setOpenSideBar(false);
        }
    });

    useEffect(() => {
        dispatch(getPlacesCount());
        dispatch(getphotosCount());
        dispatch(getCategoriesCount());
    }, [dispatch]);
    return (
        <div className="main_container">
            <SideBar open={openSideBar} handleOpenSidebar={handleOpenSideBar} />
            <TopBar openSideBar={handleOpenSideBar} />
            <div className="content_container">
                <Switch>
                    <Route
                        path={`${match.path}/categories/creation`}
                        exact
                        component={AddCategory}
                    />
                    <Route
                        path={`${match.path}/places/creation`}
                        component={AddPlace}
                    />
                    <Route
                        path={`${match.path}/photos/creation`}
                        component={AddPhoto}
                    />
                    <Route
                        path={`${match.path}/categories`}
                        component={Categories}
                    />
                    <Route
                        path={`${match.path}/places/:placeId`}
                        component={SinglePlace}
                    />
                    <Route
                        path={`${match.path}/places`}
                        component={Places}
                    />
                    <Route
                        path={`${match.path}/photos`}
                        component={Photos}
                    />
                    <Route
                        exact
                        path="/profile"
                        component={UserProfile}
                    />
                    <Route
                        path={match.path}
                        exact
                        component={DashHome}
                    />
                </Switch>
            </div>
        </div>
    )
}
