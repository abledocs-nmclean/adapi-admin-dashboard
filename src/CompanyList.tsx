import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GridComponent, ColumnDirective, ColumnsDirective,
    CommandColumn, CommandModel, CommandClickEventArgs,
    Inject, Sort, Resize} from '@syncfusion/ej2-react-grids';
import { useCompaniesQuery } from "./queries";
import { Company } from './model';
import { useErrorMessage, useSpinnerCallback } from "./util";

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

    return (
        <div>
            <h1>Companies</h1>
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