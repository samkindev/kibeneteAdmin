import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { CategoryModifForm, Modal } from '.';


const CategoryCard = ({ data: category }) => {
    const [modify, setModify] = useState(false);

    const classes = useStyles();

    const onModify = () => {
        setModify(!modify);
    };
    return (
        <Paper className={classes.container}>
            <div className={classes.innerContainer}>
                <div className={classes.header}>
                    <Typography variant="body1" style={{ fontWeight: '700', color: '#555' }}>{category.name}</Typography>
                </div>
                <div className={classes.body}>
                    <Typography variant="caption" style={{ fontWeight: '100', color: '#777' }} >{category.description}</Typography>
                </div>
                <div className={classes.footer}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={onModify}
                        style={{
                            flex: 1,
                            textTransform: "initial"
                        }}
                    >Modifier</Button>
                    {modify &&
                        <Modal open={modify} handleClose={onModify}>
                            <CategoryModifForm
                                category={category}
                                closeHandler={onModify}
                            />
                        </Modal>
                    }
                </div>
            </div>
        </Paper>
    )
}

CategoryCard.propTypes = {
    data: PropTypes.object.isRequired,
}


const useStyles = makeStyles({
    container: {
        height: 130,
    },
    innerContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
    },
    header: {
        flex: 2,
    },
    body: {
        flex: 3,
    },
    footer: {
        flex: 1,
        display: 'flex'
    }
});

export default CategoryCard;