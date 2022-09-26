import React, { useMemo, useState } from "react";
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, InputEventArgs } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useCompanyAddMutation, useCompanyEditMutation } from "./queries";
import { Company } from "./model";
import { useErrorMessage } from "./util";
import './CompanyEdit.css'

type CompanyEditProps = {
    onSuccess?: (company: Company) => void;
    onCancel?: () => void
    company?: Company
};

export default function CompanyEdit({onSuccess, onCancel, company: existingCompany}: CompanyEditProps) {
    const [name, setName] = useState(() => existingCompany?.name ?? "");
    const [adoClientId, setAdoClientId] = useState(existingCompany?.adoClientId);
    const [isActive, setIsActive] = useState(() => existingCompany?.isActive ?? true);
    const [isTrial, setIsTrial] = useState(() => existingCompany?.isTrial ?? false);

    const isValid = useMemo(() => {
        return name.length > 0 && adoClientId !== undefined;
    }, [name, adoClientId]);

    const companyAddMutation = useCompanyAddMutation();
    const companyEditMutation = useCompanyEditMutation();

    const companyAddErrorMessage = useErrorMessage(companyAddMutation.error);

    async function sendChange() {
        if (existingCompany) {
            return await companyEditMutation.mutateAsync({id: existingCompany.id, request: {name, adoClientId, isActive, isTrial}})
        }
        return await companyAddMutation.mutateAsync({name, adoClientId: adoClientId!, isActive, isTrial});
    }

    async function handleSubmit() {
        const company = await sendChange();
        if (onSuccess) onSuccess(company);
    }

    function handleClose(e: {cancel: boolean}) {
        if (onCancel) onCancel();
    }

    return (
        <DialogComponent header="Add Company" isModal={true} width={500} showCloseIcon={true} close={handleClose}
            buttons={[
                {
                    buttonModel: {
                        content: existingCompany ? "Save" : "Add",
                        isPrimary: true,
                        iconCss: 'e-icons e-check',
                        disabled: companyAddMutation.isLoading || companyEditMutation.isLoading || !isValid                        
                    },
                    type: "submit",
                    click: handleSubmit
                }
            ]}
        >
            <form className="company-edit">
                <TextBoxComponent placeholder="Name" cssClass="e-outline" floatLabelType="Auto"
                    value={name} input={({value}) => setName(value)} />

                <TextBoxComponent type="number" placeholder="ADO Client ID" cssClass="e-outline" floatLabelType="Auto"
                    value={`${adoClientId ?? ""}`} input={({value}: InputEventArgs) => setAdoClientId(value ? parseInt(value) : undefined)} />

                <div className="checkboxes">
                    <CheckBoxComponent label="Active" labelPosition={"Before"}
                        checked={isActive} change={({checked}) => setIsActive(checked)} />
                    <CheckBoxComponent label="Trial" labelPosition={"Before"}
                        checked={isTrial} change={({checked}) => setIsTrial(checked)} />
                </div>
                
                {companyAddErrorMessage &&
                    <div className="error" role="alert">
                        Problem adding company:<br />
                        {companyAddErrorMessage}
                    </div>
                }
            </form>
        </DialogComponent>
    );
}