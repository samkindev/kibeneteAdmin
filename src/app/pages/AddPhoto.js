import React, { useState } from 'react';

import { Typography, Button } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

import { FormGroup, ImageUploader, FormContainer } from '../components';
import { validatePhotoFields } from '../customeFunctions/validators';

export default function AddPlace() {
    const [place, setPlace] = useState("");
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({
        place: null,
        image: null,
    });
    const [block2, setBlock2] = useState(false);

    const canSubmit = place !== "" && image;
    const handleSubmit = () => {
        const valid = validatePhotoFields(place, image, setErrors);

        if (valid.image && valid.place) {
            const formData = new FormData();
            formData.append('place', place);
            formData.append('photo', image);
        }
    };

    const goNext = () => {
        const valid = place !== "";
        if (valid) {
            setBlock2(true);
        } else {
            setErrors(errors => ({ ...errors, place: 'Vous devez specifier la place pour laquelle vous ajoutez une photo.' }));
        }
    };

    const goBack = () => {
        setBlock2(false);
    };

    return (
        <FormContainer
            title="Ajouter une Photo"
            useSubmit submitTitle="Enregistrer photo"
            onSubmit={handleSubmit}
            submitBtnProps={{
                disabled: !canSubmit,
                style: {
                    display: block2 ? "block" : "none"
                }
            }}
        >
            <>
                {!block2 && <div className="form-block block1">
                    <Typography variant="h6" className="block-title">Informations basiques de la photo</Typography>
                    <FormGroup
                        label="Place *"
                        labelVariant="body2"
                        error={errors.place ? true : false}
                        helperText={errors.place}
                        variant="outlined"
                        name="name"
                        id="name"
                        placeholder="Nom complet"
                        type="text"
                        fullWidth={true}
                        onChange={(e) => setPlace(e.target.value)}
                        value={place}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        className="btn"
                        onClick={goNext}
                        style={{ marginTop: 20, textTransform: 'initial' }}
                    >
                        Suivant
                        <ChevronRight />
                    </Button>
                </div>
                }
                {block2 &&
                    <div className="form-block block2">
                        <ImageUploader
                            title="Selectionner une image *"
                            errorText={errors.image}
                            confirmHandler={(file) => setImage(file)}
                        />
                        <Button
                            variant="outlined"
                            color="secondary"
                            className="btn"
                            onClick={goBack}
                            style={{ marginTop: 20, textTransform: 'initial' }}
                        >
                            <ChevronLeft />
                            Précedent
                        </Button>
                    </div>
                }
            </>
        </FormContainer>
    )
}
