import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography } from '@material-ui/core';


const FormGroup = (props) => {
    const {
        variant,
        color,
        multiline,
        rowsMax,
        fullWidth,
        name,
        placeholder,
        onChange,
        value,
        error,
        helperText,
        info,
        style,
        label,
        id,
        inputRef,
        inputStyle,
        inputClassName,
        disabled,
        type = "text",
        labelVariant = "body2" } = props;
    return (
        <div className="form-group" style={{ marginTop: 10, ...style }}>
            <label htmlFor={id}>
                <Typography
                    variant={labelVariant}
                    className="input-label"
                >{label}</Typography>
            </label>
            <Typography
                variant="caption"
                color="textSecondary"
                className="input-label"
            >{info}</Typography>
            <TextField
                variant={variant}
                color={color}
                id={id}
                inputRef={inputRef}
                size="medium"
                multiline={multiline}
                maxRows={rowsMax}
                fullWidth={fullWidth}
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                className={`form-input`}
                inputProps={{ className: inputClassName, style: inputStyle }}
                error={error}
                helperText={helperText}
                disabled={disabled}
            />
        </div>
    );
}

FormGroup.propTypes = {
    name: PropTypes.string,
    multiline: PropTypes.bool,
    fullWidth: PropTypes.bool,
    rowsMax: PropTypes.number,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string.isRequired,
    labelVariant: PropTypes.string,
    variant: PropTypes.string,
    info: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    inputRef: PropTypes.any,
    inputStyle: PropTypes.object,
    inputClassName: PropTypes.string,
}


export default FormGroup;
