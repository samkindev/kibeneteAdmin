import React from 'react';
import PropTypes from 'prop-types';
import { Card, makeStyles } from '@material-ui/core';

export default function DashCard(props) {
    const { className, variant, children } = props;

    let backColor = "#119DFD";
    let hoverColor = '#0b6db11a';
    if (variant === "secondary") {
        backColor = '#FF03A5';
        hoverColor = '#b2027342';
    } else if (variant === "primary-light") {
        backColor = 'rgba(17, 157, 253, 0.25)';
        hoverColor = '#0b6db11a';
    } else if (variant === "secondary-light") {
        backColor = '#FF03A518';
        hoverColor = '#b2027342';
    }

    const classes = useStyles(backColor, hoverColor)();
    return (
        <Card className={`${classes.container} ${className}`}>
            <span className={classes.colorBanner} />
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

const useStyles = (backColor, hoverColor) => makeStyles({
    container: {
        color: '#444',
        transition: "background .2s",
        position: 'relative',
        overflow: 'hidden',
        "&:hover": {
            backgroundColor: hoverColor,
        },
        "& > a": {
            display: 'block',
            height: '100%',
        },
    },
    colorBanner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 7,
        backgroundColor: backColor
    }
});
