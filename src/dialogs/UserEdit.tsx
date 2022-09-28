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

    override render(): React.ReactNode {
        return null;
    }
}

