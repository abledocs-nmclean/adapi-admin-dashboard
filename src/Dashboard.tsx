import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './auth-context';
import CompanyList from './CompanyList';
import CompanyDetails from './CompanyDetails';
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
    }, [user, navigate]);

    if (user === null) {
        return <></>;
    }

    return (
        <div className="dashboard">
            User "{user.username}" logged in.
            <Routes>
                <Route index element={<CompanyList />} />
                <Route path="company/:id" element={<CompanyDetails />} />
            </Routes>
        </div>
    );
}