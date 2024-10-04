import { useState, useCallback } from "react";

interface UseCopyToClipboardResult {
  copyToClipboard: (text: string) => void;
  isCopied: boolean;
  error: Error | null;
}

function useCopyToClipboard(): UseCopyToClipboardResult {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);
      setTimeout(() => setIsCopied(false), 2000); // Reset the isCopied state after 2 seconds
    } catch (err) {
      setError(err as Error);
      setIsCopied(false);
    }
  }, []);

  return { copyToClipboard, isCopied, error };
}

export default useCopyToClipboard;
