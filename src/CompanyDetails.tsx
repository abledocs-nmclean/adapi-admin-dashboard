import { useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { useAuthContext, useQueryWithAuth } from "./auth-context";
import { getCompany } from "./api";
import { Company } from './model';
import './CompanyDetails.css';

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

    const containerRef = useRef<HTMLElement | null>();

    const initContainer = useCallback(
        (container: HTMLElement | null) => {
            containerRef.current = container;
            if (!container) return;
            createSpinner({
                target: container
            });
        }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        if (companyQuery.isLoading) {
            showSpinner(containerRef.current!);
        } else {
            hideSpinner(containerRef.current!);
        }
    }, [companyQuery.isLoading]);

    return (
        <div ref={initContainer}>
            <h1>Company Details</h1>
            <dl>
                <dt>ID</dt>
                <dd>{companyQuery.data?.id}</dd>

                <dt>Name</dt>
                <dd>{companyQuery.data?.name}</dd>

                <dt>Trial</dt>
                <dd>{companyQuery.data?.isTrial ? "yes" : "no"}</dd>

                <dt>Active</dt>
                <dd>{companyQuery.data?.isActive ? "yes" : "no"}</dd>

                <dt>ADO Client ID</dt>
                <dd>{companyQuery.data?.adoClientId}</dd>
            </dl>
        </div>
    );
}