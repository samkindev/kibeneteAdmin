import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, makeStyles, Popper, Fade, Button, CircularProgress } from '@material-ui/core';

import { logoutAdmin, getRequestStatus } from '../redux/slices/admin';

export default function Avatar({ user }) {
    const ref = React.useRef();
    const [open, setOpen] = useState(false);
    const [anchorEl, setEnchorEl] = useState();
    const reqStatus = useSelector(getRequestStatus);

    const onClick = (event) => {
        setEnchorEl(event.currentTarget);
        setOpen(!open);
    };

    const dispatch = useDispatch();
    const handleDeconnect = () => {
        dispatch(logoutAdmin());
    };

    const classes = useStyles();
    return (
        <div className={`${classes.container}`}>
            <Popper open={open} anchorEl={anchorEl} placement="bottom-end" transition className={classes.contentContainer}>
                {({ TransitionProps }) => (
                    <div className={classes.innerContent} ref={ref}>
                        <Fade {...TransitionProps} timeout={350} className={classes.content}>
                            <Button
                                onClick={handleDeconnect}
                            >
                                Deconnexion
                                {reqStatus === 'loading' &&
                                    <CircularProgress aria-describedby={ref.current} size={15} style={{ marginLeft: 10 }} />
                                }
                            </Button>
                        </Fade>
                    </div>
                )}
            </Popper>
            <div className="avatar" onClick={onClick}>
                {user &&
                    <Typography variant="h6">{user.username[0]}</Typography>
                }
            </div>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        cursor: 'pointer'
    },
    contentContainer: {
        zIndex: 120,
        top: '6px!important'
    },
    content: {
        width: '100%',
    },
    innerContent: {
        padding: 20,
        width: 300,
        backgroundColor: '#fff',
        boxShadow: '-1px 2px 2px 0px rgb(0 0 0 / 20%), -2px 4px 8px 0px rgb(0 0 0 / 14%), -1px 3px 3px 0px rgb(0 0 0 / 12%)',
    }
}));
