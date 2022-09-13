import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GridComponent, ColumnDirective, ColumnsDirective, DataResult, Inject, Page, Sort, Filter, Group } from '@syncfusion/ej2-react-grids';
import { getUser } from './user';
import { getAllCompanies } from './api';
import { Company } from './model';
import './Dashboard.css';

export default function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    const navigate = useNavigate();

    const user = getUser();

    const companiesQuery = useQuery(
        ["companies"],
        loadCompanies,
        {
            enabled: user !== null
        });

    if (user === null) {
        return <Navigate to="/login" replace />;
    }

    async function loadCompanies() {
        let response: Response | undefined;
        try {
            response = await getAllCompanies();
        } catch {
            return [];
        }

        if (response.status == 401) {
            navigate("/login");
            // return [];
        }

        if (response.ok) {
            return await response.json() as Company[];            
        }

        return [];
    }

    return (<>
        User "{user.username}" logged in.
        {/* <ul>
            {companies.map(company => <li>{company.name}</li>)}
        </ul> */}
    </>);
}