import { useCallback, useRef, useState, useEffect } from "react";
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

const htmlParser = new DOMParser();

export async function getErrorDisplayMessage(error: unknown) {
    if (error instanceof ApiError) {
        const responseText = await error.response.text();

        const contentType = error.response.headers.get("content-type");
        const mimeType = contentType?.substring(0, contentType.indexOf(";")).toLowerCase();
        if (mimeType === "text/html") {
            const responseDoc = htmlParser.parseFromString(responseText, "text/html");
            return responseDoc.body.innerText;
        }
        return responseText;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "unknown error";
}

export function useErrorMessage(error: unknown) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        updateErrorMessage();

        async function updateErrorMessage() {
            if (error) {
                const message = await getErrorDisplayMessage(error);
                setErrorMessage(message);
            } else {
                setErrorMessage(null);
            }
        }            
    }, [error]);

    return errorMessage;
}