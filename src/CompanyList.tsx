import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort } from '@syncfusion/ej2-react-grids';
import { useAuthContext, useQueryWithAuth } from './auth-context';
import { getAllCompanies } from './api';
import { Company } from './model';
import { useSpinnerEffect } from "./util";

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

    const companiesContainerRef = useRef<HTMLElement | null>(null);

    useSpinnerEffect(companiesContainerRef, companiesQuery.isLoading);

    return (
        <div>
            <h1>Companies</h1>
            <div ref={(div) => {
                companiesContainerRef.current = div;
                if (div) createSpinner({target: div});
            }}>
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