import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthenticatedUser } from './api';

export default function Dashboard() {
    const userItem = localStorage.getItem("user");
    if (userItem === null) {
        return <Navigate to="/" replace />;
    }

    const user: AuthenticatedUser = JSON.parse(userItem);

    return <>User "{user.username}" logged in.</>;
}