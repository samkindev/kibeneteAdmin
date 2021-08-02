import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Typography, makeStyles } from '@material-ui/core';
import { RoomOutlined } from '@material-ui/icons';

const PlaceCard = ({ data: place }) => {
    const classes = useStyles();

    const { url } = useRouteMatch();
    return (
        <Link to={`${url}/${place._id}`}>
            <div className={classes.container}>
                <div className={classes.body}>
                    <div className={classes.header}>
                        <div className={classes.imageContainer}>
                            <img srcSet={place.main_image} scr={place.main_image} alt={place.name} className={classes.image} />
                        </div>
                        <div>
                            <Typography variant="body1" className={classes.title}>{place.name}</Typography>
                            <Typography variant="caption">{place.category}</Typography>
                        </div>
                    </div>
                </div>
                <div className={classes.footer}>
                    <div className={classes.position}>
                        <RoomOutlined color="disabled" fontSize="small" />
                        <Typography variant="body2">{place.position.coordinates[1].toString().slice(0, 7)}, {place.position.coordinates[0].toString().slice(0, 7)}</Typography>
                    </div>
                </div>
            </div>
        </Link>
    )
};

const useStyles = makeStyles(theme => ({
    container: {
        overflow: 'hidden',
        border: '1px solid #0099ff33',
        borderRadius: 5,
        color: '#001421ad',
        "&:hover": {
            backgroundColor: theme.palette.primary.light
        }
    },
    image: {
        maxWidth: '100%',
        height: '100%'
    },
    imageContainer: {
        height: 70,
        minWidth: 70,
        overflow: 'hidden',
        borderRadius: 10,
        maxWidth: 70,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        [theme.breakpoints.down('xs')]: {
            maxWidth: '100%',
        }
    },
    body: {
        padding: 10,
    },
    header: {
        display: 'flex',
        textTransform: 'capitalize',
    },
    title: {
        fontWeight: '600',
    },
    footer: {
        padding: 10,
    },
    position: {
        display: 'flex',
        alignItems: 'center',
    }
}));

export default React.memo(PlaceCard);