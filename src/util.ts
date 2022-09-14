import { useEffect, MutableRefObject } from "react";
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

export function useSpinnerEffect(containerRef: MutableRefObject<HTMLElement | null>, shouldShowSpinner: boolean) {
    useEffect(() => {
        if (!containerRef.current) return;
        if (shouldShowSpinner) {
            showSpinner(containerRef.current);
        } else {
            hideSpinner(containerRef.current);
        }
    }, [shouldShowSpinner])
}