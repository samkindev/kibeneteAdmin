import React from 'react';
import { PhotoCard } from '.';
import { shaffleArray } from '../customeFunctions/helpers';
import { makeStyles, Typography } from '@material-ui/core';

export default function PhotoGallery({ photos }) {
    const [columns, setColumns] = React.useState([]);

    React.useEffect(() => {
        const shuffled = shaffleArray(photos instanceof Array ? photos : []);

        let cols = [];
        let s = 0;
        const columnLength = shuffled.length / 3;
        for (let i = 0; i < 3; i++) {
            cols[i] = shuffled.slice(s, (columnLength * (i + 1)));
            s += columnLength;
        }

        setColumns(cols);
    }, [photos]);
    const classes = useStyles();
    return (
        <div className="row">
            {photos.length > 0 ?
                columns.map((col, index) => (
                    <div key={`column_${index}`} className="column">
                        {col.map((photo, index) => (
                            <PhotoCard key={`${photo._id}_${index}`} photo={photo} />
                        ))}
                    </div>
                )) :
                <div className={classes.noImage}>
                    <Typography variant="h6" color="textSecondary">Aucune photo trouvée!!</Typography>
                </div>
            }
        </div>
    )
}

const useStyles = makeStyles({
    noImage: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
    }
});
