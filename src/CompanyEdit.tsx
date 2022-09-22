import React, { useMemo, useState } from "react";
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, InputEventArgs } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useCompanyAddMutation } from "./queries";
import { Company } from "./model";
import { useErrorMessage } from "./util";
import './CompanyEdit.css'

type CompanyEditProps = {
    onSuccess?: (company: Company) => void;
    onCancel?: () => void
};

export default function CompanyEdit({onSuccess, onCancel}: CompanyEditProps) {
    const [name, setName] = useState("");
    const [adoClientId, setAdoClientId] = useState<number>();
    const [isActive, setIsActive] = useState(true);

    const isValid = useMemo(() => {
        return name.length > 0 && adoClientId !== undefined;
    }, [name, adoClientId, isActive]);

    const companyAddMutation = useCompanyAddMutation();

    const companyAddErrorMessage = useErrorMessage(companyAddMutation.error);

    async function handleSubmit() {
        const company = await companyAddMutation.mutateAsync({name, adoClientId: adoClientId!, isActive});
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
                        content: "Add",
                        isPrimary: true,
                        iconCss: 'e-icons e-check',
                        disabled: companyAddMutation.isLoading || !isValid
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
                <CheckBoxComponent label="Active" labelPosition={"Before"} checked={isActive} change={({checked}) => setIsActive(checked)} />
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