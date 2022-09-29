import React from "react";
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, InputEventArgs } from '@syncfusion/ej2-react-inputs';
import { User } from "../common";
import { EditForm, EditModel } from  "./common";
import './UserEdit.css'

export default class UserEdit extends EditForm<User> {
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

                {/* <TextBoxComponent type="number" placeholder="ADO Client ID" cssClass="e-outline" floatLabelType="Auto"
                    name="adoClientId" value={`${this.state.adoClientId ?? ""}`}
                    input={({value}: InputEventArgs) => this.setState({adoClientId: value ? parseInt(value) : undefined})} />
        */}

               <div className="checkboxes">
                    <CheckBoxComponent label="Active" labelPosition={"Before"}
                        name="isActive" checked={this.state.isActive}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({isActive: e.target.checked})} />
                    <CheckBoxComponent label="Trial" labelPosition={"Before"}
                        name="isTrial" checked={this.state.isTrial}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({isTrial: e.target.checked})} />
                </div>
            </div>
        );
    }
}

