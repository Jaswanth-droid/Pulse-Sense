import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface Signal {
    id: string;
    type: 'metabolic' | 'psycho-emotional' | 'cardiovascular';
    riskScore: number; // 0-100
    title: string;
    description: string;
    timestamp: string;
    confidence: number;
    followUpQuestion?: string;
}

const SignalCard: React.FC<{ signal: Signal }> = ({ signal }) => {
    const [showGraph, setShowGraph] = useState(false);

    const getRiskColor = (score: number) => {
        if (score >= 75) return 'text-signal-high bg-signal-high/10 border-signal-high/20';
        if (score >= 40) return 'text-signal-medium bg-signal-medium/10 border-signal-medium/20';
        return 'text-signal-low bg-signal-low/10 border-signal-low/20';
    };

    const Icon = signal.riskScore >= 75 ? AlertCircle : (signal.riskScore >= 40 ? Activity : CheckCircle2);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "glass-panel rounded-xl p-5 border transition-all hover:border-primary/30",
                getRiskColor(signal.riskScore)
            )}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900/50">
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-100">{signal.title}</h3>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            {signal.type} Risk
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-mono text-slate-500">{signal.timestamp}</span>
                    <div className="flex items-center gap-1 mt-1">
                        <TrendingUp size={12} className="text-primary" />
                        <span className="text-[10px] text-primary">Score: {signal.riskScore}/100</span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
                {signal.description}
            </p>

            {signal.followUpQuestion && (
                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1 text-primary text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        AI Follow-up
                    </div>
                    <p className="text-sm italic text-slate-400">"{signal.followUpQuestion}"</p>
                </div>
            )}

            <AnimatePresence>
                {showGraph && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 overflow-hidden"
                    >
                        <div className="p-3 bg-slate-900/80 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-bold text-primary uppercase">Causal Correlation Matrix</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                </div>
                            </div>
                            <div className="h-20 flex items-center justify-center relative overflow-hidden">
                                <svg width="100%" height="100%" viewBox="0 0 100 40">
                                    <motion.path
                                        d="M 0 30 Q 10 10, 20 25 T 40 10 T 60 20 T 80 5 T 100 15"
                                        fill="none"
                                        stroke="url(#gradient)"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2 }}
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#38bdf8" />
                                            <stop offset="100%" stopColor="#818cf8" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            </div>
                            <div className="flex justify-between mt-2 text-[9px] text-slate-500 font-mono">
                                <span>BAS_01</span>
                                <span>DEV_SIG</span>
                                <span>CON_04</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-4 pt-4 border-t border-slate-700/30 flex justify-between items-center">
                <button
                    onClick={() => setShowGraph(!showGraph)}
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                    <TrendingUp size={12} />
                    {showGraph ? "Hide Correlation Graph" : "View Correlation Graph"}
                </button>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-2 h-1 rounded-full",
                                i <= Math.ceil(signal.riskScore / 20)
                                    ? "bg-current"
                                    : "bg-slate-700"
                            )}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SignalCard;
