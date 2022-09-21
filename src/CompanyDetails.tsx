import { useParams } from "react-router";
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort, Resize } from '@syncfusion/ej2-react-grids';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { useCompanyQuery, useUsersQuery, useComputedUsers } from "./queries";
import { useErrorMessage, useSpinnerCallback } from "./util";
import './CompanyDetails.css';

type CompanyRouteParams = {id: string};

export default function CompanyDetails() {
    const { id } = useParams<CompanyRouteParams>();

    const companyQuery = useCompanyQuery(id);
    const usersQuery = useUsersQuery(id);
    const users = useComputedUsers(id);

    const usersSpinnerCallback = useSpinnerCallback(usersQuery.isLoading);
    const templatesSpinnerCallback = useSpinnerCallback(companyQuery.isLoading);
    const filesSpinnerCallback = useSpinnerCallback(false/*todo: files query */);

    const companyQueryErrorMessage = useErrorMessage(companyQuery.error);
    const usersQueryErrorMessage =  useErrorMessage(usersQuery.error);

    return (
        <div className="company-details">
            <h1>Company Details</h1>
            {companyQueryErrorMessage &&
                <div className="data-error" role="alert">
                    Problem loading company details:<br />
                    {companyQueryErrorMessage}
                </div>
            }
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
            <div ref={usersSpinnerCallback}>
                {usersQueryErrorMessage &&
                    <div className="data-error" role="alert">
                        Problem loading user list:<br />
                        {usersQueryErrorMessage}
                    </div>
                }
                <GridComponent dataSource={users} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Username" field="username" />
                        <ColumnDirective headerText="Email" field="email" />
                        <ColumnDirective headerText="Trial" autoFit={true} textAlign={"Center"} field="isTrial" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Active" autoFit={true} textAlign={"Center"} field="isActive" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Admin" autoFit={true} textAlign={"Center"} field="isAdmin" displayAsCheckBox={true} />
                        {/* <ColumnDirective field="id" /> */}
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize]} />
                </GridComponent>
            </div>

            <h2>Template policy</h2>
            <div ref={templatesSpinnerCallback}>
                <GridComponent dataSource={companyQuery.data?.templates} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Policy Name" field="name" />
                        <ColumnDirective headerText="Match" field="match" />
                        <ColumnDirective headerText="Language" textAlign={"Center"} autoFit={true} field="lang" />
                        <ColumnDirective headerText="Template Name" />
                        <ColumnDirective headerText="Type" />
                        {/* <ColumnDirective field="commonFileId" /> */}
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize]} />
                </GridComponent>
            </div>

            <h2>Template files</h2>
            <div ref={filesSpinnerCallback}>
            </div>
        </div>
    );
}