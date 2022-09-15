import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { createSpinner } from '@syncfusion/ej2-popups';
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort } from '@syncfusion/ej2-react-grids';
import { useAuthContext } from "./auth-context";
import { useCompanyQuery, useUsersQuery, useComputedUsers } from "./queries";
import { Company, User } from './model';
import { useSpinnerEffect } from "./util";
import './CompanyDetails.css';

type CompanyRouteParams = {id: string};

export default function CompanyDetails() {
    const { id } = useParams<CompanyRouteParams>();
    
    const { user } = useAuthContext();

    const companyQuery = useCompanyQuery(user, id);    
    const usersQuery = useUsersQuery(user, id);
    const users = useComputedUsers(companyQuery, usersQuery);

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