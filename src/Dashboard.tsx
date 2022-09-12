import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from './user';
import { getAllCompanies } from './api';
import { Company } from './model';

export default function Dashboard() {
    const [companies, setCompanies] = React.useState<Company[]>([]);

    const user = getUser();
    if (user === null) {
        return <Navigate to="/" replace />;
    }

    async function handleClick() {
        let response: Response | undefined;
        try {
            response = await getAllCompanies();
        } catch {
            // todo
        } finally {

        }

        if (response?.ok) {
            setCompanies(await response.json());
        }
    }

    return (<>
        User "{user.username}" logged in.<button onClick={handleClick}>load company list</button>
        <ul>
            {companies.map(company => <li>{company.name}</li>)}
        </ul>
    </>);
}