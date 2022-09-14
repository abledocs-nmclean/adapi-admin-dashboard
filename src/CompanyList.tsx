import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort } from '@syncfusion/ej2-react-grids';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { useAuthContext, useQueryWithAuth } from './auth-context';
import { getAllCompanies } from './api';
import { Company } from './model';

export default function CompanyList() {
    const { user } = useAuthContext();

    const companiesQuery = useQueryWithAuth(useQuery(
        ["companies"],
        () => getAllCompanies(user!),
        {
            enabled: user !== null,
            retry: false
        }
    ));

    let container: HTMLElement;

    const containerRef = useCallback(
        (c: HTMLElement | null) => {
            if (c === null) return;
            container = c;
            createSpinner({
                target: container
            });
        }, []);

    useEffect(() => {
        if (companiesQuery.isLoading) {
            showSpinner(container);
        } else {
            hideSpinner(container);
        }
    }, [companiesQuery.isLoading]);

    return (
        <div>
            <h1>Companies</h1>
            <div ref={containerRef}>
                <GridComponent dataSource={companiesQuery.data} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Name" field="name" />
                        <ColumnDirective headerText="Active" width={100} field="isActive" />
                        <ColumnDirective headerText="Trial" width={100} field="isTrial"  />
                    </ColumnsDirective>
                    <Inject services={[Sort]} />
                </GridComponent>
            </div>
        </div>
    );
}