import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Button, CircularProgress, Typography, Hidden } from '@material-ui/core';
import { Close, Create, SaveOutlined } from '@material-ui/icons';

import axios from '../config/axios';
import { actions } from '../redux/slices/places';

const PlaceData = (props) => {
    const { currentPlace, name, label, currentValue, className } = props;
    const [modif, setModif] = useState(false);
    const [value, setValue] = useState(currentValue);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    let inputRef = React.useRef(null);

    const dispatch = useDispatch();
    const handleSubmit = () => {
        if (value !== "" && value !== currentValue) {
            setLoading(true);
            axios
                .post(`/place/${currentPlace._id}/update`, { [name]: value })
                .then(res => {
                    const data = res.data;
                    if (data.code) {
                        setError(data);
                    } else {
                        dispatch(actions.updatePlaceData({ placeId: currentPlace._id, label: [name], value: data[name] }));
                        setError(null);
                    }
                })
                .catch(err => {
                    setError(err);
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                    setModif(false);
                });
        }
    };

    const handleModif = () => {
        setModif(true);
        setTimeout(() => () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 500);
    };
    const handleCancelModif = () => {
        setModif(false);
        setValue(currentValue);
    };

    const classes = useStyles();
    return (
        <li className={`${classes.container} ${className}`}>
            {error && <Typography color="error">{error.message}</Typography>}
            <div className={classes.detail}>
                <span className={`${classes.block} ${classes.col}`}>
                    <span className={classes.label}>{label}</span>
                    <span className={classes.value}>
                        {modif ?
                            <textarea ref={inputRef} value={value} onChange={e => setValue(e.target.value)} className={`${classes.input}`} /> :
                            <span>{currentValue}</span>
                        }
                    </span>
                </span>
                <span className={`${classes.col} ${classes.actions}`}>
                    {modif ?
                        <div>
                            <Button variant="contained" color="primary" size="small" className={`${classes.saveBtn} ${classes.actionBtn}`} onClick={handleSubmit}>
                                <SaveOutlined fontSize="small" className={classes.actionIcon} />
                                <Hidden only="xs">
                                    Valider
                                </Hidden>
                            </Button>
                            <Button variant="contained" color="secondary" size="small" className={`${classes.cancelBtn} ${classes.actionBtn}`} onClick={handleCancelModif}>
                                <Close fontSize="small" />
                            </Button>
                        </div> :
                        <Button size="small" className={classes.actionBtn} onClick={handleModif}>
                            <Create fontSize="small" className={classes.actionIcon} />
                            <Hidden only="xs">
                                Modifier
                            </Hidden>
                        </Button>
                    }
                </span>
                {loading && <CircularProgress size={10} />}
            </div>
        </li >
    )
}

PlaceData.propTypes = {
    currentPlace: PropTypes.object,
    name: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    label: PropTypes.string,
    currentValue: PropTypes.string,
}

const useStyles = makeStyles(theme => ({
    detail: {
        display: 'flex',
        alignItems: 'center',
        padding: '2px 0',
        fontSize: 15,
        width: '100%',
        height: '100%',
        color: '#444',
    },
    col: {
        flex: 1,
        display: 'flex',
        "& > span": {
            flex: 1,
        }
    },
    label: {
        fontWeight: '600'
    },
    value: {
        flex: 2,
        borderRight: '1px solid #17496b6b',
        padding: '0 5px'
    },
    actions: {
        color: '#555',
        justifyContent: 'center',
    },
    actionBtn: {
        textTransform: 'initial',
        color: 'inherit'
    },
    saveBtn: {
        color: '#fff',
    },
    cancelBtn: {
        color: '#fff',
        marginLeft: 4,
        display: 'inline-flex',
        justifyContent: 'center',
    },
    actionIcon: {
        marginRight: 10,
    },
    block: {
        flex: 2,
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        padding: '7px 10px',
        border: '1px solid #eaeaea',
        borderRadius: 5,
    },
    [theme.breakpoints.down('sm')]: {
        block: {
            flex: 3
        },
    }
}));


export default PlaceData;