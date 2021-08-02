import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Modal } from '.';

const ServerErrorDisplay = (props) => {
    const { open, error, handleClose } = props;

    const classes = useStyles();
    return (
        <Modal
            open={open}
            handleClose={handleClose}
            backBtn
        >
            <div className={classes.modalContent}>
                <div className={classes.container}>
                    <Alert severity="error" color="error">{error}</Alert>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClose}
                    >
                        Ok
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

ServerErrorDisplay.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func,
    error: PropTypes.string
};


const useStyles = makeStyles(theme => ({
    container: {
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 460,
        height: 200,
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
}));


export default ServerErrorDisplay;
