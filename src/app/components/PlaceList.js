import React from 'react';
import { makeStyles } from '@material-ui/core';
import { PlaceCard } from '.';

export default function PlaceList({ places }) {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div className={classes.elements}>
                {places.map(place => (
                    <PlaceCard key={place._id} data={place} />
                ))}
            </div>
        </div>
    )
}


const useStyles = makeStyles(theme => ({
    container: {},
    elements: {
        display: 'grid',
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20,
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr 1fr',
        },
        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: '1fr',
        },
    }
}));
