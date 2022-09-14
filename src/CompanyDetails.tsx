import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext, useQueryWithAuth } from "./auth-context";
import { getCompany } from "./api";
import { Company } from './model';

type CompanyRouteParams = {id: string};

export default function CompanyDetails() {
    const { id } = useParams<CompanyRouteParams>();
    
    const { user } = useAuthContext();

    const companyQuery = useQueryWithAuth(useQuery(
        ["company", id],
        () => getCompany(user!, id!),
        {
            enabled: user !== null && id !== undefined,
            retry: false
        }
    ));

    return (
        <div>
            details
        </div>
    );
}