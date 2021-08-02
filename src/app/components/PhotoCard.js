import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core';

import { Typography } from '@material-ui/core';
import { Modal } from '.';

export default function PhotoCard({ photo, place }) {
    const imgRef = useRef();
    const [display, setDisplay] = useState(false);
    const classes = useStyles();
    let photoPlace = {};


    if (typeof photo.path) {
        photoPlace = photo.place;
    } else if (place) {
        photoPlace = place;
    }

    const handleDisplay = () => {
        setDisplay(!display);
    };

    return (
        <div className='card-container' onClick={handleDisplay}>
            <div className={classes.cardImageContainer}>
                <img ref={imgRef} loading="eager" src={photo.path ? photo.path : photo} srcSet={photo.path ? photo.path : photo} alt={photo._id} className={classes.image} />
            </div>
            <div className='card-body'>
                {photoPlace &&
                    <div className={classes.details}>
                        <Typography variant="caption" color="inherit" style={{ fontWeight: 'light' }}>{photoPlace.name}</Typography>
                    </div>
                }
            </div>
            {display &&
                <Modal open={display} backBtn={true} handleClose={handleDisplay} contentContainerStyle={{ marginTop: 0, borderRadius: 0 }}>
                    <div className={classes.content}>
                        <div className={classes.header}>

                        </div>
                        <div className={classes.imageContainer}>
                            <img className={classes.displayImage} src={photo.path ? photo.path : photo} srcSet={photo.path ? photo.path : photo} alt={photo.path ? photo._id : 'place photo'} />
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        overflow: 'hidden',
        position: 'relative'
    },
    cardImageContainer: {
    },
    body: {
        height: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 12,
        background: 'linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 100%)',
        color: '#dcdada',
        display: 'flex',
        alignItems: 'flex-end',
        transition: 'all .2s',
        visibility: 'invisible',
        opacity: 0,
        "&:hover": {
            height: 'calc(100% / 2)',
            visibility: 'visible',
            opacity: 1,
        }
    },
    details: {
        padding: '3px 6px'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: "100vw",
        height: "100vh",
        backgroundColor: "#00121fed",
    },
    header: {
        padding: 20,
        height: 130,

    },
    displayImage: {
        height: '100%',
        width: 'auto!important'
    },
    imageContainer: {
        width: '70%',
        height: 'auto',
        maxHeight: 'calc(100% - 170px)',
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
    }
}));
