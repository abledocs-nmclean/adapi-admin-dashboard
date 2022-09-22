import React, { useMemo, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { GridComponent, ColumnDirective, ColumnsDirective,
    CommandColumn, CommandModel, CommandClickEventArgs,
    Inject, Sort, Resize} from '@syncfusion/ej2-react-grids';
import { useCompaniesQuery } from "./queries";
import { useErrorMessage, useSpinnerCallback } from "./util";
import { Company } from './model';
import CompanyEdit from './CompanyEdit';

// add id property to commands for reliable comparison
type CommandWithId = CommandModel & {id: string};

export default function CompanyList() {
    const navigate = useNavigate();

    const companiesQuery = useCompaniesQuery();

    const companiesSpinnerCallback = useSpinnerCallback(companiesQuery.isLoading);

    const companiesQueryErrorMessage = useErrorMessage(companiesQuery.error);
  
    const [commands] = useState<CommandWithId[]>(() => [
        {
            id: "LOAD",
            buttonOption: { content: "Load" }
        }
    ]);

    function handleGridCommand(e: CommandClickEventArgs) {
        const command = e.commandColumn as CommandWithId | undefined;
        switch (command?.id) {
            case "LOAD":
                const company = e.rowData as Company;
                navigate(`company/${company.id}`);
                break;
        }
    }

    function handleCompanyAddOpen(e: React.MouseEvent) {
        navigate("add");
    }

    function handleCompanyAddSuccess(company: Company) {
        navigate("..");
    }

    return (
        <div>
            <Routes>
                <Route path="add" element={<CompanyEdit onSuccess={handleCompanyAddSuccess} />} />
            </Routes>
            <h1>Companies</h1>
            <ButtonComponent onClick={handleCompanyAddOpen}>add</ButtonComponent>
            <div ref={companiesSpinnerCallback}>
                {companiesQueryErrorMessage &&
                    <div className="data-error" role="alert">
                        Problem loading company list:<br />
                        {companiesQueryErrorMessage}
                    </div>
                }
                <GridComponent dataSource={companiesQuery.data} commandClick={handleGridCommand} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Name" field="name" />
                        <ColumnDirective headerText="Active" textAlign={"Center"} autoFit={true} field="isActive" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Trial" textAlign={"Center"} autoFit={true} field="isTrial" displayAsCheckBox={true} />
                        {/* <ColumnDirective field="id" /> */}
                        <ColumnDirective /* autoFit={true} not working? */ width={110} commands={commands} />
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize, CommandColumn]} />
                </GridComponent>
            </div>
        </div>
    );
}