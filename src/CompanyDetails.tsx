import { useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
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
            details
        </div>
    );
}