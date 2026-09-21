import React from 'react';

const AnnotationMarker = ({ label, className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="w-2 h-2 bg-lime border border-ink" />
      <div className="h-[1px] w-8 bg-ink" />
      {label && (
        <span className="bg-surface border-2 border-ink rounded-pill px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.04em]">
          {label}
        </span>
      )}
    </div>
  );
};

export default AnnotationMarker;
