import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GridComponent, ColumnDirective, ColumnsDirective, DataResult, Inject, Page, Sort, Filter, Group } from '@syncfusion/ej2-react-grids';
import { getUser, clearUser } from './user';
import { getAllCompanies } from './api';
import { Company } from './model';
import './Dashboard.css';

export default function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

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
        const response = await getAllCompanies();

        if (!response.ok) {
            if (response.status == 401) {
                clearUser();
            }
            throw new Error(response.statusText);
        }

        return await response.json() as Company[];            
    }

    return (<>
        User "{user.username}" logged in.
        <h1>Companies</h1>
        <GridComponent dataSource={companiesQuery.data}>
            <ColumnsDirective>
                <ColumnDirective headerText="Name" field="name" />
                <ColumnDirective headerText="Active" width={100} field="isActive" />
                <ColumnDirective headerText="Trial" width={100} field="isTrial"  />
            </ColumnsDirective>
        </GridComponent>
    </>);
}