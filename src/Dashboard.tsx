import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './auth-context';
import CompanyList from './CompanyList';
import './Dashboard.css';

export default function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    const { user } = useAuthContext();

    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/login");
        }
    }, [user]);

    if (user === null) {
        return <></>;
    }

    return (<>
        User "{user.username}" logged in.
        <CompanyList />
    </>);
}