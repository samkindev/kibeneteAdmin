import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import { Paper, Typography } from '@material-ui/core';
import { HomeOutlined, AddAPhotoOutlined, PlaceOutlined, CategoryOutlined } from '@material-ui/icons';

export default function SidBar({ open, handleOpenSidebar }) {
    const match = useRouteMatch();

    const closeSideBar = () => {
        handleOpenSidebar();
    };

    const handleShadowClick = (e) => {
        if (e.screenX > 230) {
            closeSideBar();
        }
    };

    return (
        <div className={`side-bar ${open ? "sidebar-open" : ""}`} onClick={handleShadowClick}>
            <Paper className="inner-sidebar">
                <div className="menu">
                    <NavLink to={match.url} activeClassName={`${window.location.href.endsWith("admin") ? "active-link" : ""}`} className={`link`} onClick={closeSideBar}>
                        <HomeOutlined className="side-link-icon" color="inherit" style={{ marginRight: 7 }} />
                        <div>
                            <Typography variant="body2" style={{ fontWeight: 700 }}>Accueil</Typography>
                        </div>
                    </NavLink>
                    <NavLink to={`${match.url}/categories`} activeClassName="active-link" className={`link`} onClick={closeSideBar}>
                        <CategoryOutlined className="side-link-icon" color="inherit" style={{ marginRight: 7 }} />
                        <div>
                            <Typography variant="body2" style={{ fontWeight: 700 }}>Categories</Typography>
                            <Typography variant="caption" style={{ marginTop: 5, display: 'block' }}>Toutes les catégories, créer...</Typography>
                        </div>
                    </NavLink>
                    <NavLink to={`${match.url}/places`} activeClassName="active-link" className={`link`} onClick={closeSideBar}>
                        <PlaceOutlined className="side-link-icon" color="inherit" style={{ marginRight: 7 }} />
                        <div>
                            <Typography variant="body2" style={{ fontWeight: 700 }}>Places</Typography>
                            <Typography variant="caption" style={{ marginTop: 5, display: 'block' }}>Toutes les places, création...</Typography>
                        </div>
                    </NavLink>
                    <NavLink to={`${match.url}/photos`} activeClassName="active-link" className={`link`} onClick={closeSideBar}>
                        <AddAPhotoOutlined className="side-link-icon" color="inherit" style={{ marginRight: 7 }} />
                        <div>
                            <Typography variant="body1" style={{ fontWeight: 700 }}>Photos</Typography>
                            <Typography variant="caption" style={{ marginTop: 5, display: 'block' }}>Toutes les photos, créer...</Typography>
                        </div>
                    </NavLink>
                </div>
                <div className="footer">
                    <p>&#169;2021 Kibenete</p>
                </div>
            </Paper>
        </div>
    )
}
