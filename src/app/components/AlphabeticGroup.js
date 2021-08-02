import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';


export default function AlphabeticGroup({ group, component: Component }) {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Typography style={{ marginTop: 10, marginBottom: 10, textTransform: 'uppercase' }} variant="h6">{group.name}</Typography>
            <div className={classes.elements}>
                {group.elements.map(element => (
                    <Component key={element._id} data={element} />
                ))}
            </div>
        </div>
    )
}


const useStyles = makeStyles(theme => ({
    container: {},
    elements: {
        display: 'grid',
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20,
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr 1fr',
        },
        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: '1fr',
        },
    }
}));
