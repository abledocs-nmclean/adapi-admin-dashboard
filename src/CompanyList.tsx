import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort } from '@syncfusion/ej2-react-grids';
import { getUser } from './user';
import { getAllCompanies } from './api';
import { Company } from './model';

export default function CompanyList() {
    const user = getUser();

    const companiesQuery = useQuery(
        ["companies"],
        getAllCompanies,
        {
            enabled: user !== null
        }
    );

    return (
        <div>
            <h1>Companies</h1>
            <GridComponent dataSource={companiesQuery.data} allowSorting={true}>
                <ColumnsDirective>
                    <ColumnDirective headerText="Name" field="name" />
                    <ColumnDirective headerText="Active" width={100} field="isActive" />
                    <ColumnDirective headerText="Trial" width={100} field="isTrial"  />
                </ColumnsDirective>
                <Inject services={[Sort]} />
            </GridComponent>
        </div>
    );
}