import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Typography, Button, fade, IconButton, CircularProgress } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp, Edit } from '@material-ui/icons';
import { AddChildPlace, FormGroup, Modal } from '.';
import axios from '../config/axios';

import { actions } from '../redux/slices/places';

const PlaceMoreInfos = (props) => {
    const { currentPlace } = props;
    const [desc, setDesc] = useState(currentPlace.description);
    const [canSeeMore, setCanSeeMore] = useState(true);
    const [addChild, setAddChild] = useState(false);
    const [editDesc, setEditDesc] = useState(false);

    const handleEditDesc = () => {
        setEditDesc(true);
    };

    const handleCloseDescEditor = () => {
        setEditDesc(false);
    };

    const handleSeeMoreDesc = () => {
        setDesc(currentPlace.description);
        setCanSeeMore(false);
    };

    const handleSeeLessDesc = () => {
        setDesc(currentPlace.description);
        setCanSeeMore(true);
    };

    const handleAddChildPlace = () => {
        setAddChild(true);
    };

    const cancelAddChildPlace = () => {
        setAddChild(false);
    };

    React.useEffect(() => {
        if (desc.length > 100 && canSeeMore) {
            setDesc(`${desc.slice(0, 100)}...`);
            setCanSeeMore(true);
        }
    }, [canSeeMore, desc]);

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div className={classes.block}>
                <div className={classes.descHeader}>
                    <Typography className={classes.blockTitle} style={{ marginBottom: 0 }}>A propos</Typography>
                    <IconButton
                        size="small"
                        onClick={handleEditDesc}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                </div>
                <Typography style={{ fontSize: 15 }}>
                    {desc}
                </Typography>
                {(canSeeMore && currentPlace.description.length > 100) && <Button
                    onClick={handleSeeMoreDesc}
                    style={{ display: 'flex', alignItems: 'center', textTransform: 'initial', color: '#888' }}
                >
                    Plus
                    <ArrowDropDown />
                </Button>
                }
                {(!canSeeMore && currentPlace.description.length > 100) &&
                    <Button
                        onClick={handleSeeLessDesc}
                        style={{ display: 'flex', alignItems: 'center', textTransform: 'initial', color: '#888' }}
                    >
                        Moins
                        <ArrowDropUp />
                    </Button>
                }
                {editDesc &&
                    <DescEditor open={editDesc} handleClose={handleCloseDescEditor} place={currentPlace} />
                }
            </div>
            <div className={classes.block}>
                <Typography className={classes.blockTitle}>Mentions</Typography>
                <Typography className={classes.info}>
                    <span className={classes.value}>200</span>
                    <span className={classes.label}>J'aime</span>
                </Typography>
                <Typography className={classes.info}>
                    <span className={classes.value}>100</span>
                    <span className={classes.label}>Sont venu</span>
                </Typography>
                <Typography className={classes.info}>
                    <span className={classes.value}>0</span>
                    <span className={classes.label}>Commentaires</span>
                </Typography>
            </div>
            {currentPlace.coverage === "super" &&
                <div className={classes.block}>
                    <Typography className={classes.blockTitle}>Sous places</Typography>
                    <Typography className={classes.info}>
                        <span className={classes.value}>200</span>
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={`${classes.actionBtn} btn`}
                        fullWidth
                        disableElevation
                        onClick={handleAddChildPlace}
                    >
                        Ajouter
                    </Button>
                    {addChild &&
                        <AddChildPlace
                            parentPlace={currentPlace}
                            open={addChild}
                            handleCancel={cancelAddChildPlace}
                        />
                    }
                </div>
            }
        </div>
    )
}

PlaceMoreInfos.propTypes = {
    currentPlace: PropTypes.object,
}

const useStyles = makeStyles(theme => ({
    container: {
        position: 'absolute',
        right: 0,
        display: 'grid',
        rowGap: 10,
        gridTemplateColumns: 'auto',
        padding: '0 20px 0 0',
        width: 300,
        top: 135,
        zIndex: 101,
        transition: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
    },
    block: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        border: '1px solid #f5f5f5',
    },
    info: {
        fontSize: '18px !important',
        display: 'flex',
        alignItems: 'center',
        margin: '5px 0',
        "& > span": {
            display: 'block'
        }
    },
    blockTitle: {
        fontSize: 18,
        fontWeight: '600!important',
        marginBottom: 15,
    },
    value: {
        fontSize: 15,
        marginRight: 10,
        backgroundColor: fade(theme.palette.primary.main, 0.8),
        borderRadius: 15,
        padding: '1px 15px',
        color: '#fff',
    },
    label: {
        flex: 1,
        fontSize: 15
    },
    actionBtn: {
        marginTop: '15px!important',
        width: '100%!important'
    },
    descHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    [theme.breakpoints.down('xs')]: {
        container: {
            gridTemplateColumns: "auto!important",
            columnGap: 10
        }
    },
    [theme.breakpoints.down('sm')]: {
        container: {
            width: '100%',
            height: 'fit-content',
            padding: 0,
            position: 'static',
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: 10
        }
    }
}));

const DescEditor = (props) => {
    const { open, handleClose, place } = props;
    const [description, setDescription] = useState(place.description);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const onOk = () => {
        setSaved(false);
        handleClose();
    }

    const dispatch = useDispatch()
    const handleSubmit = () => {
        if (description !== "" && description !== place.description) {
            setLoading(true);
            axios
                .post(`/place/${place._id}/update`, { description })
                .then(res => {
                    const data = res.data;
                    if (data.code) {
                        setError(data);
                    } else {
                        dispatch(actions.updatePlaceData({ placeId: place._id, label: 'description', value: description }));
                        setError(null);
                        setSaved(true);
                    }
                })
                .catch(err => {
                    setError(err);
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const classes = useDescEditorStyles();
    return (
        <Modal
            open={open}
            handleClose={onOk}
            backBtn
        >
            <div className={classes.modalContent}>
                <div className={classes.container}>
                    {saved ?
                        <div style={{ width: '100%', minHeight: 315, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography color="textSecondary">Modification réussit!</Typography>
                            <Button
                                className={classes.action}
                                variant="contained"
                                color="primary"
                                onClick={onOk}
                            >
                                Ok
                            </Button>
                        </div> :
                        <>
                            <Typography variant="h6" className={classes.title}>Modifier la description</Typography>
                            <FormGroup
                                label="Description *"
                                labelVariant="body1"
                                error={error ? true : false}
                                helperText={error}
                                name="description"
                                id="description"
                                placeholder="Entrez la description ici."
                                type="text"
                                fullWidth={true}
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                rowsMax={10}
                                multiline={true}
                                info="Une petite description. Comme par exemple l'objet de la place, les activités exercées dans cette place ou encore la description de l'entourage."
                                style={{
                                    marginTop: 30
                                }}
                                inputStyle={{ fontSize: 20, marginTop: 10 }}
                            />
                            <div className={classes.actions}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    className={classes.action}
                                    disabled={description === place.description}
                                >
                                    Enregister
                                    {loading && <CircularProgress size={10} style={{ marginLeft: 10 }} />}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleClose}
                                    className={classes.action}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </Modal>
    )
}

DescEditor.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func,
    error: PropTypes.string
};


const useDescEditorStyles = makeStyles(theme => ({
    container: {
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 460,
        minHeight: 365,
        padding: 25,
        boxShadow: '0px 1px 8px 1px #00000061',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: ' column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    action: {
        textTransform: 'initial',
    },
    title: {
        width: '100%',
    }
}));

export default PlaceMoreInfos;
