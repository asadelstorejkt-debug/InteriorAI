import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import { Sparkles } from 'lucide-react';

interface AnalysisResultProps {
  data: AnalysisResultType;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Analysis Result</h2>
        </div>
        <h3 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4">
          {data.designStyle}
        </h3>
        <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
          {data.description}
        </p>
      </div>
    </div>
  );
};

export default AnalysisResult;
