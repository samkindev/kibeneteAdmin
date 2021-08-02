import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Compressor from 'compressorjs';
import { makeStyles, Button, Typography } from '@material-ui/core';
import { LoadingData, Modal } from '.';
import { AddAPhoto, Check } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

const ImageUploader = (props) => {
    const imageRef = React.useRef();
    const { confirmHandler, inputId, showLabel, label, loaded, error, buttonStyles } = props;
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(false);
    const [url, setUrl] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [compressError, setCompressError] = useState(null);
    const [loadingError, setLoadingError] = useState(null);

    const handleImageChange = (e) => {
        const f = e.target.files[0];
        if (f) {
            setPreview(true);
            setCompressing(true);
            new Compressor(f, {
                quality: 0.8,
                height: 462,
                success: (compressed) => {
                    setFile(compressed);
                    const url = URL.createObjectURL(compressed);
                    if (url) {
                        setUrl(url);
                        setCompressing(false);
                    }
                }
            }, (err) => {
                if (err) {
                    console.log(err);
                    setCompressing(false);
                    setCompressError(err);
                }
            });
        }
    };

    const confirmImage = () => {
        confirmHandler(file, (loading, error) => {
            setLoadingImage(loading);
            setLoadingError(error);
            if (!loading) {
                setPreview(false);
            }
        });
    };

    const closePreview = () => {
        setFile(null);
        setPreview(false);
    };

    const classes = useStyles();
    return (
        <div className={classes.container}>
            {showLabel && <Typography variant="body2" className="input-label">{label}</Typography>}
            <div>
                <input
                    type="file"
                    ref={imageRef}
                    className={classes.input}
                    onChange={handleImageChange}
                    accept="image/*"
                    id={inputId}
                />
                <label htmlFor={inputId}>
                    <span className={classes.imageBtn} style={buttonStyles}>
                        {loaded ?
                            <Check color="secondary" /> :
                            <AddAPhoto color="disabled" />
                        }
                    </span>
                    {error && <Typography color="error" variant="caption" component="span">{error}</Typography>}
                </label>
            </div>
            {preview &&
                <Modal
                    open={preview}
                >
                    <div className={classes.modalContentContainer}>
                        {compressing ?
                            <LoadingData /> :
                            <div className={classes.previewContainer}>
                                <img src={url} alt="preview" className={classes.image} />
                                {loadingImage &&
                                    <div className={classes.loadingImage}>
                                        <LoadingData />
                                    </div>
                                }
                            </div>
                        }
                        {(compressing && compressError) &&
                            <Alert severity="error" color="error">{compressError}</Alert>
                        }
                        <div className={classes.actions}>
                            <div className={classes.innerActions}>
                                {loadingError &&
                                    <Alert severity="error" color="error">
                                        {loadingError}
                                    </Alert>
                                }
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={confirmImage}
                                    className="btn"
                                >
                                    Confirmer
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={closePreview}
                                    className="btn"
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}


ImageUploader.propTypes = {
    confirmHandler: PropTypes.func,
    inputId: PropTypes.string,
    showLabel: PropTypes.bool,
    label: PropTypes.string,
    loaded: PropTypes.bool,
    error: PropTypes.string,
    buttonStyles: PropTypes.object,
};


const useStyles = makeStyles(theme => ({
    container: {
        width: 'fit-content',
        height: 'fit-content',
    },
    input: {
        display: 'none',
    },
    imageBtn: {
        width: 70,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '1px solid #eaeaea',
        borderRadius: 10,
        transition: 'background 0.2s',
        overflow: 'hidden',
        backgroundColor: "#ffffff85",
        "&:hover": {
            backgroundColor: '#eaeaea',
        }
    },
    modalContentContainer: {
        backgroundColor: '#00121f',
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '85%',
        height: '95vh',
    },
    previewContainer: {
        position: 'relative',
    },
    loadingImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
    },
    innerActions: {
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffffc4'
    },
    [theme.breakpoints.down('sm')]: {
        modalContentContainer: {
            width: '100%',
            height: '100%',
            borderRadius: 0,
        }
    }
}));


export default ImageUploader;
