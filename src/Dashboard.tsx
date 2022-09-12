import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from './user';

export default function Dashboard() {
    const user = getUser();
    if (user === null) {
        return <Navigate to="/" replace />;
    }

    return <>User "{user.username}" logged in.</>;
}