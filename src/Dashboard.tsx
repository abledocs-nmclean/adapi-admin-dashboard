import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from './user';
import CompanyList from './CompanyList';
import './Dashboard.css';

export default function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    const user = getUser();

    if (user === null) {
        return <Navigate to="/login" replace />;
    }

    return (<>
        User "{user.username}" logged in.
        <CompanyList />
    </>);
}