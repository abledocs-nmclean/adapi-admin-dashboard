import React from "react";
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, InputEventArgs } from '@syncfusion/ej2-react-inputs';
import { Company } from "../common";
import { EditForm, EditModel } from  "./common";
import './CompanyEdit.css'

export default class CompanyEdit extends EditForm<Company> {
    constructor(props: EditModel<Company>) {
        super(props, {isActive: true, adoClientId: 0});
    }

    override render() {
        return (
            <div className="company-edit">
                <TextBoxComponent placeholder="Name" cssClass="e-outline" floatLabelType="Auto"
                    disabled={!this.state.isAdd}
                    name="name" value={this.state.name}
                    input={({value}: InputEventArgs) => this.setState({name: value})} />

                <TextBoxComponent type="number" placeholder="ADO Client ID" cssClass="e-outline" floatLabelType="Auto"
                    name="adoClientId" value={`${this.state.adoClientId ?? ""}`}
                    input={({value}: InputEventArgs) => this.setState({adoClientId: value ? parseInt(value) : undefined})} />

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