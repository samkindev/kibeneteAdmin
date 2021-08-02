import React from 'react';
import PropTypes from 'prop-types';

import { SaveRounded } from '@material-ui/icons';
import { Typography, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const FormContainer = (props) => {
    const {
        title,
        titleProps,
        containerStyle,
        titleStyle,
        children,
        useSubmit,
        submitTitle,
        onSubmit,
        submitBtnProps = {},
        alert,
        alertText,
        alertTitle = "Erreur",
        submitStatus,
        alertType = "error",
        titleVariant = "h4"
    } = props;

    return (
        <div className="form-container" style={containerStyle}>
            <Typography variant={titleVariant} style={titleStyle} {...titleProps}>{title}</Typography>
            {alert &&
                <Alert variant="outlined" severity={alertType} title={alertTitle} color={alertType} >{alertText}</Alert>
            }
            {children}
            {useSubmit &&
                <Button
                    {...submitBtnProps}
                    variant="contained"
                    color="primary"
                    className="btn"
                    onClick={onSubmit}
                    style={{ color: "#fff", marginTop: 20, textTransform: 'initial', display: 'flex', alignItems: 'center', ...submitBtnProps.style }}
                    fullWidth
                >
                    <SaveRounded style={{ marginRight: 10 }} />
                    {submitTitle}
                    {submitStatus === "loading" && <CircularProgress style={{ marginLeft: 10 }} color="inherit" size={17} />}
                </Button>}
        </div>
    )
}


FormContainer.propTypes = {
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    children: PropTypes.element,
    useSubmit: PropTypes.bool,
    onSubmit: PropTypes.func,
    submitTitle: PropTypes.string,
    submitBtnProps: PropTypes.object,
    submitStatus: PropTypes.string,
    alert: PropTypes.bool,
    alertText: PropTypes.string,
    alertTitle: PropTypes.string,
    alertType: PropTypes.string,
    titleProps: PropTypes.object,
    titleVariant: PropTypes.string,
};


export default FormContainer;
