import { useEffect, useMemo, useState } from "react";
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, InputEventArgs } from '@syncfusion/ej2-react-inputs';
import { Company } from "./model";
import './CompanyEdit.css'

type CompanyEditProps = {
    company?: Company,
    onChange?: (data: Partial<Company>) => void
};

export default function CompanyEdit({onChange, company: existingCompany}: CompanyEditProps) {
    const [name, setName] = useState(() => existingCompany?.name ?? "");
    const [adoClientId, setAdoClientId] = useState(existingCompany?.adoClientId);
    const [isActive, setIsActive] = useState(() => existingCompany?.isActive ?? true);
    const [isTrial, setIsTrial] = useState(() => existingCompany?.isTrial ?? false);

    const isValid = useMemo(() => {
        return name.length > 0 && adoClientId !== undefined;
    }, [name, adoClientId]);

    useEffect(() => {
        if (onChange) onChange({name, adoClientId, isActive, isTrial});
    }, [onChange, name, adoClientId, isActive, isTrial]);

    // async function sendChange() {
    //     if (existingCompany?.id) {
    //         return await companyEditMutation.mutateAsync({id: existingCompany.id, request: {name, adoClientId, isActive, isTrial}})
    //     }
    //     return await companyAddMutation.mutateAsync({name, adoClientId: adoClientId!, isActive, isTrial});
    // }

    return (
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
            </form>
    );
}