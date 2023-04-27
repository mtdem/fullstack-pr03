import { useState, useEffect, useCallback } from 'react';

export const useGameScoring = (clearRows) => {
  const [score, setScore] = useState(0);
  const [numRows, setNumRows] = useState(0);
  const [levels, setLevels] = useState(0);

  const scoringSystem = [40, 100, 300, 1200];

  const calculateScore = useCallback(() => {
    if (clearRows > 0) {
      setScore((prev) => prev + scoringSystem[clearRows - 1] * (levels + 1));
      setNumRows((prev) => prev + clearRows);
    }
  }, [levels, scoringSystem, clearRows]);

  useEffect(() => {
    calculateScore();
  }, [calculateScore, clearRows, score]);

  return [score, setScore, numRows, setNumRows, levels, setLevels] as const;
};
