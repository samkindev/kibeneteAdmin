
export const validatePlaceFormFields = (filds, setErrors) => {
    let valid = true;
    let errors = {
        name: null,
        shortName: null,
        commune: null,
        quater: null,
        number: null,
        image: null
    };

    const isGood = (field) => (field && field !== "" && field.length > 2);

    for (let key of Object.keys(filds)) {
        if (!isGood(filds[key])) {
            errors[key] = "Ce champs est réquis";
            valid = false;
        } else {
            errors[key] = null;
        }
    }
    setErrors(errors);

    return valid;
};

export const validateCategoryFilds = (name, description, setErrors) => {
    let valid = true;

    if (name === "" || description === "") {
        valid = false;
        setErrors("Verifier les données que vous avez entré.")
    } else {
        setErrors(null);
    }

    return valid;
};

export const validatePhotoFields = (place, image, setErrors) => {
    let valid = {
        place: true,
        image: true,
    };
    if (place === "") {
        setErrors(errors => ({ ...errors, place: 'Vous devez specifier la place pour laquelle vous ajoutez une photo.' }));
        valid.place = false;
    } else if (place !== "") {
        setErrors(errors => ({ ...errors, place: null }));
    }
    if (!image) {
        setErrors(errors => ({ ...errors, image: 'Veillez sellectionner une image.' }));
        valid.image = false;
    } else if (image) {
        setErrors(errors => ({ ...errors, image: null }));
    }

    return valid;
};

/** Place form validators */

const validateCoordinates = (lat, lon) => {
    let valid = true;
    let error = null;

    if (lat === "" || lon === "") {
        valid = false;
        error = "Les coordonnées géographiques sont réquises";
    }

    return { valid, error };
};

const validateCategoryAndType = (category, type) => {
    let valid = true;
    let error = {
        category: null,
        type: null,
    };

    if (category === "") {
        valid = false;
        error.category = "Ce champs est réquis";
    }

    if (type === "" || (type !== "simple" && type !== 'super')) {
        valid = false;
        error.type = "Mauvais type sélectionné";
    }

    return { valid, error };
};

const validateNames = (name, shortName) => {
    let valid = true;
    let error = {
        name: null,
        shortName: null
    };

    if (name === "") {
        valid = false;
        error.name = "Le nom est réquis";
    }
    if (name.length > 100) {
        valid = false;
        error.name = "Le nom de la place est trop long";
    }

    if (shortName.length > name.length || name.length > 100) {
        valid = false;
        error.shortName = "La longueur du nom court doit être inférieure à la longueur du nom complet";
    }

    return { valid, error };
};

const validateDescription = (image, description) => {
    let valid = true;
    let error = {
        description: null,
        image: null
    };

    if (description === "") {
        valid = false;
        error.description = "La description de la place est réquises";
    }

    if (!image || image === null) {
        valid = false;
        error.image = "La photo de la place est réquise";
    }

    return { valid, error };
};

const validateAddressData = (city, commune, quater, avenue, num) => {
    let valid = true;
    let error = {
        city: null,
        commune: null,
        quater: null,
        avenue: null,
        num: null,
    };

    if (typeof city !== 'string') {
        valid = false;
        error = "La valeur fournie est incorrecte";
    }
    if (typeof commune !== 'string') {
        valid = false;
        error = "La valeur fournie est incorrecte";
    }
    if (typeof quater !== 'string') {
        valid = false;
        error = "La valeur fournie est incorrecte";
    }
    if (typeof avenue !== 'string') {
        valid = false;
        error = "La valeur fournie est incorrecte";
    }
    if (typeof num !== 'string') {
        valid = false;
        error = "La valeur fournie est incorrecte";
    }

    return { valid, error };
};

export const placeValidators = {
    validateAddressData,
    validateCoordinates,
    validateNames,
    validateCategoryAndType,
    validateDescription
};