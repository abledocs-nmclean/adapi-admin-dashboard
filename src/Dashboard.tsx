import { useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuthContext } from './auth-context';
import { LocationState } from './location';
import CompanyList from './CompanyList';
import CompanyDetails from './CompanyDetails';
import './Dashboard.css';

export default function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    const { user } = useAuthContext();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user === null) {
            navigate("/login", {state: {from: location} as LocationState});
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