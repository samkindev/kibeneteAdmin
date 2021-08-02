import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default function loadingData({ size }) {
    return (
        <div style={{ height: "calc(100vh / 2)", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={size} />
        </div>
    )
}
