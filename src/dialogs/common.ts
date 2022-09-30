import React from "react";
import { filterUndefined } from "../common";

export type EditModel<TModel> = Partial<TModel> & {isAdd?: boolean};

export abstract class EditForm<TModel, TEditState = Partial<TModel>>
        extends React.Component<EditModel<TModel>, EditModel<TEditState>> {
    constructor(props: EditModel<TModel>, defaultState: EditModel<TEditState> = {}) {
        super(props);
        // state is initialized with defaults, which are overridden with any input model properties that are not undefined
        this.state = {...defaultState, ...filterUndefined(props)};
    }
}