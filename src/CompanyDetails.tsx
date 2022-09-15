import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { createSpinner } from '@syncfusion/ej2-popups';
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort, Resize } from '@syncfusion/ej2-react-grids';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { useCompanyQuery, useUsersQuery, useComputedUsers } from "./queries";
import { Company, DocumentTemplate, User } from './model';
import { useSpinnerEffect } from "./util";
import './CompanyDetails.css';

type CompanyRouteParams = {id: string};

export default function CompanyDetails() {
    const { id } = useParams<CompanyRouteParams>();

    const companyQuery = useCompanyQuery(id);    
    const usersQuery = useUsersQuery(id);
    const users = useComputedUsers(id);

    const usersContainerRef = useRef<HTMLElement | null>(null);
    useSpinnerEffect(usersContainerRef, usersQuery.isLoading);

    const templatesContainerRef = useRef<HTMLElement | null>(null);
    useSpinnerEffect(templatesContainerRef, companyQuery.isLoading);

    const filesContainerRef = useRef<HTMLElement | null>(null);
    useSpinnerEffect(filesContainerRef, false/* todo: files query */);

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
                    <dd><CheckBoxComponent checked={companyQuery.data.isTrial} disabled={true} /></dd>

                    <dt>Active</dt>
                    <dd><CheckBoxComponent checked={companyQuery.data.isActive} disabled={true} /></dd>

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
                        <ColumnDirective headerText="Trial" autoFit={true} field="isTrial" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Active" autoFit={true} field="isActive" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Admin" autoFit={true} field="isAdmin" displayAsCheckBox={true} />
                        {/* <ColumnDirective field="id" /> */}
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize]} />
                </GridComponent>
            </div>

            <h2>Template policy</h2>
            <div ref={(div) => {
                templatesContainerRef.current = div;
                if (div) createSpinner({target: div});
            }}>
                <GridComponent dataSource={companyQuery.data?.templates} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Policy Name" field="name" />
                        <ColumnDirective headerText="Match" field="match" />
                        <ColumnDirective headerText="Language" autoFit={true} field="lang" />
                        <ColumnDirective headerText="Template Name" />
                        <ColumnDirective headerText="Type" />
                        {/* <ColumnDirective field="commonFileId" /> */}
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize]} />
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