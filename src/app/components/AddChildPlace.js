import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { PlaceForm, Modal } from '.';

const AddChildPlace = (props) => {
    const { open, parentPlace, handleCancel } = props;

    const handleClose = () => {
        handleCancel();
    };

    const classes = useStyles();
    return (
        <Modal
            open={open}
            handleClose={handleClose}
            backBtn
        >
            <div className={classes.modalContent}>
                <div className={classes.container}>
                    <PlaceForm
                        parentPlace={parentPlace}
                        onSaveEnd={handleClose}
                        titleProps={{ className: classes.formTitle }}
                        formProps={{ className: classes.form }}
                        footerProps={{ className: classes.formFooter }}
                    />
                </div>
            </div>
        </Modal>
    )
}

AddChildPlace.propTypes = {
    open: PropTypes.bool.isRequired,
    parentPlace: PropTypes.object,
    handleCancel: PropTypes.func
};


const useStyles = makeStyles(theme => ({
    container: {
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 10,
        maxWidth: 960,
        padding: 25,
        height: '95vh',
        width: '85%',
        boxShadow: '0px 1px 8px 1px #00000061',
        overflow: 'hidden',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    [theme.breakpoints.down('sm')]: {
        form: {
        },
    },
    [theme.breakpoints.down('xs')]: {
        container: {
            width: '100%',
            height: '100%',
            borderRadius: 0,
            overflowY: 'auto',
        },
        form: {
            padding: '0 0 100px 0',
        },
        formTitle: {
            margin: 0
        },
        formFooter: {
            padding: '0 20px!important'
        },
    }
}));


export default AddChildPlace;
