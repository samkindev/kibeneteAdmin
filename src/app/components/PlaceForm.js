import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button, makeStyles, ButtonGroup, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ChevronLeft, ChevronRight, SaveSharp } from '@material-ui/icons';

import { FormGroup, FormContainer, Select, ImageUploader, ServerErrorDisplay } from '../components';

import { placeValidators } from '../customeFunctions/validators';
import { getLocation } from '../customeFunctions/geolocation';
import { createPlace, getRequestStatus, getError, actions } from '../redux/slices/places';
import { getAllCat } from '../redux/slices/category';

const PlaceForm = (props) => {
    const { parentPlace, onSaveEnd, titleProps, formProps, footerProps } = props;
    const [name, setName] = useState("");
    const [shortName, setShortName] = useState("");
    const [city, setCity] = useState("");
    const [commune, setCommune] = useState("");
    const [quater, setQuater] = useState("");
    const [avenue, setAvenue] = useState("");
    const [number, setNumber] = useState("");
    const [coverage, setCoverage] = useState('simple');
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({
        name: null,
        shortName: null,
        category: null,
        coverage: null,
        number: null,
        address: null,
        description: null,
        city: null,
        commune: null,
        quater: null,
        image: null,
        avenue: null
    });
    const [coordinatesErrors, setCoordinatesErrors] = useState(null);
    const [editCoords, setEditCoords] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedPlace, setSavedPlace] = useState(null);
    const [loadingPosition, setLoadingPosition] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const categories = useSelector(getAllCat);
    const submitStatus = useSelector(getRequestStatus);
    let submitErrors = useSelector(getError);
    const [serverError, setServerError] = useState(null);

    const lonRef = useRef();

    const next = () => {
        let isValid = true;
        if (step === 0) {
            const { valid, error } = placeValidators.validateCoordinates(lat, lon);
            isValid = valid;
            setCoordinatesErrors(error);
        } else if (step === 1) {
            const { valid, error } = placeValidators.validateCategoryAndType(category, coverage);
            isValid = valid;
            setErrors(errors => ({
                ...errors,
                category: error.category,
                coverage: error.type
            }));
        } else if (step === 2) {
            const { valid, error } = placeValidators.validateNames(name, shortName);
            isValid = valid;
            setErrors(errors => ({
                ...errors,
                name: error.name,
                shortName: error.shortName
            }));
        } else if (step === 3) {
            const { valid, error } = placeValidators.validateDescription(image, description);
            isValid = valid;
            setErrors(errors => ({
                ...errors,
                image: error.image,
                description: error.description
            }));
        } else if (step === 4) {
            const { valid, error } = placeValidators.validateAddressData(city, commune, quater, avenue, number);
            isValid = valid;
            setErrors(errors => ({
                ...errors,
                city: error.city,
                commune: error.commune,
                quater: error.quater,
                avenue: error.avenue,
                number: error.num,
            }));
        }

        if (isValid) {
            setStep(step + 1);
        }
    };

    const dispatch = useDispatch();
    const canSubmit = (lat !== "" && lon !== "" && name !== "" && description !== "" && description !== "" && coverage !== "" && city !== "" && commune !== "") ? true : false;
    const handleSubmit = () => {
        if (!canSubmit) {
            return;
        }
        setSaving(true);
        const address = `${city}, ${commune}, ${quater} ${avenue} ${number}`;
        const formData = new FormData();
        formData.append("lon", lon);
        formData.append("lat", lat);
        formData.append("name", name);
        formData.append("shortName", shortName);
        formData.append("address", address);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("coverage", coverage);
        formData.append("city", city);
        formData.append("commune", commune);
        formData.append("quater", quater);
        formData.append("avenue", avenue);
        formData.append("num", number);
        formData.append("main_image", image);

        if (parentPlace) {
            formData.append('parentPlace', parentPlace._id);
        }

        dispatch(createPlace(formData))
            .then(res => {
                if (res.payload) {
                    if (res.payload.status === 'saved') {
                        setSaved(true);
                        setSavedPlace(res.payload.saved);
                        if (typeof onSaveEnd === 'function') {
                            onSaveEnd();
                        }
                    }
                }
                setSaving(false);
            });
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
                setCoordinatesErrors(error);
            } else {
                setLon(position.coords.longitude.toString());
                setLat(position.coords.latitude.toString());
                setCoordinatesErrors(null);
            }
            setLoadingPosition(false);
            setEditCoords(false);
        });
    };

    const enterPostion = () => {
        setCoordinatesErrors(null);
        setEditCoords(true);
    };

    const handleCoverageChange = (event) => {
        const value = event.target.value;
        setCoverage(value);
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
    };

    const handleClearErrors = () => {
        dispatch(actions.clearErrors());
    };

    const handleGetImage = (data, loader) => {
        if (data.type.startsWith('image')) {
            setImage(data);
            loader(false, null);
            setErrors(errors => ({
                ...errors,
                image: null,
            }));
        }
    };

    React.useEffect(() => {
        setOpenModal(false);
        if (submitErrors) {
            if (submitErrors.code === 'validation/errors') {
                setServerError('Erreur de validation. Veuillez verifier que toutes les valuers entrées sont bien valides.');
                setOpenModal(true);
            }
        }
    }, [submitErrors]);

    React.useEffect(() => {
        if (image) {
            setImageLoaded(true);
        }
    }, [image]);

    React.useEffect(() => {
        if (lonRef.current) {
            lonRef.current.focus();
        }
    }, [editCoords]);

    const classes = useStyles();
    if (saved && savedPlace) {
        return (
            <>
                <Redirect
                    to={`/admin/places/${savedPlace._id}`}
                />
            </>
        )
    }

    return (
        <FormContainer
            title="Création d'une place"
            titleVariant="h6"
            titleProps={{
                ...titleProps,
                className: `${classes.title} ${titleProps ? titleProps.className : ""}`,
            }}
            submitTitle="Enregistrer place"
            submitStatus={submitStatus}
            containerStyle={{ height: '100%' }}
        >
            <form {...formProps} className={`${classes.container} ${formProps ? formProps.className : ""}`}>
                <div className={classes.formHeader}>
                    <Typography variant="h5" className={classes.formTitle}>{parentPlace ? "Ajouter une sous place" : "Ajouter une place"}</Typography>
                    {parentPlace && <Typography variant="h6" className={classes.placeName}>{parentPlace.name}</Typography>}
                </div>
                {step === 0 &&
                    <div className={classes.stepContainer}>
                        <div className={`form-block ${classes.step}`}>
                            <div className="form-group">
                                <Typography variant="h6" className={classes.stepTitle}>Coordonnées géographiques</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Obtenez la position de l'emplacement où vous vous trouvez en appuyant sur le bouton bleu.<br />
                                    Vous pouvez assi introduire des coordonnées en cliquant sur le bouton rouge.
                                </Typography>
                                {coordinatesErrors &&
                                    <Alert style={{ maxWidth: 520, marginTop: 15 }} variant="outlined" severity="error" title="Error" color="error" >{coordinatesErrors}</Alert>
                                }
                                {(editCoords || (lat !== "" && lon !== "")) &&
                                    <div style={{ display: 'flex', marginTop: 10 }}>
                                        <FormGroup
                                            inputRef={lonRef}
                                            label="Longitude"
                                            variant="outlined"
                                            id="lon"
                                            type="text"
                                            placeholder="Longitude"
                                            onChange={(e) => setLon(e.target.value)}
                                            value={lon}
                                            className="form-input"
                                            style={{ marginRight: 10 }}
                                            disabled={(!editCoords || loadingPosition) ? true : false}
                                        />
                                        <FormGroup
                                            label="Latitude"
                                            variant="outlined"
                                            type="text"
                                            id="lat"
                                            placeholder="Latitude"
                                            onChange={(e) => setLat(e.target.value)}
                                            value={lat}
                                            className="form-input"
                                            disabled={(!editCoords || loadingPosition) ? true : false}
                                        />
                                    </div>
                                }
                                <ButtonGroup fullWidth style={{ marginTop: 15, marginBottom: 10, maxWidth: 440, }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="medium"
                                        onClick={handleGetposition}
                                        style={{ textTransform: "initial" }}
                                    >
                                        Obtenir la position
                                        {loadingPosition && <CircularProgress style={{ marginLeft: 10 }} size={15} color="secondary" />}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="medium"
                                        onClick={enterPostion}
                                        style={{ textTransform: "initial" }}
                                    >Modifier la position</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                }
                {step === 1 &&
                    <div className={classes.stepContainer}>
                        <div className={`form-block ${classes.step}`}>
                            <Typography variant="h6" className={classes.stepTitle}>Catégorie et type</Typography>
                            <div className="form-group">
                                <Typography variant="caption" color="textSecondary">
                                    Dans les champs suivants choisissez une catégorie et un type de la place à ajouter.
                                </Typography>
                                <Select
                                    label="Type de place *"
                                    fullWidth
                                    id="coverage"
                                    onChange={handleCoverageChange}
                                    value={coverage}
                                    options={['simple', 'super']}
                                    style={{ margin: '15px 0' }}
                                    error={errors.coverage ? true : false}
                                    errorText={errors.coverage}
                                />
                                <Select
                                    label="Category *"
                                    fullWidth
                                    id="category"
                                    onChange={handleCategoryChange}
                                    value={category}
                                    options={categories}
                                    error={errors.category ? true : false}
                                    errorText={errors.category}
                                />
                            </div>
                        </div>
                    </div>
                }
                {step === 2 &&
                    <div className={classes.stepContainer}>
                        <div className={`form-block ${classes.step}`}>
                            <Typography variant="h6" className={classes.stepTitle}>Noms de la place</Typography>
                            <FormGroup
                                label="Nom complet de la place *"
                                labelVariant="body2"
                                id="name"
                                error={errors.name ? true : false}
                                helperText={errors.name}
                                variant="standard"
                                name="name"
                                placeholder="Nom complet"
                                type="text"
                                fullWidth={true}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                style={{
                                    marginBottom: 20
                                }}
                                inputClassName={classes.inputField}

                            />
                            <FormGroup
                                label="Nom court de la place"
                                variant="standard"
                                labelVariant="body2"
                                name="short name"
                                id="short_name"
                                placeholder="Nom court"
                                type="text"
                                error={errors.shortName ? true : false}
                                helperText={errors.shortName}
                                fullWidth={true}
                                onChange={(e) => setShortName(e.target.value)}
                                value={shortName}
                                inputClassName={classes.inputField}
                            />
                        </div>
                    </div>
                }
                {step === 3 &&
                    <div className={classes.stepContainer}>
                        <div className={`form-block ${classes.step}`}>
                            <Typography variant="h6" className={classes.stepTitle}>Description de la place</Typography>
                            <ImageUploader
                                inputId="new_place_main_image"
                                confirmHandler={handleGetImage}
                                label="Image de la place *"
                                showLabel={true}
                                loaded={imageLoaded}
                                error={errors.image}
                            />
                            <FormGroup
                                label="Description *"
                                labelVariant="h6"
                                error={errors.description ? true : false}
                                helperText={errors.description}
                                name="description"
                                id="description"
                                placeholder="Entrez la description ici."
                                type="text"
                                fullWidth={true}
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                rowsMax={5}
                                multiline={true}
                                info="Une petite description. Comme par exemple l'objet de la place, les activités exercées dans cette place ou encore la description de l'entourage."
                                style={{
                                    marginTop: 30
                                }}
                                inputStyle={{ fontSize: 20, marginTop: 10 }}
                            />
                        </div>
                    </div>
                }
                {step === 4 &&
                    <div className={classes.stepContainer}>
                        <div className={`form-block block2 ${classes.step}`}>
                            <Typography variant="h6" className={classes.stepTitle}>Informations supplémentaires</Typography>
                            <Typography variant="caption" color="textSecondary">
                                Ces informations permettent de determiner l'adresse complète de la place.
                            </Typography>
                            <FormGroup
                                label="Ville"
                                variant="outlined"
                                fullWidth={true}
                                name="city"
                                id="city"
                                placeholder="Nom de la ville"
                                onChange={(e) => setCity(e.target.value)}
                                value={city}
                            />
                            <FormGroup
                                label="Commune"
                                variant="outlined"
                                fullWidth
                                name="commune"
                                id="commune"
                                type="text"
                                placeholder="Nom de la commune"
                                onChange={(e) => setCommune(e.target.value)}
                                value={commune}
                            />
                            <div className={classes.inputGroup}>
                                <FormGroup
                                    label="Quartier"
                                    variant="outlined"
                                    fullWidth
                                    name="quater"
                                    id="quater"
                                    placeholder="Nom du quarier"
                                    onChange={(e) => setQuater(e.target.value)}
                                    value={quater}
                                    style={{
                                        flex: 1
                                    }}
                                />
                                <FormGroup
                                    label="Avenue"
                                    variant="outlined"
                                    fullWidth
                                    name="avenue"
                                    id="avenue"
                                    placeholder="Nom de l'avenue"
                                    onChange={(e) => setAvenue(e.target.value)}
                                    value={avenue}
                                    style={{
                                        marginLeft: 7,
                                        flex: 1
                                    }}
                                />
                                <FormGroup
                                    label="Numméro"
                                    variant="outlined"
                                    name="place number"
                                    id="place_number"
                                    type="text"
                                    onChange={(e) => setNumber(e.target.value)}
                                    value={number}
                                    className="form-input"
                                    style={{
                                        marginLeft: 7,
                                        maxWidth: 90
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                }
                <div {...footerProps} className={`${classes.actions} ${footerProps ? footerProps.className : ""}`}>
                    {step !== 0 &&
                        <Button
                            variant="contained"
                            color="secondary"
                            className="btn"
                            onClick={() => setStep(step - 1)}
                            style={{ color: "#fff", textTransform: 'initial' }}
                        >
                            <ChevronLeft />
                            Précendent
                        </Button>
                    }
                    {step < 4 &&
                        <Button
                            variant="contained"
                            color="primary"
                            className="btn"
                            onClick={next}
                            style={{ color: "#fff", textTransform: 'initial' }}
                        >
                            Suivant
                            <ChevronRight />
                        </Button>
                    }
                    {(step === 4) &&
                        <Button
                            variant="contained"
                            color="primary"
                            className="btn"
                            onClick={handleSubmit}
                            style={{ color: "#fff", textTransform: 'initial' }}
                            disabled={!canSubmit}
                        >
                            Enregister
                            <SaveSharp style={{ marginLeft: 10 }} />
                            {saving && <CircularProgress size={10} style={{ marginLeft: 10 }} />}
                        </Button>
                    }
                </div>
                {openModal &&
                    <ServerErrorDisplay open={openModal} error={serverError} handleClose={handleClearErrors} />
                }
            </form>
        </FormContainer >
    )
}


PlaceForm.propTypes = {
    parentPlace: PropTypes.object.isRequired,
    onSaveEnd: PropTypes.func,
    formProps: PropTypes.object,
    titleProps: PropTypes.object,
    footerProps: PropTypes.object,
}

const useStyles = makeStyles(theme => ({
    container: {
        height: '100%',
        padding: '0 40px'
    },
    stepContainer: {
        overflowY: 'auto',
        display: 'flex',
        padding: '20px 0',
        height: 'calc(100% - 135px)',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    step: {
        width: '50%',
    },
    stepTitle: {
        fontSize: '36px!important',
        lineHeight: 1.2,
        color: '#797979',
        marginBottom: 15,
    },
    actions: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        left: 0,
        height: 70,
        backgroundColor: '#fff',
        padding: '0 65px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px -3px 10px 0px #d8d8d84a'
    },
    title: {
        fontSize: '13px!important',
        textTransform: 'uppercase',
        margin: '0 40px',
        color: '#929292!important',
    },
    formHeader: {
        padding: '15px 0',
        borderBottom: '1px solid #eaeaea',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formTitle: {
        fontSize: "20px !important",
        fontWeight: 'lighter!important',
        color: '#3c3c3c'
    },
    placeName: {
        fontSize: '14px!important',
        fontWeight: '600!important',
        textTransform: 'capitalize',
    },
    inputField: {
        fontSize: '22px!important',
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: 440,
    },
    [theme.breakpoints.down('sm')]: {
        step: {
            width: '100%!important',
        },
        container: {
            height: 'fit-content!important',
        }
    },
    [theme.breakpoints.down('xs')]: {
        actions: {
            position: 'fixed',
        },
        container: {
            padding: '0 0 100px 0'
        }
    },
}))

export default PlaceForm;