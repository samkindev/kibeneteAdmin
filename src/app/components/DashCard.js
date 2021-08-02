import React from 'react';
import PropTypes from 'prop-types';
import { Card, makeStyles } from '@material-ui/core';

export default function DashCard(props) {
    const { className, variant, children } = props;

    let backColor = "#119DFD";
    let hoverColor = 'rgb(11, 109, 177)';
    if (variant === "secondary") {
        backColor = '#FF03A5';
        hoverColor = 'rgb(178, 2, 115)';
    } else if (variant === "primary-light") {
        backColor = 'rgba(17, 157, 253, 0.25)';
        hoverColor = '#119DFD';
    } else if (variant === "secondary-light") {
        backColor = '#FF03A518';
        hoverColor = '#FF03A5';
    }

    let color = "#fff";
    if (variant.indexOf('light') !== -1) {
        color = "#333";
    }

    const classes = useStyles(backColor, color, hoverColor)();
    return (
        <Card className={`${classes.container} ${className}`}>
            {children}
        </Card>
    )
}

DashCard.propTypes = {
    variant: PropTypes.string.isRequired,
    color: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.element,
}

const useStyles = (backColor, color, hoverColor) => makeStyles({
    container: {
        backgroundColor: backColor,
        color: color,
        transition: "background .2s",
        "&:hover": {
            backgroundColor: hoverColor,
            color: "#fff"
        }
    }
});
