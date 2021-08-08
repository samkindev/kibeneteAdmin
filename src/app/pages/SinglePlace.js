import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectById, actions } from '../redux/slices/places';
import axios from '../config/axios';
import { makeStyles, IconButton, Typography, Button, CircularProgress } from '@material-ui/core';
import { Close, CloseOutlined } from '@material-ui/icons';

import { LoadingData, ContentContainer, PhotoGallery, ImageUploader, PlaceData, Select, Modal, FormContainer, FormGroup, PlaceMoreInfos } from '../components';
import { compareDates } from '../customeFunctions/helpers';
import { createPhoto, getRequestStatus as getPhotoRequestStatus } from '../redux/slices/photos';
import { getAllCat } from '../redux/slices/category';
import { placeValidators } from '../customeFunctions/validators';

import { getLocation } from '../customeFunctions/geolocation';

export default function SinglePlace() {
    const { placeId } = useParams();
    const place = useSelector(state => {
        return selectById(state, placeId);
    });

    const categories = useSelector(getAllCat);

    const [currentPlace, setCurrentPlace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);

    const requestPhotoStatus = useSelector(getPhotoRequestStatus);
    const dispatch = useDispatch();
    const handleAddImage = (file, loadingSetter) => {
        let error = null;
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('place', placeId);
        formData.append('height', 462);
        loadingSetter(true, error);
        dispatch(createPhoto({ placeId, formData }))
            .then(res => {
                const data = res.payload;
                if (data.code) {
                    console.log(data);
                    error = data;
                } else {
                    setPhotos([res.payload, ...photos]);
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                loadingSetter(false, error);
            });
    };

    const handleChangeMainImage = (file, loadingSetter) => {
        if (file) {
            const formData = new FormData();
            formData.append('main_image', file);
            loadingSetter(true, null);
            axios
                .post(`/place/${currentPlace._id}/update`, formData)
                .then(res => {
                    const data = res.data;
                    if (data.code) {
                        setError(data.message);
                    } else {
                        dispatch(actions.updatePlaceData({ placeId: currentPlace._id, label: 'main_image', value: data.main_image }));
                        setError(null);
                    }
                })
                .catch(err => {
                    setError(err.message);
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                    loadingSetter(false, error);
                });
        }
    };

    useEffect(() => {
        if (place) {
            setCurrentPlace(place);
        } else {
            setLoading(true);
            axios.get(`/place/${placeId}`)
                .then(res => {
                    const data = res.data;
                    if (data.code) {
                        setError(data);
                        return Promise.reject(data.message);
                    } else {
                        setCurrentPlace(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                    setError(err);
                })
                .finally(() => setLoading(false));
        }

        axios.get(`/photo/by_place/${placeId}`)
            .then(res => {
                if (res.data.code) {
                    setError(res.data);
                    return Promise.reject(res.data.message);
                } else {
                    const photos = res.data.sort((a, b) => compareDates(a.createdAt, b.createdAt));
                    setPhotos(photos);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, [place, placeId]);
    const classes = useStyles();
    return (
        <div>
            {(loading || !currentPlace) ?
                <LoadingData /> :
                <ContentContainer
                    title={currentPlace.name}
                    searchHandler={() => { }}
                    searchLoading={loading}
                    searchResults={[]}
                >
                    <div className={classes.contentContainer}>
                        <div className={classes.infoHeader}>
                            <div className={classes.imageContainer}>
                                <img className={classes.image} src={currentPlace.main_image} srcSet={currentPlace.main_image} alt={currentPlace.name} />
                                <div className={classes.addPhotoLabel}>
                                    <ImageUploader
                                        inputId="main_image_update"
                                        transparent
                                        confirmHandler={handleChangeMainImage}
                                        showLabel={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={classes.dataCardsContainer}>
                            <DisplayCoords currentPlace={currentPlace} />
                            <DataWithSelect
                                currentData={currentPlace.category}
                                title="Catégorie"
                                label="Selectionnez une catégorie"
                                currentPlace={currentPlace}
                                name="category"
                                options={categories}
                            />
                            <DataWithSelect
                                name="coverage"
                                title="Type de place"
                                label="Selectionnez un type"
                                currentData={currentPlace.coverage}
                                currentPlace={currentPlace}
                                options={['simple', 'super']}
                            />
                        </div>
                        <div className={classes.data}>
                            <Typography variant="h6">Autres données</Typography>
                            <ul className={classes.details}>
                                <PlaceData
                                    className={classes.row}
                                    currentPlace={currentPlace}
                                    currentValue={currentPlace.name}
                                    label="Nom"
                                    name="name"
                                />
                                <PlaceData
                                    className={classes.row}
                                    currentPlace={currentPlace}
                                    currentValue={currentPlace.short_name}
                                    label="Nom court"
                                    name="short_name"
                                />
                                <PlaceData
                                    className={classes.row}
                                    currentPlace={currentPlace}
                                    currentValue={currentPlace.address}
                                    label="Adresse complète"
                                    name="address"
                                />
                                <PlaceData
                                    className={classes.row}
                                    currentPlace={currentPlace}
                                    currentValue={currentPlace.city}
                                    label="Ville"
                                    name="city"
                                />
                                <PlaceData
                                    className={classes.row}
                                    currentPlace={currentPlace}
                                    currentValue={currentPlace.commune}
                                    label="Commune"
                                    name="commune"
                                />
                                <PlaceData
                                    className={classes.row}
                                    currentPlace={currentPlace}
                                    currentValue={currentPlace.quater}
                                    label="Quartier"
                                    name="quater"
                                />
                                {currentPlace.avenue &&
                                    <PlaceData
                                        className={classes.row}
                                        currentPlace={currentPlace}
                                        currentValue={currentPlace.avenue}
                                        label="Avenue"
                                        name="avenue"
                                    />
                                }
                                {currentPlace.avenue &&
                                    <PlaceData
                                        className={classes.row}
                                        currentPlace={currentPlace}
                                        currentValue={currentPlace.num}
                                        label="Numéro"
                                        name="num"
                                    />
                                }
                            </ul>
                        </div>
                        <PlaceMoreInfos currentPlace={currentPlace} />
                        <div className={classes.photos}>
                            <div className={classes.photoHeader}>
                                <Typography variant="h6" className={classes.sectionTitlte}>Photos</Typography>
                                <div className={classes.addPhotoContainer}>
                                    <ImageUploader
                                        inputId="new_place_photo"
                                        displayName={false}
                                        showLabel={false}
                                        errorText=""
                                        confirmHandler={handleAddImage}
                                        buttonStyles={{
                                            maxHeight: 45
                                        }}
                                    />
                                    {requestPhotoStatus === 'pending' && <LoadingData />}
                                </div>
                            </div>
                            <PhotoGallery
                                photos={photos}
                            />
                        </div>
                    </div>
                </ContentContainer>
            }
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    contentContainer: {
        padding: '10px 0',
        paddingRight: 300
    },
    addPhotoLabel: {
        position: 'absolute',
        width: 'fit-content',
    },
    infoHeader: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'rgb(218 218 218 / 20%)',
        padding: 20,
        margin: '10px 0 30px 0',
        borderRadius: 10,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        minHeight: 100,
        backgroundColor: '#eaeaea',
        height: 200,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    image: {
        height: 'auto!important'
    },
    data: {
        padding: '20px 0'
    },
    details: {
        borderRadius: 10,
        border: '1px solid #eee',
        marginTop: 10,
        padding: 10,
    },
    photos: {
        padding: "10px 0",
    },
    createBtn: {
        width: 17,
        height: 17,
    },
    create: {
        fontSize: 15
    },
    addPhotoContainer: {
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content'
    },
    photoHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eaeaea',
        padding: '10px 0'
    },
    row: {
        padding: '5px 0',
        "&:not(:last-child)": {
            borderBottom: '1px solid #e8e8e8'
        }
    },
    dataCardsContainer: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto',
        gap: 15,
        margin: '25px 0 15px 0',
    },
    dataCard: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 5,
        border: '1px solid #ff03a52e',
        padding: 10,
    },
    dataValue: {
        "& > span": {
            display: 'block'
        }
    },
    dataCardAction: {
        textTransform: 'initial',
        width: 'fit-content',
        marginTop: 5
    },
    form: {
        position: 'relative',
    },
    [theme.breakpoints.down('sm')]: {
        contentContainer: {
            paddingRight: 0,
        },
        dataCardsContainer: {
            gridTemplateColumns: 'auto auto',
        },
    },
    [theme.breakpoints.down('xs')]: {
        dataCardsContainer: {
            gridTemplateColumns: 'auto',
        }
    },
    modalContent: {
        padding: 20,
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}));


const DisplayCoords = ({ currentPlace }) => {
    const coords = currentPlace.position.coordinates;
    const [modif, setModif] = useState(false);
    const [lon, setLon] = useState(coords[0]);
    const [lat, setLat] = useState(coords[1]);
    const [error, setError] = useState(false);
    const [reqStatus, setReqStatus] = useState('idle');
    const [loadingPosition, setLoadingPosition] = useState(false);


    const openModif = () => {
        setModif(true)
    }
    const handleClose = () => {
        setModif(false);
        setLon(coords[0]);
        setLat(coords[1]);
    };

    const canUpdate = (lat !== coords[1] || lon !== coords[0]);

    const dispatch = useDispatch();
    const handleSubmit = () => {
        const { valid, error } = placeValidators.validateCoordinates(lat, lon);
        setError(error);
        if (valid) {
            setReqStatus('loading');
            axios
                .post(`/place/${currentPlace._id}/update`, { lat, lon })
                .then(res => {
                    console.log(res.data);
                    const data = res.data;
                    if (data.code) {
                        setError(data.message);
                    } else {
                        dispatch(actions.updatePlaceData({ placeId: currentPlace._id, label: 'position', value: data.position }));
                        setError(null);
                    }
                })
                .catch(err => {
                    setError(err.message);
                    console.log(err);
                })
                .finally(() => {
                    setReqStatus('completed');
                    setModif(false);
                });
        }
    };

    const handleGetposition = () => {
        setLoadingPosition(true);
        getLocation((err, position) => {
            let error = err;
            if (err) {
                if (err.startsWith("Network location provider at")) {
                    error = "Problème de connexion. Veuillez verifier votre connexion.";
                } else if (err.startsWith("User denied")) {
                    error = "Veuiller autoriser ce site web d'acceder à la géolocalisation avant de continuer.";
                }
                setError(error);
            } else {
                setLon(position.coords.longitude.toString());
                setLat(position.coords.latitude.toString());
                setError(null);
            }
            setLoadingPosition(false);
        });
    };

    const classes = useStyles();
    return (
        <div className={classes.dataCard}>
            <div>
                <Typography variant="body1">Coordonnées</Typography>
                <Typography variant="caption" className={classes.dataValue}>
                    <span>
                        <span>Latitude:</span> {coords[1].toString().slice(0, 7)}
                    </span>
                    <span>
                        <span>Longitude:</span> {coords[0].toString().slice(0, 7)}
                    </span>
                </Typography>
            </div>
            <Button
                className={classes.dataCardAction}
                onClick={openModif}
                variant="outlined"
            >
                Modifier
            </Button>
            {modif &&
                <Modal
                    open={modif}
                    handleClose={handleClose}
                >
                    <div className={classes.modalContent}>
                        <IconButton className={classes.closeBtn} onClick={handleClose}>
                            <CloseOutlined />
                        </IconButton>
                        <FormContainer
                            title="Modification des coordonnées"
                            titleProps={{ variant: "h6", style: { maxWidth: '70%' } }}
                            useSubmit
                            submitTitle="Confirmer"
                            onSubmit={handleSubmit}
                            submitBtnProps={{
                                disabled: !canUpdate
                            }}
                            submitStatus={reqStatus}
                            alert={(error) ? true : false}
                            alertText={error ? error : null}
                            alertType="error"
                        >
                            <div className={classes.form}>
                                <FormGroup
                                    label="Latitude"
                                    name="lat"
                                    id="lat"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    labelVariant="body2"
                                />
                                <FormGroup
                                    label="longitude"
                                    name="lon"
                                    id="lon"
                                    value={lon}
                                    onChange={(e) => setLon(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    labelVariant="body2"
                                />
                                <Button
                                    className={classes.dataCardAction}
                                    onClick={handleGetposition}
                                    variant="outlined"
                                >
                                    Position actuele
                                </Button>
                                {loadingPosition &&
                                    <div className={classes.loader}>
                                        <CircularProgress size={20} />
                                    </div>
                                }
                            </div>
                        </FormContainer>
                    </div>
                </Modal>
            }
        </div>
    );
}


const DataWithSelect = ({ currentPlace, currentData, name, label, title, options }) => {
    const [modif, setModif] = useState(false);
    const [value, setValue] = useState(currentData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const openModif = () => {
        setModif(true);
    };

    const handleCancel = () => {
        setModif(false);
        setValue(currentData);
        setError(null);
    };

    const handleCoverageChange = (e) => {
        setValue(e.target.value);
    };

    const dispatch = useDispatch()
    const submitUpdate = () => {
        if (value !== "" && value !== currentData) {
            setLoading(true);
            axios
                .post(`/place/${currentPlace._id}/update`, { [name]: value })
                .then(res => {
                    const data = res.data;
                    if (data.code) {
                        setError(data.message);
                    } else {
                        dispatch(actions.updatePlaceData({ placeId: currentPlace._id, label: [name], value: data[name] }));
                        setError(null);
                    }
                })
                .catch(err => {
                    setError(err.message);
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                    setModif(false);
                });
        }
    };

    const classes = useStyles();
    return (
        <div className={classes.dataCard}>
            <div>
                <Typography variant="body1">{title}</Typography>
                {modif ?
                    <div>
                        <Select
                            label={label}
                            fullWidth
                            id={name}
                            onChange={handleCoverageChange}
                            value={value}
                            options={options}
                            style={{ margin: '15px 0' }}
                        />
                        {error && <Typography color="error" variant="caption">{error}</Typography>}
                    </div> :
                    <Typography variant="caption" style={{ textTransform: 'capitalize' }}>
                        {currentData}
                    </Typography>
                }
            </div>
            {modif ?
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        className={classes.dataCardAction}
                        onClick={submitUpdate}
                        variant="contained"
                        color="primary"
                        size="small"
                    >
                        Valider
                        {loading &&
                            <CircularProgress size={10} />
                        }
                    </Button>
                    <Button
                        className={classes.dataCardAction}
                        onClick={handleCancel}
                        variant="contained"
                        color="secondary"
                    >
                        <Close fontSize="small" />
                    </Button>
                </div> :
                <Button
                    className={classes.dataCardAction}
                    onClick={openModif}
                    variant="outlined"
                >
                    Modifier
                </Button>
            }
        </div>
    );
};