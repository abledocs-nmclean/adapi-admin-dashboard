import React, { useRef, useState } from "react";
import { useParams } from "react-router";
import {
        GridComponent, ColumnDirective, ColumnsDirective, CommandModel, ToolbarItem,
        Inject, Sort, Resize, CommandColumn, Edit, Toolbar,
        GridActionEventArgs, SaveEventArgs, DialogEditEventArgs
    } from '@syncfusion/ej2-react-grids';
import { CheckBoxComponent, ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import {
        UpdateCompanyRequest, useCompanyEditMutation,
        useCompanyQuery, useUsersQuery, useComputedUsers,
        User, CreateUserRequest, UpdateUserRequest, useUserAddMutation, useUserEditMutation,
        useErrorMessage, useSpinnerCallback
    } from "../common";
import { CompanyEdit, UserEdit, EditModel } from "../dialogs";
import './CompanyDetails.css';

export type CompanyRouteParams = {id: string};

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

    const companyEditMutation = useCompanyEditMutation();
    const userAddMutation = useUserAddMutation();
    const userEditMutation = useUserEditMutation();

    const [detailEditOpen, setDetailEditOpen] = useState(false);

    const detailEditFormRef = useRef<CompanyEdit>(null);

    async function handleDetailSave() {
        const editModel = detailEditFormRef.current!.state;
        await companyEditMutation.mutateAsync(editModel as UpdateCompanyRequest);
        setDetailEditOpen(false);
    }

    const usersGridRef = useRef<GridComponent>(null);

    const [userCommands] = useState<CommandModel[]>(() => [
        {
            type: "Edit",
            buttonOption: {
                iconCss: "e-icons e-edit",
                cssClass: "e-flat"
            }
        }
    ]);

    const userEditFormRef = useRef<UserEdit>(null);

    function handleUserGridActionBegin(args: GridActionEventArgs) {
        if (args.requestType === "save") {
            const editState = userEditFormRef.current!.state;
            const saveArgs = args as SaveEventArgs;
            const isValid = Boolean(
                editState.username?.length
                && (!editState.isAdd || (editState.password?.length && editState.secondaryPassword?.length)));
            if (!isValid) {
                args.cancel = true;
                return;
            }

            if (saveArgs.action === "add") {
                saveArgs.cancel = true;
                usersGridRef.current!.closeEdit();
                userAddMutation.mutate({...editState, companyId: id} as CreateUserRequest);
            } else {
                userEditMutation.mutate(editState as UpdateUserRequest);
            }
        }
    }

    const handleUserGridActionComplete = (args: GridActionEventArgs) => {
        if (args.requestType === "add" || args.requestType === "beginEdit") {
            const editArgs = args as DialogEditEventArgs;
            const user = editArgs.rowData! as User;
            editArgs.dialog!.header = args.requestType === "beginEdit" ? `${user.username}` : "Add User";
        }
    }

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
                <div>
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

                    <ButtonComponent onClick={() => setDetailEditOpen(true)}>Edit Details</ButtonComponent>
                    {detailEditOpen &&
                        <DialogComponent header="Edit Details" isModal={true} width={500}
                                showCloseIcon={true} close={() => setDetailEditOpen(false)}
                                buttons={[
                                    {
                                        buttonModel: {
                                            content: "Save",
                                            isPrimary: true,
                                            iconCss: "e-icons e-check",
                                            disabled: companyEditMutation.isLoading
                                        },
                                        type: "submit",
                                        click: handleDetailSave
                                    }
                                ]}>
                            <CompanyEdit ref={detailEditFormRef} {...companyQuery.data} />
                        </DialogComponent>
                    }
                </div>
            }

            <h2>Users</h2>
            <div ref={usersSpinnerCallback}>
                {usersQueryErrorMessage &&
                    <div className="data-error" role="alert">
                        Problem loading user list:<br />
                        {usersQueryErrorMessage}
                    </div>
                }
                <GridComponent ref={usersGridRef} dataSource={users}
                        enableStickyHeader={true}
                        allowSorting={true}
                        editSettings={{
                            allowEditing: true, allowEditOnDblClick: false,
                            allowAdding: true, allowDeleting: false,
                            mode: "Dialog", template: (params: EditModel<User>) => <UserEdit ref={userEditFormRef} {...params} />
                        }}
                        toolbar={[ToolbarItem.Add]}
                        actionBegin={handleUserGridActionBegin}
                        actionComplete={handleUserGridActionComplete}>
                    <ColumnsDirective>
                        <ColumnDirective field="id" isPrimaryKey={true} visible={false} />
                        <ColumnDirective headerText="Username" field="username" />
                        <ColumnDirective headerText="Email" field="email" />
                        <ColumnDirective headerText="Trial" autoFit={true} textAlign={"Center"} field="isTrial" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Active" autoFit={true} textAlign={"Center"} field="isActive" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Admin" autoFit={true} textAlign={"Center"} field="isAdmin" displayAsCheckBox={true} />
                        <ColumnDirective /* autoFit={true} not working? */ width={150} commands={userCommands} />
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize, CommandColumn, Edit, Toolbar]} />
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