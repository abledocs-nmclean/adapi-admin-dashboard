import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useQueryWithAuth } from "./auth-context";

type CompanyRouteParams = {id: string};

export default function CompanyDetails() {
    const { id } = useParams<CompanyRouteParams>();

    const companyQuery = useQueryWithAuth(useQuery(
        ["company", id],
        () => ({}),
        {
            enabled: id !== undefined
        }
    ));

    return (
        <div>
            details
        </div>
    );
}