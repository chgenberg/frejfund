'use client';

import React from 'react';

interface ScoreProps {
  score: number;
  label: string;
  color: string;
}

interface ScoreComparison {
  average: number;
  percentile: number;
}

interface ScoreData {
  score: number;
  label: string;
  color: string;
  comparison: ScoreComparison;
}

export default function BusinessPlanScore({ score, label, color }: ScoreProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const getScoreComparison = (score: number): ScoreComparison => {
    return {
      average: 65,
      percentile: Math.round((score / 100) * 100)
    };
  };

  const scoreData: ScoreData = {
    score,
    label,
    color,
    comparison: getScoreComparison(score)
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      <div 
        className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mb-4"
        style={{ backgroundColor: scoreData.color }}
      >
        {scoreData.score}
      </div>
      <h3 className="text-xl font-semibold mb-2">{scoreData.label}</h3>
      <div className="text-sm text-gray-600">
        <p>Average: {scoreData.comparison.average}</p>
        <p>Percentile: {scoreData.comparison.percentile}%</p>
      </div>
    </div>
  );
} 