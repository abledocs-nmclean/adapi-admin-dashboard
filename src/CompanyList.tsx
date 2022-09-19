import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { GridComponent, ColumnDirective, ColumnsDirective,
    CommandColumn, CommandModel, CommandClickEventArgs,
    Inject, Sort, Resize} from '@syncfusion/ej2-react-grids';
import { useCompaniesQuery } from "./queries";
import { Company } from './model';
import { getErrorDisplayMessage, useSpinnerCallback } from "./util";

// add id property to commands for reliable comparison
type CommandWithId = CommandModel & {id: string};

export default function CompanyList() {
    const navigate = useNavigate();

    const [companiesQueryErrorMessage, setCompaniesQueryErrorMessage] = useState<string | null>(null);

    const companiesQuery = useCompaniesQuery();

    const companiesSpinnerCallback = useSpinnerCallback(companiesQuery.isLoading);

    useEffect(() => {
        updateErrorMessage();

        async function updateErrorMessage() {
            if (companiesQuery.error) {
                const message = await getErrorDisplayMessage(companiesQuery.error);
                setCompaniesQueryErrorMessage(message);
            } else {
                setCompaniesQueryErrorMessage(null);
            }
        }
    }, [companiesQuery.error]);
   
    const commands: CommandWithId[] = useMemo(() => ([
        {
            id: "LOAD",
            buttonOption: { content: "Load" },
        }
    ]), []);

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
                    </div>}
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