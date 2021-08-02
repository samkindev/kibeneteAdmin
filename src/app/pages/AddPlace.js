import React from 'react';
import { makeStyles } from '@material-ui/core';
import { PlaceForm } from '../components';

export default function AddPlace() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <PlaceForm
                formProps={{ className: classes.placeForm }}
                titleProps={{ className: classes.formTitle }}
                footerProps={{ className: classes.formFooter }}
            />
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        position: 'relative',
        padding: '20px',
        height: 'calc(100vh - 60px)',
        '& > div:nth-child(2n)': {
            height: 'calc(100% - 115px)',
        }
    },
    placeForm: {
        width: '100%!important',
        maxWidth: '100%!important',
        '& > div': {
            width: '100%',
        },
        '& .form-block': {
            width: '40%',
        },

    },
    formTitle: {
        margin: '0!important',
    },
    formFooter: {
        padding: '0 20px!important'
    },
    [theme.breakpoints.down('xs')]: {
        container: {
            padding: "20px 0",
            height: 'fit-content',
            paddingBottom: '100px!important',
            '& div:nth-child(2n)': {
                height: 'fit-content!important',
            }
        }
    }
}));
