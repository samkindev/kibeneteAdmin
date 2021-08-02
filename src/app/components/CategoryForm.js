import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import FormContainer from './FormContainer';
import FormGroup from './FormGroup';

import { getError, getRequestStatus } from '../redux/slices/category';

const CategoryForm = (props) => {
    const { name, setName, description, setDescription, submitHandler, title, btnTitle } = props;
    const [error, setError] = useState(null);

    const reqStatus = useSelector(getRequestStatus);
    const serverErrors = useSelector(getError);

    const handleSubmit = () => {
        submitHandler(setError);
    };
    return (
        <FormContainer
            title={title}
            titleProps={{ variant: "h6" }}
            useSubmit
            submitTitle={btnTitle}
            onSubmit={handleSubmit}
            submitStatus={reqStatus}
            alert={(error || serverErrors) ? true : false}
            alertText={error ? error : serverErrors ? serverErrors.message : null}
            alertType="error"
            containerStyle={{
                maxWidth: 440
            }}
        >
            <div className="form-block">
                <FormGroup
                    label="Nom *"
                    name="name"
                    id="name"
                    placeholder="Nom de la catégorie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    labelVariant="body2"
                />
                <FormGroup
                    label="Description *"
                    name="description"
                    id="description"
                    placeholder="Une briève description de la catégorie"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rowsMax={5}
                    labelVariant="body2"
                />
            </div>
        </FormContainer>
    )
}

CategoryForm.propTypes = {
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
    description: PropTypes.string.isRequired,
    setDescription: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    btnTitle: PropTypes.string
}


export default CategoryForm;
