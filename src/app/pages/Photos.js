import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ContentContainer } from '../components';

import { LoadingData, PhotoGallery } from '../components';
import { getLoadingDataState, getPhotos, selectAll } from '../redux/slices/photos';

export default function Photos() {
    const { url } = useRouteMatch();
    const loadingData = useSelector(getLoadingDataState);
    const photos = useSelector(selectAll);

    const dispatch = useDispatch();
    useEffect(() => {
        if (photos.length === 0) {
            dispatch(getPhotos());
        }
    }, [dispatch, photos]);

    return (
        <ContentContainer
            title="Photos"
            showAdd={false}
            formPath={`${url}/creation`}
        >
            {loadingData ?
                <LoadingData /> :
                <PhotoGallery photos={photos} />
            }
        </ContentContainer>
    )
}

