import { useEffect } from "react";

interface UseKeyBoardParams {
  isSolved: boolean;
  handleBackspace: () => void;
  handleEnter: () => void;
  handleLetter: (letter: string) => void;
}

const useKeyBoard = ({
  isSolved,
  handleBackspace,
  handleEnter,
  handleLetter,
}: UseKeyBoardParams) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isSolved) return;
      const k = e.key;
      if (k === "Backspace") return handleBackspace();
      if (k === "Enter") return handleEnter();
      if (/^[а-я]$/.test(k)) return handleLetter(k.toLowerCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSolved, handleBackspace, handleEnter, handleLetter]);
};

export default useKeyBoard;