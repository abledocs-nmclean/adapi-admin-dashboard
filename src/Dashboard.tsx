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

    const { user, authState } = useAuthContext();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (authState !== "LoggedIn") {
            // store current location on navigation so the login page can navigate back here on successful login
            navigate("/login", {state: {previousLocation: location} as LocationState});
        }
    }, [authState, navigate, location]);

    if (authState !== "LoggedIn") {
        return <></>;
    }

    return (
        <div className="dashboard">
            User "{user.username}" logged in.
            <Routes>
                <Route path="*" element={<CompanyList />} />
                <Route path="company/:id" element={<CompanyDetails />} />
            </Routes>
        </div>
    );
}