import React, { useMemo, useState } from "react";
import { CheckBoxComponent, ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, NumericTextBoxComponent, InputEventArgs } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useCompanyAddMutation } from "./queries";
import { Company } from "./model";

type CompanyEditProps = {
    onSuccess: (company: Company) => void;
};

export default function CompanyEdit({onSuccess}: CompanyEditProps) {
    const [name, setName] = useState("");
    const [adoClientId, setAdoClientId] = useState<number>();
    const [isActive, setIsActive] = useState(true);

    const isValid = useMemo(() => {
        return name.length > 0 && adoClientId !== undefined;
    }, [name, adoClientId, isActive]);

    const companyAddMutation = useCompanyAddMutation();

    async function handleSubmit() {
        const company = await companyAddMutation.mutateAsync({name, adoClientId: adoClientId!, isActive});
        onSuccess(company);
    }

    return (
        <DialogComponent header="Add Company" isModal={true} width={500}
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
            <form>
                <TextBoxComponent placeholder="Name" cssClass="e-outline" floatLabelType="Auto"
                    value={name} input={({value}) => setName(value)} />

                <TextBoxComponent type="number" placeholder="ADO Client ID" cssClass="e-outline" floatLabelType="Auto"
                    value={`${adoClientId ?? ""}`} input={({value}: InputEventArgs) => setAdoClientId(value ? parseInt(value) : undefined)} />
                {/* <CheckBoxComponent value={isActive} /> */}
            </form>
        </DialogComponent>
    );
}