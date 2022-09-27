import { useRef, useState } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { GridComponent, ColumnDirective, ColumnsDirective,
    CommandColumn, CommandModel, CommandClickEventArgs,
    Inject, Sort, Resize, Edit, Toolbar, ToolbarItem, DialogEditEventArgs, GridActionEventArgs} from '@syncfusion/ej2-react-grids';
import { useCompaniesQuery } from "./queries";
import { useErrorMessage, useSpinnerCallback } from "./util";
import { Company } from './model';
import CompanyEdit from './CompanyEdit';
import './CompanyList.css';

// add custom command types to command model
type CustomCommandModel = CommandModel | {type: "Load"};

export type CompanyListParams = {dialog?: DialogMode};
export type DialogMode = "Add" | "Edit"

export type CompanyListRouteParams = {id?: string};

export default function CompanyList(params: CompanyListParams) {
    // const location = useLocation();
    const navigate = useNavigate();
    const routeParams = useParams<CompanyListRouteParams>();

    const companiesQuery = useCompaniesQuery();

    const companiesSpinnerCallback = useSpinnerCallback(companiesQuery.isLoading);

    const companiesQueryErrorMessage = useErrorMessage(companiesQuery.error);
  
    const [commands] = useState<CustomCommandModel[]>(() => [
        {
            type: "Edit",
            buttonOption: {
                iconCss: "e-icons e-edit",
                cssClass: "e-flat"
            }
        },
        {
            type: "Load",
            buttonOption: {
                content: "Load"
            }
        }
    ]);

    const gridRef = useRef<GridComponent>(null);

    function handleGridCommand(e: CommandClickEventArgs) {
        const command = e.commandColumn as CustomCommandModel | undefined;
        switch (command?.type) {
            case "Load":
                const company = e.rowData as Company;
                navigate(`company/${company.id}`);
                break;
        }
    }

    function handleGridActionBegin(args: GridActionEventArgs) {
        console.log("Begin ", args);
        if (args.requestType === "save") {
          console.log("save");
        }
    }

    const handleGridActionComplete = (args: GridActionEventArgs) => {
        console.log("Complete ", args.requestType, args);
        if (args.requestType === "refresh") {
            // todo: manage /add and /edit urls
            // if (params.dialog === "Add") {
            //     gridRef.current!.addRecord();
            // } else if (params.dialog === "Edit") {
            //     const rowIndex = gridRef.current!.getRowIndexByPrimaryKey(routeParams.id!);
            //     gridRef.current!.selectRow(rowIndex);
            //     gridRef.current!.startEdit();
            // }
        } else if (args.requestType === "add" || args.requestType === "beginEdit") {
            const editArgs = args as DialogEditEventArgs;
            const company = editArgs.rowData! as Company;
            editArgs.dialog!.header = args.requestType === "beginEdit" ? `${company.name}` : "Add Company";
            // todo: add and edit urls - navigate() is not working as expected because current location can be out of date
            // if (args.requestType === "add") {
            //     if (params.dialog !== "Add") {
            //         navigate("add");
            //     }
            // } else {
            //     if (params.dialog !== "Edit") {
            //         navigate(`edit/${company.id}`);
            //     }
            // }
        } else if (args.requestType === "save") {
            // if (params.dialog) {
            //     navigate("..");
            // }
        } else if (args.requestType === "cancel") {
            // if (params.dialog) {
            //     navigate("..");
            // }
        }
    }

    return (
        <div className="company-list">
            {/* <Routes>
                <Route path="add" element={<CompanyEdit onSuccess={handleCompanyAddSuccess} onCancel={handleCompanyAddCancel} />} />
            </Routes> */}
            <h1>Companies</h1>
            {/* <ButtonComponent className="add-button" iconCss="e-icons e-circle-add" onClick={handleCompanyAddOpen}>Add Company</ButtonComponent> */}
            <div ref={companiesSpinnerCallback}>
                {companiesQueryErrorMessage &&
                    <div className="data-error" role="alert">
                        Problem loading company list:<br />
                        {companiesQueryErrorMessage}
                    </div>
                }

                <GridComponent dataSource={companiesQuery.data} commandClick={handleGridCommand} ref={gridRef}
                        enableStickyHeader={true}
                        allowSorting={true}
                        editSettings={{
                            allowEditing: true, mode: "Dialog", allowEditOnDblClick: false,
                            template: (data?: Company) => (<CompanyEdit company={data} />),
                            allowAdding: true, allowDeleting: false
                        }}
                        actionBegin={handleGridActionBegin}
                        actionComplete={handleGridActionComplete}
                        toolbar={[ToolbarItem.Add]}>
                    <ColumnsDirective>
                        <ColumnDirective field="id" isPrimaryKey={true} visible={false} />
                        <ColumnDirective headerText="Name" field="name" />
                        <ColumnDirective headerText="Active" textAlign={"Center"} autoFit={true} field="isActive" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Trial" textAlign={"Center"} autoFit={true} field="isTrial" displayAsCheckBox={true} />
                        <ColumnDirective /* autoFit={true} not working? */ width={150} commands={commands as CommandModel[]} />
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize, CommandColumn, Edit, Toolbar]} />
                </GridComponent>
            </div>
        </div>
    );
}