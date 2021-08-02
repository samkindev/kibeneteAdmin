import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { CategoryCard, AlphabeticGroup, ContentContainer, LoadingData } from '../components';

import { getAllCat, getCategories, getLoadingDataState } from '../redux/slices/category';
import { useCreateGroupsFromData } from '../customeFunctions/helpers';

export default function Categories() {
    const { url } = useRouteMatch();
    const categories = useSelector(getAllCat);
    const loadingData = useSelector(getLoadingDataState);

    const dispatch = useDispatch();

    const groups = useCreateGroupsFromData(categories);

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(getCategories());
        }
    }, [dispatch, categories]);

    const classes = useStyles();
    return (
        <ContentContainer
            title="Catégories"
            showAdd={true}
            formPath={`${url}/creation`}
        >
            {(loadingData) ?
                <LoadingData /> :
                <>
                    <div className={classes.listContainer}>
                        {groups.map((group, index) => {
                            return (
                                <AlphabeticGroup key={`${index}_${group.name}`} group={group} component={CategoryCard} />
                            );
                        })}
                    </div>
                </>
            }
        </ContentContainer>
    )
}


const useStyles = makeStyles({
    listContainer: {
        display: 'grid',
        gap: 20,
        gridTemplateColumns: "1fr"
    },
    header: {
        borderBottom: '1px solid #eaeaea',
        padding: '10px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
