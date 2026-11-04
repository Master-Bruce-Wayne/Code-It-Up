import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Clock, Cpu, AlertTriangle, Lightbulb, Code2 } from 'lucide-react';
import { toast } from 'react-toastify';
import AnnotationMarker from './AnnotationMarker.jsx';

const AiAnalysisModal = ({
    isOpen,
    onClose,
    loading,
    analysis,
    error,
    problemCode,
    verdict,
    onApplyCode
}) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopyCode = (code) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Optimized code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const getVerdictBadge = (v) => {
        if (!v) return null;
        const base = "inline-flex items-center px-2 py-0.5 rounded-pill font-mono text-[10px] font-bold uppercase tracking-wider border-2 border-ink";
        if (v === "AC") return <span className={`${base} bg-lime text-ink`}>Accepted (AC)</span>;
        if (v === "WA") return <span className={`${base} bg-accentCoral text-ink`}>Wrong Answer (WA)</span>;
        if (v === "TLE") return <span className={`${base} bg-accentBlue text-ink`}>Time Limit (TLE)</span>;
        if (v === "CE") return <span className={`${base} bg-[#FFD166] text-ink`}>Compilation Error</span>;
        return <span className={`${base} bg-surface text-ink-muted`}>{v}</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
            <div className="relative w-full max-w-4xl bg-surface border-2 border-ink shadow-[8px_8px_0_0_#17181A] rounded-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="bg-canvas border-b-2 border-ink p-4 sm:p-5 flex items-center justify-between gap-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-lime border-2 border-ink flex items-center justify-center rounded-md shadow-[2px_2px_0_0_#17181A]">
                            <Sparkles className="size-5 text-ink" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg sm:text-xl font-bold font-mono text-ink tracking-tight uppercase">
                                    Gemini AI Code Analysis
                                </h3>
                                {problemCode && (
                                    <span className="font-mono text-xs font-bold bg-surface border-2 border-ink px-2 py-0.5 rounded-sm">
                                        {problemCode}
                                    </span>
                                )}
                                {getVerdictBadge(verdict)}
                            </div>
                            <p className="text-xs font-mono text-ink-muted">
                                Algorithmic evaluation, asymptotic complexity & optimization suggestions
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 sm:p-2 border-2 border-ink bg-surface hover:bg-ink hover:text-canvas rounded-md transition-colors cursor-pointer shadow-[2px_2px_0_0_#17181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                        title="Close modal"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-canvas/40 blueprint-grid">
                    
                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-20 border-2 border-dashed border-ink rounded-lg bg-surface space-y-4">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-ink" />
                            <h4 className="text-base font-bold font-mono text-ink uppercase tracking-wider">
                                Consulting Gemini...
                            </h4>
                            <p className="text-xs font-mono text-ink-muted max-w-md mx-auto">
                                Analyzing algorithm structure, validating time/space limits, checking for edge case pitfalls, and generating optimized code.
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="p-5 border-2 border-ink bg-accentCoral/15 rounded-lg space-y-2">
                            <div className="flex items-center gap-2 text-ink">
                                <AlertTriangle className="size-5 text-accentCoral" />
                                <h4 className="font-bold font-mono text-sm uppercase">Analysis Unavailable</h4>
                            </div>
                            <p className="font-mono text-xs text-ink-soft">
                                {error}
                            </p>
                            <p className="font-mono text-[11px] text-ink-muted pt-2 border-t border-ink/20">
                                Tip: Ensure <code className="bg-surface px-1.5 py-0.5 border border-ink/40 font-bold">GEMINI_API_KEY</code> is configured in <code className="bg-surface px-1.5 py-0.5 border border-ink/40 font-bold">backend/.env</code>.
                            </p>
                        </div>
                    )}

                    {/* Analysis Content */}
                    {analysis && !loading && (
                        <div className="space-y-6">
                            
                            {/* Summary Card */}
                            <div className="border-2 border-ink bg-surface p-4 sm:p-5 rounded-lg shadow-[4px_4px_0_0_#17181A] space-y-3">
                                <div className="flex items-center gap-2">
                                    <AnnotationMarker label="EXECUTIVE SUMMARY" />
                                </div>
                                <p className="text-ink font-mono text-xs sm:text-sm leading-relaxed">
                                    {analysis.summary}
                                </p>
                                {analysis.verdictDiagnosis && (
                                    <div className="mt-3 p-3 bg-canvas border-2 border-ink/20 rounded-md">
                                        <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                                            Verdict Diagnosis:
                                        </span>
                                        <p className="font-mono text-xs text-ink-soft leading-relaxed">
                                            {analysis.verdictDiagnosis}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Complexity Grid */}
                            {analysis.complexity && (
                                <div className="border-2 border-ink bg-surface p-4 sm:p-5 rounded-lg shadow-[4px_4px_0_0_#17181A] space-y-4">
                                    <AnnotationMarker label="COMPLEXITY EVALUATION" />
                                    
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {/* Current Complexity */}
                                        <div className="border-2 border-ink/30 bg-canvas p-4 rounded-md space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                                                    Current Solution
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 font-mono text-xs font-bold text-ink">
                                                    <Clock className="size-3.5 text-ink-muted" />
                                                    Time: <span className="bg-surface border border-ink/40 px-1.5 py-0.5 rounded">{analysis.complexity.currentTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1 font-mono text-xs font-bold text-ink">
                                                    <Cpu className="size-3.5 text-ink-muted" />
                                                    Space: <span className="bg-surface border border-ink/40 px-1.5 py-0.5 rounded">{analysis.complexity.currentSpace}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Optimal Complexity */}
                                        <div className="border-2 border-ink bg-lime/20 p-4 rounded-md space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                                                    Target Optimal
                                                </span>
                                                <span className="text-[9px] font-mono font-bold bg-lime border border-ink px-1.5 py-0.5 uppercase">
                                                    Ideal
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 font-mono text-xs font-bold text-ink">
                                                    <Clock className="size-3.5 text-ink" />
                                                    Time: <span className="bg-surface border border-ink px-1.5 py-0.5 rounded">{analysis.complexity.optimalTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1 font-mono text-xs font-bold text-ink">
                                                    <Cpu className="size-3.5 text-ink" />
                                                    Space: <span className="bg-surface border border-ink px-1.5 py-0.5 rounded">{analysis.complexity.optimalSpace}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {analysis.complexity.explanation && (
                                        <p className="font-mono text-xs text-ink-soft pt-1">
                                            {analysis.complexity.explanation}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Issues and Edge Cases */}
                            {analysis.issuesAndEdgeCases && analysis.issuesAndEdgeCases.length > 0 && (
                                <div className="border-2 border-ink bg-surface p-4 sm:p-5 rounded-lg shadow-[4px_4px_0_0_#17181A] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="size-4 text-accentCoral" />
                                        <h4 className="font-bold font-mono text-xs uppercase tracking-wider text-ink">
                                            Critical Edge Cases & Pitfalls
                                        </h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {analysis.issuesAndEdgeCases.map((issue, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs font-mono text-ink-soft bg-canvas p-2.5 rounded border border-ink/20">
                                                <span className="text-accentCoral font-bold">•</span>
                                                <span>{issue}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Concrete Optimizations */}
                            {analysis.optimizations && analysis.optimizations.length > 0 && (
                                <div className="border-2 border-ink bg-surface p-4 sm:p-5 rounded-lg shadow-[4px_4px_0_0_#17181A] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="size-4 text-lime" />
                                        <h4 className="font-bold font-mono text-xs uppercase tracking-wider text-ink">
                                            Algorithmic Optimizations
                                        </h4>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {analysis.optimizations.map((opt, idx) => (
                                            <div key={idx} className="border-2 border-ink/20 bg-canvas p-3 rounded-md space-y-1">
                                                <h5 className="font-bold font-mono text-xs text-ink flex items-center gap-1.5">
                                                    <span className="size-4 rounded-full bg-ink text-canvas text-[10px] flex items-center justify-center">
                                                        {idx + 1}
                                                    </span>
                                                    {opt.title}
                                                </h5>
                                                <p className="font-mono text-[11px] text-ink-soft leading-relaxed">
                                                    {opt.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggested Optimized Code */}
                            {analysis.suggestedCode && (
                                <div className="border-2 border-ink bg-surface p-4 sm:p-5 rounded-lg shadow-[4px_4px_0_0_#17181A] space-y-3">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <Code2 className="size-4 text-accentBlue" />
                                            <h4 className="font-bold font-mono text-xs uppercase tracking-wider text-ink">
                                                Recommended Optimal Solution
                                            </h4>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleCopyCode(analysis.suggestedCode)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-canvas hover:bg-ink hover:text-canvas border border-ink text-[11px] font-mono font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                                            >
                                                {copied ? <Check className="size-3 text-lime" /> : <Copy className="size-3" />}
                                                {copied ? "Copied" : "Copy Code"}
                                            </button>

                                            {onApplyCode && (
                                                <button
                                                    onClick={() => onApplyCode(analysis.suggestedCode)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-lime hover:bg-lime-hover border border-ink text-ink text-[11px] font-mono font-bold uppercase tracking-wider rounded shadow-[2px_2px_0_0_#17181A] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
                                                >
                                                    Insert in Editor
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Code Block */}
                                    <div className="bg-ink text-canvas p-4 rounded-md overflow-x-auto border-2 border-ink font-mono text-xs leading-relaxed max-h-80 overflow-y-auto">
                                        <pre>{analysis.suggestedCode}</pre>
                                    </div>

                                    {analysis.suggestedCodeExplanation && (
                                        <p className="font-mono text-xs text-ink-soft pt-1">
                                            {analysis.suggestedCodeExplanation}
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-canvas border-t-2 border-ink p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
                    <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
                        Powered by Google Gemini 2.5 / 3 Flash
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 border-2 border-ink bg-surface hover:bg-ink hover:text-canvas text-ink font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AiAnalysisModal;
