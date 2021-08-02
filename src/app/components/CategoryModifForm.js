import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { IconButton, makeStyles, Typography, Button } from '@material-ui/core';
import { CategoryForm } from '.';
import { CloseOutlined } from '@material-ui/icons';

import { validateCategoryFilds } from '../customeFunctions/validators';
import { updateCategory, getRequestStatus } from '../redux/slices/category';

const CategoryModifForm = (props) => {
    const { category, closeHandler } = props;
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    const [saved, setSaved] = useState(false);
    const reqStatus = useSelector(getRequestStatus);

    const dispatch = useDispatch();
    const handleSubmit = (setError) => {
        const valid = validateCategoryFilds(name, description, setError);

        if (!valid) {
            return;
        }

        dispatch(updateCategory({ categoryId: category._id, data: { name, description } }))
            .then(res => {
                if (res.payload.status !== "saved") {
                    setSaved(true);
                }
            });
    };
    const handleClose = () => {
        if (reqStatus !== 'loading') {
            closeHandler();
        }
    };
    const classes = useStyles();
    return (
        <div className={classes.container}>
            {saved ?
                <div className={classes.dialog}>
                    <Typography>Catégorie modifiée</Typography>
                    <Button onClick={handleClose} variant="contained" color="primary" style={{ color: '#fff', textTransform: 'initial', marginTop: 10 }}>
                        Ok
                    </Button>
                </div> :
                <>
                    <IconButton className={classes.closeBtn} onClick={handleClose}>
                        <CloseOutlined />
                    </IconButton>
                    <CategoryForm
                        title="Modifier une catégorie"
                        btnTitle="Modifier"
                        name={name}
                        description={description ? description : ""}
                        setName={setName}
                        setDescription={setDescription}
                        submitHandler={handleSubmit}
                    />
                </>
            }
        </div>
    )
}

CategoryModifForm.propTypes = {
    category: PropTypes.object.isRequired,
    closeHandler: PropTypes.func.isRequired
};

const useStyles = makeStyles(theme => ({
    container: {
        padding: 10,
        position: 'relative',
        width: 400,
        height: 300,
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100%',
        }
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
    },
    dialog: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
}));


export default CategoryModifForm;