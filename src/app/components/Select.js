import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Select as MUiSelect, MenuItem, InputBase, withStyles } from '@material-ui/core';

const Select = (props) => {
    const { options, label, id, fullWidth, value, onChange, style, error, errorText } = props;
    return (
        <div className="select" style={style} >
            <Typography variant="body2" className="input-label">{label}</Typography>
            <MUiSelect
                id={id}
                fullWidth={fullWidth}
                value={value}
                onChange={onChange}
                input={<BootstrapInput error={error} />}
                error={error}
            >
                {options.map((option, index) => (
                    <MenuItem value={option._id ? option._id : option} key={`${option.name ? option.name : option}_${index}`}>{option.name ? option.name : option}</MenuItem>
                ))}
            </MUiSelect>
            {error && <Typography variant="caption" color="error" className="input-label">{errorText}</Typography>}
        </div>
    )
}

Select.propTypes = {
    options: PropTypes.array,
    label: PropTypes.string,
    id: PropTypes.string,
    fullWidth: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    error: PropTypes.bool,
    errorText: PropTypes.string,
}

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);


export default Select;