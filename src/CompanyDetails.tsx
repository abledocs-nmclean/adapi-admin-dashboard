import { useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort } from '@syncfusion/ej2-react-grids';
import { useAuthContext, useQueryWithAuth } from "./auth-context";
import { getCompany, getUsersByCompany } from "./api";
import { Company } from './model';
import './CompanyDetails.css';

type CompanyRouteParams = {id: string};

export default function CompanyDetails() {
    const { id } = useParams<CompanyRouteParams>();
    
    const { user } = useAuthContext();

    const companyQuery = useQueryWithAuth(useQuery(
        ["company", id],
        () => getCompany(user!, id!),
        {
            enabled: user !== null && id !== undefined,
            retry: false
        }
    ));

    const usersQuery = useQueryWithAuth(useQuery(
        ["users", id],
        () => getUsersByCompany(user!, id!),
        {
            enabled: user !== null && id !== undefined,
            retry: false
        }
    ));

    const usersContainerRef = useRef<HTMLElement | null>();

    const initUsersContainer = useCallback(
        (container: HTMLElement | null) => {
            usersContainerRef.current = container;
            if (!container) return;
            createSpinner({
                target: container
            });
        }, []);

    useEffect(() => {
        if (!usersContainerRef.current) return;
        if (companyQuery.isLoading) {
            showSpinner(usersContainerRef.current!);
        } else {
            hideSpinner(usersContainerRef.current!);
        }
    }, [usersQuery.isLoading]);

    return (
        <div>
            <h1>Company Details</h1>
            {companyQuery.isSuccess &&
                <dl>
                    <dt>ID</dt>
                    <dd>{companyQuery.data?.id}</dd>

                    <dt>Name</dt>
                    <dd>{companyQuery.data?.name}</dd>

                    <dt>Trial</dt>
                    <dd>{companyQuery.data?.isTrial ? "yes" : "no"}</dd>

                    <dt>Active</dt>
                    <dd>{companyQuery.data?.isActive ? "yes" : "no"}</dd>

                    <dt>ADO Client ID</dt>
                    <dd>{companyQuery.data?.adoClientId}</dd>
                </dl>
            }

            <h2>Users</h2>
            <div ref={initUsersContainer}>
                <GridComponent dataSource={usersQuery.data} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Username" field="username" />
                        <ColumnDirective headerText="Email" field="email" />
                        <ColumnDirective headerText="Trial" width={100} field="isTrial" />
                        <ColumnDirective headerText="Active" width={100} field="isActive" />
                        <ColumnDirective field="id" />
                    </ColumnsDirective>
                    <Inject services={[Sort]} />
                </GridComponent>
            </div>
        </div>
    );
}