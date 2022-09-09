import React from 'react';
import { AuthenticatedUser } from './api';

export default function Dashboard() {
    const user: AuthenticatedUser = JSON.parse(localStorage.getItem("user")!);

    return (
        <>
            User "{user.username}" logged in.
        </>
    );
}