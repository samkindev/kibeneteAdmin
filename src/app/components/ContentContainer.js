import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography, makeStyles, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { getAdmin } from '../redux/slices/admin';

const ContentContainer = (props) => {
    const { children, title, formPath, showAdd, containerStyles, containerClassName } = props;
    const admin = useSelector(getAdmin);
    const right = admin.authorization;
    const canAdd = (showAdd && (right.some(r => r === 'all') || right.some(r => r === 'w')));

    const classes = useStyles();
    return (
        <div className={`content ${containerClassName}`} style={containerStyles}>
            <div className={classes.header}>
                <Typography variant="h5">{title}</Typography>
                {canAdd &&
                    <Link to={formPath}>
                        <Button
                            color="secondary"
                            variant="contained"
                            size="medium"
                            disableElevation
                            style={{ display: "flex", alignItems: 'center' }}
                            className="btn"
                        >
                            <Add fontSize="small" />
                            Créer
                        </Button>
                    </Link>}
            </div>
            <div className={classes.body}>
                {children}
            </div>
        </div>
    )
}

ContentContainer.propTypes = {
    children: PropTypes.element,
    title: PropTypes.string.isRequired,
    formPath: PropTypes.string,
    showAdd: PropTypes.bool,
    containerStyles: PropTypes.object,
    containerClassName: PropTypes.string,
};

const useStyles = makeStyles(theme => ({
    header: {
        borderBottom: '1px solid #eaeaea',
        padding: '10px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
}));


export default ContentContainer;