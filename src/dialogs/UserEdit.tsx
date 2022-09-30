import React from "react";
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, InputEventArgs } from '@syncfusion/ej2-react-inputs';
import { User, CreateUserRequest, UpdateUserRequest } from "../common";
import { EditForm, EditModel } from  "./common";
import './common.css'

export default class UserEdit extends EditForm<User, CreateUserRequest | UpdateUserRequest> {
    constructor(props: EditModel<User>) {
        super(props, {isActive: true});
    }

    override render() {
        return (
            <div className="edit-form">
                <TextBoxComponent placeholder="Name" cssClass="e-outline" floatLabelType="Auto"
                    disabled={!this.state.isAdd}
                    name="name" value={this.state.username}
                    input={({value}: InputEventArgs) => this.setState({username: value})} />

                <TextBoxComponent placeholder="Email" cssClass="e-outline" floatLabelType="Auto"
                    name="email" value={this.state.email}
                    input={({value}: InputEventArgs) => this.setState({email: value})} />

                {this.state.isAdd &&
                    <>
                        <TextBoxComponent placeholder="Password" cssClass="e-outline" floatLabelType="Auto"
                            type="password" name="password" value={this.state.password}
                            input={({value}: InputEventArgs) => this.setState({password: value})} />

                        <TextBoxComponent placeholder="Secondary Password" cssClass="e-outline" floatLabelType="Auto"
                            type="password" name="secondaryPassword" value={this.state.secondaryPassword}
                            input={({value}: InputEventArgs) => this.setState({secondaryPassword: value})} />
                    </>}


               <div className="checkboxes">
                    <CheckBoxComponent label="Active" labelPosition={"Before"}
                        name="isActive" checked={this.state.isActive}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({isActive: e.target.checked})} />

                    <CheckBoxComponent label="Trial" labelPosition={"Before"}
                        name="isTrial" checked={this.state.isTrial}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({isTrial: e.target.checked})} />

                    <CheckBoxComponent label="Admin" labelPosition={"Before"}
                        name="isAdmin" checked={this.state.isAdmin}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({isAdmin: e.target.checked})} />
                </div>
            </div>
        );
    }
}

