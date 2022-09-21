import React, { useMemo, useState } from "react";
import { CheckBoxComponent, ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { CreateCompanyRequest } from "./model";

type CompanyEditProps = {
    onSubmit: (company: CreateCompanyRequest) => void;
};

export default function CompanyEdit({onSubmit}: CompanyEditProps) {
    const [name, setName] = useState("");
    const [adoClientId, setAdoClientId] = useState<number | undefined>();
    const [isActive, setIsActive] = useState(true);

    const isValid = useMemo(() => {
        return name.length > 0 && adoClientId !== undefined;
    }, [name, adoClientId, isActive]);

    function handleSubmit() {
        onSubmit({name, adoClientId: adoClientId!, isActive});
    }

    return (
        <DialogComponent header="Add Company" isModal={true} width={500}
            buttons={[
                {
                    buttonModel: {
                        content: "Add",
                        isPrimary: true,
                        iconCss: 'e-icons e-check',
                        disabled: !isValid
                    },
                    type: "submit",
                    click: handleSubmit
                }
            ]}
        >
            <form>
                <TextBoxComponent placeholder="Name" cssClass="e-outline" floatLabelType="Auto"
                    value={name} input={({value}) => setName(value)} />
                <NumericTextBoxComponent placeholder="ADO Client ID" cssClass="e-outline" floatLabelType="Auto"
                    value={adoClientId} change={({value}) => setAdoClientId(value)} />
                {/* <CheckBoxComponent value={isActive} /> */}
            </form>
        </DialogComponent>
    );
}