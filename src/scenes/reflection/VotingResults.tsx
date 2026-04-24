import React from 'react';
import { ReflectionOption } from '../../storydata/reflectionData';

interface VotingResultsProps {
  options: ReflectionOption[];
  votes: Record<number, number>; // optionId to count
}

export const VotingResults: React.FC<VotingResultsProps> = ({ options, votes }) => {
  const total = Object.values(votes).reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex flex-col gap-3 mt-(--inner-mt)">
      {options.map((option) => {
        const optId = option.optionId ?? -1;
        const count = votes[optId] ?? 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={optId} className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline [font-size:var(--text-label)] text-foreground">
              <span className="flex-1">{option.text}</span>
              <span className="text-primary font-bold ml-3 shrink-0">{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
