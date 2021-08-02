import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Typography, Button, IconButton, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArrowBack } from '@material-ui/icons';

import { FormGroup, Logo } from '../components';
import { loginAdmin, getConnectionState, getRequestStatus, getError } from '../redux/slices/admin';

export default function Login() {
    const unRef = useRef();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const error = useSelector(getError);
    const connected = useSelector(getConnectionState);
    const status = useSelector(getRequestStatus);

    const dispatch = useDispatch();
    const handleSubmit = () => {
        if (username !== '' && password !== '') {
            dispatch(loginAdmin({ username, password }));
        }
    };

    const classes = useStyles();

    const arrowBackClick = () => {
        if (unRef.current) {
            unRef.current.focus();
        }
    };

    if (connected) {
        return (
            <>
                <Redirect
                    to="/admin"
                />
            </>
        );
    }
    return (
        <div className={`${classes.container} login`}>
            <div className={`${classes.banner} banner`}>
                <div className={classes.innerBaner}>
                    <Typography variant="h4" className={`${classes.bannerTitle} banner-title`}>Kibenete Administration</Typography>
                    <Typography className={`${classes.bannerText} banner-text`}>Bienvenu sur kibenete admin. Connectez-vous à l'aide de votre compte administrateur.</Typography>
                    <IconButton onClick={arrowBackClick} className="banner-btn" style={{ color: 'inherit', marginLeft: -16 }}>
                        <ArrowBack fontSize="small" />
                    </IconButton>
                </div>
            </div>
            <div className={`${classes.innerContainer} inner-container`}>
                <div className={classes.header}>
                    <div className={classes.logoContainer}>
                        <Logo size={55} />
                        <Typography className={classes.logoTitle} color="primary" variant="h6">KibeneteApp</Typography>
                    </div>
                </div>
                <div className={classes.formContainer}>
                    <Typography variant="h5" className={classes.formTitle} style={{ marginBottom: 15 }}>Connectez-vous</Typography>
                    {error &&
                        <Alert color="error" severity="error">
                            <Typography>Nom d'utilisateur ou mot de passe incorrect.</Typography>
                        </Alert>
                    }
                    <form className={classes.form}>
                        <FormGroup
                            label="Username"
                            labelVariant="body1"
                            type="text"
                            variant="outlined"
                            placeholder="Nom d'utlisateur"
                            fullWidth
                            inputRef={unRef}
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ marginBottom: 10 }}
                        />
                        <FormGroup
                            label="Mot de passe"
                            labelVariant="body1"
                            type="password"
                            id="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            size="large"
                            fullWidth
                            className={classes.formAction}
                        >
                            Connecter
                            {status === 'loading' &&
                                <CircularProgress size={15} color="inherit" style={{ marginLeft: 15 }} />
                            }
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    logoContainer: {
        marginBottom: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    logoTitle: {
        marginLeft: 10,
    },
    innerContainer: {
        flex: 1,
        flexBasis: 400,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px'
    },
    formContainer: {
        width: '70%',
        minWidth: 300,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        maxWidth: 300
    },
    formAction: {
        marginTop: 20,
        textTransform: 'initial!important',
        display: 'flex',
        alignItems: 'center',
        transition: '.2s'
    },
    banner: {
        flex: 2,
        flexBasis: 500,
        height: '100%',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 30px'
    },
    innerBaner: {
        width: '60%',
        minWidth: 276,
        maxWidth: 335
    },
    bannerTitle: {
        fontWeight: '700!important'
    },
    bannerText: {
        margin: '30px 0'
    }
}));
