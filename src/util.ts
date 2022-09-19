import { useCallback, useRef } from "react";
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { ApiError } from "./api";

export function useSpinnerCallback(shouldShowSpinner: boolean) {
    const containerRef = useRef<HTMLElement | null>(null);

    return useCallback((container: HTMLElement | null) => {
        if (!container) {
            // container not mounted
            return;
        }

        if (container !== containerRef.current) {
            // new container mounted - set up spinner
            createSpinner({target: container});
            containerRef.current = container;
        }

        if (shouldShowSpinner) {
            // for some reason, we can't seem to create a spinner and show it immediately. Use setTimeout to start showing on the next frame
            setTimeout(() => showSpinner(container));
        } else {
            hideSpinner(container);
        }
    }, [shouldShowSpinner]);
}

export function getErrorDisplayMessage(error: any) {
    if (error instanceof ApiError) {
        // todo - get message from response
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "unknown error";
}