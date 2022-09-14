import { useState, useCallback, useEffect, useRef } from 'react';
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

    const containerRef = useRef<HTMLElement | null>();

    const initContainer = useCallback(
        (container: HTMLElement | null) => {
            containerRef.current = container;
            if (!container) return;
            createSpinner({
                target: container
            });
        }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        if (companiesQuery.isLoading) {
            showSpinner(containerRef.current);
        } else {
            hideSpinner(containerRef.current);
        }
    }, [companiesQuery.isLoading]);

    return (
        <div>
            <h1>Companies</h1>
            <div ref={initContainer}>
                <GridComponent dataSource={companiesQuery.data} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Name" field="name" />
                        <ColumnDirective headerText="Active" width={100} field="isActive" />
                        <ColumnDirective headerText="Trial" width={100} field="isTrial"  />
                        <ColumnDirective field="id" />
                    </ColumnsDirective>
                    <Inject services={[Sort]} />
                </GridComponent>
            </div>
        </div>
    );
}