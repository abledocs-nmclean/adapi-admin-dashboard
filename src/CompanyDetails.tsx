import { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort } from '@syncfusion/ej2-react-grids';
import { useAuthContext, useQueryWithAuth } from "./auth-context";
import { getCompany, getUsersByCompany } from "./api";
import { Company, User } from './model';
import { useSpinnerEffect } from "./util";
import './CompanyDetails.css';

type CompanyRouteParams = {id: string};

// add isAdmin to the User type returned from the API
type UserWithAdmin = User & { isAdmin: boolean };

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

    const users: User[] | UserWithAdmin[] | undefined = useMemo(() => {
        if (usersQuery.isSuccess) {
            if (companyQuery.isSuccess) {
                // when the company data is available, use "adminUserIds" to populate each user's "isAdmin"
                return usersQuery.data.map((userData) => {
                    return {
                        ...userData,
                        isAdmin: companyQuery.data.adminUserIds.includes(userData.id)
                    };
                });
            }
            // when only user data is available, use the original data
            return usersQuery.data;
        }
    }, [companyQuery.isSuccess, usersQuery.isSuccess]);

    const usersContainerRef = useRef<HTMLElement | null>(null);

    useSpinnerEffect(usersContainerRef, usersQuery.isLoading);

    const templatesContainerRef = useRef<HTMLElement | null>(null);

    useSpinnerEffect(templatesContainerRef, companyQuery.isLoading);

    const filesContainerRef = useRef<HTMLElement | null>(null);

    useSpinnerEffect(filesContainerRef, false);

    return (
        <div>
            <h1>Company Details</h1>
            {companyQuery.isSuccess &&
                <dl>
                    <dt>ID</dt>
                    <dd>{companyQuery.data.id}</dd>

                    <dt>Name</dt>
                    <dd>{companyQuery.data.name}</dd>

                    <dt>Trial</dt>
                    <dd>{companyQuery.data.isTrial ? "yes" : "no"}</dd>

                    <dt>Active</dt>
                    <dd>{companyQuery.data.isActive ? "yes" : "no"}</dd>

                    <dt>ADO Client ID</dt>
                    <dd>{companyQuery.data.adoClientId}</dd>
                </dl>
            }

            <h2>Users</h2>
            <div ref={(div) => {
                usersContainerRef.current = div;
                if (div) createSpinner({target: div});
            }}>
                <GridComponent dataSource={users} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Username" field="username" />
                        <ColumnDirective headerText="Email" field="email" />
                        <ColumnDirective headerText="Trial" width={100} field="isTrial" />
                        <ColumnDirective headerText="Active" width={100} field="isActive" />
                        <ColumnDirective headerText="Admin" width={100} field="isAdmin" />
                        <ColumnDirective field="id" />
                    </ColumnsDirective>
                    <Inject services={[Sort]} />
                </GridComponent>
            </div>

            <h2>Template policy</h2>
            <div ref={(div) => {
                templatesContainerRef.current = div;
                if (div) createSpinner({target: div});
            }}>
                <GridComponent dataSource={companyQuery.data?.templates} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Template Name" field="name" />
                        <ColumnDirective headerText="Match" field="match" />
                        <ColumnDirective field="commonFileId" />
                    </ColumnsDirective>
                    <Inject services={[Sort]} />
                </GridComponent>
            </div>

            <h2>Template files</h2>
            <div ref={(div) => {
                filesContainerRef.current = div;
                if (div) createSpinner({target: div});
            }}>

            </div>
        </div>
    );
}