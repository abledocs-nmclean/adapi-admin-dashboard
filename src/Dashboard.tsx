import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getUser } from './user';
import { getAllCompanies } from './api';
import { Company } from './model';

export default function Dashboard() {
    const navigate = useNavigate();

    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => { loadCompanies().catch(console.error); }, []);

    const user = getUser();
    if (user === null) {
        return <Navigate to="/login" replace />;
    }

    async function loadCompanies() {
        let response: Response | undefined;
        try {
            response = await getAllCompanies();
        } catch {
            // todo
            return;
        }

        if (response.status == 401) {
            return navigate("/login");
        }

        if (response.ok) {
            setCompanies(await response.json());
        } else {
            // todo
        }
    }

    return (<>
        User "{user.username}" logged in.
        <ul>
            {companies.map(company => <li>{company.name}</li>)}
        </ul>
    </>);
}