import { useState, useRef } from 'react';
import { createSpinner } from '@syncfusion/ej2-popups';
import { GridComponent, ColumnDirective, ColumnsDirective, Inject, Sort, Resize } from '@syncfusion/ej2-react-grids';
import { useCompaniesQuery } from "./queries";
import { Company } from './model';
import { useSpinnerEffect } from "./util";

export default function CompanyList() {
    const companiesQuery = useCompaniesQuery();

    const companiesContainerRef = useRef<HTMLElement | null>(null);
    useSpinnerEffect(companiesContainerRef, companiesQuery.isLoading);

    return (
        <div>
            <h1>Companies</h1>
            <div ref={(div) => {
                companiesContainerRef.current = div;
                if (div) createSpinner({target: div});
            }}>
                <GridComponent dataSource={companiesQuery.data} allowSorting={true}>
                    <ColumnsDirective>
                        <ColumnDirective headerText="Name" field="name" />
                        <ColumnDirective headerText="Active" autoFit={true} field="isActive" displayAsCheckBox={true} />
                        <ColumnDirective headerText="Trial" autoFit={true} field="isTrial" displayAsCheckBox={true} />
                        <ColumnDirective field="id" />
                    </ColumnsDirective>
                    <Inject services={[Sort, Resize]} />
                </GridComponent>
            </div>
        </div>
    );
}