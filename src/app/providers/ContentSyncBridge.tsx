import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../hooks/usePortfolioQueries";

export function ContentSyncBridge() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const invalidatePublicContent = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bootstrap });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.resume });
    };

    const invalidateSession = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSession });
    };

    const refreshVisibleContent = () => {
      if (document.hidden) {
        return;
      }

      invalidatePublicContent();
      invalidateSession();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshVisibleContent();
      }
    };

    const intervalId = window.setInterval(refreshVisibleContent, 60_000);

    window.addEventListener("focus", refreshVisibleContent);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshVisibleContent);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [queryClient]);

  return null;
}
