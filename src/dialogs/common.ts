import React from "react";
import { filterUndefined } from "../common";

export type EditModel<TModel> = Partial<TModel> & {isAdd?: boolean};

export abstract class EditForm<TModel> extends React.Component<EditModel<TModel>, EditModel<TModel>> {
    constructor(props: EditModel<TModel>, defaults: Partial<TModel> = {}) {
        super(props);
        // state is initialized with defaults, which are overridden with any input model properties that are not undefined
        this.state = {...defaults, ...filterUndefined(props)};
    }
}