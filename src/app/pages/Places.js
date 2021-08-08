import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { ContentContainer } from '../components';

import { LoadingData, AlphabeticGroup, PlaceCard, PlaceList } from '../components';

import { getPlaces, getLoadingData, selectAll } from '../redux/slices/places';
import { useCreateGroupsFromData } from '../customeFunctions/helpers';

export default function Places() {
    const { url } = useRouteMatch();
    const filter = 'default';
    const places = useSelector(selectAll);
    const loadingData = useSelector(getLoadingData);

    const groups = useCreateGroupsFromData(places);

    const dispatch = useDispatch();
    useEffect(() => {
        if (places.length === 0) {
            dispatch(getPlaces());
        }
    }, [dispatch, places]);

    return (
        <ContentContainer
            title="Places"
            showAdd={true}
            formPath={`${url}/creation`}
        >
            {loadingData ?
                <LoadingData /> :
                <div style={{ marginTop: 20 }}>
                    {filter === 'a-z' &&
                        groups.map((group, index) => (
                            <AlphabeticGroup key={`${group.name}_${index}`} group={group} component={PlaceCard} />
                        ))
                    }
                    {filter === 'default' &&
                        <PlaceList places={places} />
                    }
                </div>
            }
        </ContentContainer>
    )
}
