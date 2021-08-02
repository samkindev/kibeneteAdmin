import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { CategoryForm } from '../components';

import { validateCategoryFilds } from '../customeFunctions/validators';
import { createCategory } from '../redux/slices/category';
import { makeStyles } from '@material-ui/core';

export default function AddCategory() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saved, setSaved] = useState(false);
    const [savedCat, setSavedCat] = useState(null);
    const dispatch = useDispatch();
    const handleSubmit = (setError) => {
        const valid = validateCategoryFilds(name, description, setError);

        if (!valid) {
            return;
        }

        dispatch(createCategory({ name, description }))
            .then(res => {
                if (res.payload.status === "saved") {
                    setSaved(true);
                    setSavedCat(res.payload.saved);
                }
            });
    };
    const classes = useStyles();

    if (saved && savedCat) {
        return (
            <>
                <Redirect
                    to={`/admin/categories/${savedCat._id}`}
                />
            </>
        );
    }

    return (
        <div className={classes.container}>
            <CategoryForm
                title="Créer une catégorie"
                btnTitle="Enregistrer"
                name={name}
                description={description}
                setName={setName}
                setDescription={setDescription}
                submitHandler={handleSubmit}
            />
        </div>
    )
}

const useStyles = makeStyles({
    container: {
        padding: 20,
    }
})
