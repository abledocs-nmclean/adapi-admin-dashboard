import { useNavigate } from 'react-router';
import { GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Sort, Resize, CommandClickEventArgs } from '@syncfusion/ej2-react-grids';
import { useCompaniesQuery } from "./queries";
import { Company } from './model';
import { useSpinnerCallback } from "./util";

export default function CompanyList() {
    const navigate = useNavigate();

    const companiesQuery = useCompaniesQuery();

    const companiesSpinnerCallback = useSpinnerCallback(companiesQuery.isLoading);

    function handleGridCommand(e: CommandClickEventArgs) {
        if (e.commandColumn?.title === "LOAD") {
            const company = e.rowData as Company;
            navigate(`company/${company.id}`);
        }
    }

    return (
        <div>
            <h1>Companies</h1>
            <div ref={companiesSpinnerCallback}>
                <GridComponent dataSource={companiesQuery.data} commandClick={handleGridCommand} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Name" field="name" />
                        <ColumnDirective headerText="Active" textAlign={"Center"} autoFit={true} field="isActive" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Trial" textAlign={"Center"} autoFit={true} field="isTrial" displayAsCheckBox={true} />
                        {/* <ColumnDirective field="id" /> */}
                        <ColumnDirective /* autoFit={true} not working? */ width={110} commands={[{
                            title: "LOAD",
                            buttonOption: { content: "Load" }
                        }]} />
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize, CommandColumn]} />
                </GridComponent>
            </div>
        </div>
    );
}