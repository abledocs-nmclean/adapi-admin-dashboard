import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, Routes, Route, useParams} from 'react-router-dom';
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

    // function handleCompanyAddOpen(e: React.MouseEvent) {
    //     navigate("add");
    // }

    // function handleCompanyAddSuccess(company: Company) {
    //     navigate("..");
    // }

    // function handleCompanyAddCancel() {
    //     navigate("..");
    // }

    function handleGridActionBegin(args: GridActionEventArgs) {
        console.log("Begin ", args);
    }

    function handleGridActionComplete(args: GridActionEventArgs) {
        console.log("Complete ", args.requestType, args);
        if (args.requestType === "refresh") {
            if (params.dialog === "Add") {
                // We are on the "add" route - open Add dialog on page load
                gridRef.current!.addRecord();
            } else if (params.dialog === "Edit") {
                const rowIndex = gridRef.current!.getRowIndexByPrimaryKey(routeParams.id!);
                gridRef.current!.selectRow(rowIndex);
                gridRef.current!.startEdit();
            }
        } else if (args.requestType === "add" || args.requestType === "beginEdit") {
            const editArgs = args as DialogEditEventArgs;
            const company = editArgs.rowData! as Company;
            editArgs.dialog!.header = args.requestType === "beginEdit" ? `${company.name}` : "Add Company";
            if (args.requestType === "add") {
                // Add dialog has opened
                // If we are not on the "add" route already, navigate there
                if (params.dialog !== "Add") {
                    navigate("add");
                }
            } else {
                // Edit dialog has opened
                if (params.dialog !== "Edit") {
                    navigate(`edit/${company.id}`);
                }
            }
        } else if (args.requestType === "save") {
            navigate("..");
        } else if (args.requestType === "cancel") {
            navigate("..");
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
                            allowEditing: true, mode: "Dialog",
                            // template: (props: {}) => (),
                            allowAdding: true, allowDeleting: false
                        }}
                        actionBegin={handleGridActionBegin}
                        actionComplete={handleGridActionComplete}
                        toolbar={[ToolbarItem.Add]}>
                    <ColumnsDirective>
                        <ColumnDirective field="id" isPrimaryKey={true} visible={false} />
                        <ColumnDirective headerText="Name" field="name" />
                        <ColumnDirective headerText="Active" textAlign={"Center"} autoFit={true} field="isActive" displayAsCheckBox={true} />
                        <ColumnDirective headerText="ado id" field="adoClientId" editType="numericedit" />
                        <ColumnDirective headerText="Trial" textAlign={"Center"} autoFit={true} field="isTrial" displayAsCheckBox={true} />
                        <ColumnDirective /* autoFit={true} not working? */ width={150} commands={commands as CommandModel[]} />
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize, CommandColumn, Edit, Toolbar]} />
                </GridComponent>
            </div>
        </div>
    );
}