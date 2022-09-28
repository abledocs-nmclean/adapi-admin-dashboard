import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
        GridComponent, ColumnDirective, ColumnsDirective,
        CommandColumn, CommandModel, CommandClickEventArgs,
        Inject, Sort, Resize, Edit, Toolbar, ToolbarItem,
        GridActionEventArgs, SaveEventArgs, DialogEditEventArgs
    } from '@syncfusion/ej2-react-grids';
import {
        Company, CreateCompanyRequest, UpdateCompanyRequest,
        useCompaniesQuery, useCompanyAddMutation, useCompanyEditMutation, useErrorMessage, useSpinnerCallback
    } from "../common";
import { CompanyEdit, EditModel } from '../dialogs';
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

    const companyAddMutation = useCompanyAddMutation();
    const companyEditMutation = useCompanyEditMutation();

    const companiesQueryErrorMessage = useErrorMessage(companiesQuery.error);
    const companyAddErrorMessage = useErrorMessage(companyAddMutation.error);
    const companyEditErrorMessage = useErrorMessage(companyEditMutation.error);

    const companiesSpinnerCallback = useSpinnerCallback(
        companiesQuery.isLoading || companyAddMutation.isLoading || companyEditMutation.isLoading);
  
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
        if (args.requestType === "save") {
            const saveArgs = args as SaveEventArgs;
            const editModel = saveArgs.data as EditModel<Company>;
            const isValid = editModel.adoClientId !== undefined && editModel.name?.length;
            if (!isValid) {
                args.cancel = true;
                return;
            }

            if (saveArgs.action === "add") {
                // On adding, we close the edit dialog and cancel the event here, to prevent the grid from adding
                // a record locally. The data source will update automatically after the new company record is
                // returned from the server. If we don't cancel here, we would end up with a duplicate grid item
                // for the new record. The local record would also be missing the ID returned from the server.
                saveArgs.cancel = true;
                gridRef.current!.closeEdit();
                companyAddMutation.mutate(editModel as CreateCompanyRequest);
            } else {
                // After edit, the grid row will be updated locally immediately. After the update response is returned
                // from the server, the data will refresh (however it should be the identical to the local update).
                companyEditMutation.mutate({id: editModel.id!, request: editModel as UpdateCompanyRequest});
            }
        }
    }

    const handleGridActionComplete = (args: GridActionEventArgs) => {
        if (args.requestType === "refresh") {
            // todo: load /add and /edit urls
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
            <div ref={companiesSpinnerCallback}>
                {companiesQueryErrorMessage &&
                    <div className="data-error" role="alert">
                        Problem loading company list:<br />
                        {companiesQueryErrorMessage}
                    </div>}
                {companyAddErrorMessage &&
                    <div className="data-error" role="alert">
                        Problem adding company:<br />
                        {companyAddErrorMessage}
                    </div>
                }
                {companyEditErrorMessage &&
                    <div className="data-error" role="alert">
                        Problem editing company:<br />
                        {companyEditErrorMessage}
                    </div>
                }

                <GridComponent ref={gridRef} dataSource={companiesQuery.data}
                        enableStickyHeader={true}
                        allowSorting={true}
                        editSettings={{
                            allowEditing: true, allowEditOnDblClick: false,
                            allowAdding: true, allowDeleting: false,
                            mode: "Dialog", template: CompanyEdit
                        }}
                        toolbar={[ToolbarItem.Add]}
                        commandClick={handleGridCommand}
                        actionBegin={handleGridActionBegin}
                        actionComplete={handleGridActionComplete}>
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