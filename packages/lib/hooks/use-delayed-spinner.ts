import { useEffect, useState } from "react";

export function useDelayedSpinner(isLoading: boolean, delay = 500): boolean {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowSpinner(true);
      }, delay);
    } else {
      setShowSpinner(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading, delay]);

  return showSpinner;
}
