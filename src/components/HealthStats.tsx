import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Heart, Zap, TrendingUp, Calendar, ArrowRight, X, Check, Bell, BellRing, Clock } from 'lucide-react';

interface HealthStatsProps {
    metrics: {
        metabolic: number;
        psychoEmotional: number;
        cardiovascular: number;
    };
    onUpdateMetrics: (key: string, value: number) => void;
    onSurveyComplete: (avg: number) => void;
    onClose: () => void;
    reminderSettings: {
        time: string;
        isEnabled: boolean;
        setTime: (time: string) => void;
        setEnabled: (enabled: boolean) => void;
    };
}

const HealthStats: React.FC<HealthStatsProps> = ({ metrics, onUpdateMetrics, onSurveyComplete, onClose, reminderSettings }) => {
    const [showSurvey, setShowSurvey] = useState(false);
    const [surveyData, setSurveyData] = useState({
        sleep: 50,
        water: 50,
        exercise: 50
    });

    const totalScore = Math.round((metrics.metabolic + metrics.psychoEmotional + metrics.cardiovascular) / 3);

    const handleSurveySubmit = () => {
        // Calculate new metrics based on survey
        const newPsycho = Math.min(100, Math.max(0, metrics.psychoEmotional + (surveyData.sleep - 50) / 5));
        const newMetabolic = Math.min(100, Math.max(0, metrics.metabolic + (surveyData.water - 50) / 5));
        const newCardio = Math.min(100, Math.max(0, metrics.cardiovascular + (surveyData.exercise - 50) / 5));

        // Update main state
        onUpdateMetrics('psychoEmotional', newPsycho);
        onUpdateMetrics('metabolic', newMetabolic);
        onUpdateMetrics('cardiovascular', newCardio);

        // Record history point (Survey-only update)
        const avg = Math.round((newPsycho + newMetabolic + newCardio) / 3);
        onSurveyComplete(avg);

        setShowSurvey(false);
    };

    // AI Recommendations based on metrics
    const getRecommendations = () => {
        const recs = [];

        // Tier 2: Severe Risk (< 40)
        if (metrics.psychoEmotional < 40 || metrics.metabolic < 40 || metrics.cardiovascular < 40) {
            recs.push({
                title: "Clinical Consultation Required",
                type: "critical",
                desc: "One or more biometric markers have dropped below safe thresholds. Please visit a doctor or medical professional for a comprehensive evaluation immediately.",
                impact: "Critical"
            });
        }

        // Tier 1: Category Specific (< 45)
        if (metrics.cardiovascular < 45) {
            recs.push({
                title: "Cardiovascular Optimization",
                type: "cardio",
                desc: "Efficiency markers are declining. It is highly recommended to perform 30 minutes of light physical exercise or aerobic activity.",
                impact: "High"
            });
        }

        if (metrics.psychoEmotional < 45) {
            recs.push({
                title: "Mental Wellness Support",
                type: "mental",
                desc: "Emotional stability markers suggest a need for decompression. Consider visiting a psychiatrist/therapist or spending quality time with family and friends.",
                impact: "High"
            });
        }

        if (metrics.metabolic < 45) {
            recs.push({
                title: "Metabolic Stabilization",
                type: "metabolic",
                desc: "Energy synthesis is below baseline. Focus on nutritional intake, hydration, and consistent resting periods.",
                impact: "High"
            });
        }

        if (recs.length === 0) {
            recs.push({
                title: "Maintenance Mode",
                type: "stable",
                desc: "Systems are stable and within safe operating parameters. Continue current wellness routine.",
                impact: "Low"
            });
        }
        return recs;
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'cardio': return 'border-red-500/50 hover:bg-red-500/5';
            case 'mental': return 'border-purple-500/50 hover:bg-purple-500/5';
            case 'metabolic': return 'border-emerald-500/50 hover:bg-emerald-500/5';
            case 'critical': return 'border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-pulse bg-rose-600/5';
            default: return 'border-slate-700/50 hover:bg-slate-800/30';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="col-span-12 space-y-8"
        >
            {/* Header & Live Score */}
            <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
                <div className="flex-1">
                    <button
                        onClick={onClose}
                        className="mb-4 text-xs font-mono text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
                    >
                        <ArrowRight className="rotate-180" size={14} />
                        RETURN_TO_DASHBOARD
                    </button>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                        Systemic health analysis
                    </h2>
                    <p className="text-slate-400 max-w-lg">
                        Real-time biometric synthesis. Your "Live Life Score" is a dynamic aggregate of your metabolic, psycho-emotional, and cardiovascular data.
                    </p>

                    <button
                        onClick={() => setShowSurvey(true)}
                        className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2"
                    >
                        <Calendar size={18} />
                        Update Lifestyle Survey
                    </button>
                </div>

                {/* LeetCode-style Concentric Rings */}
                <div className="relative w-64 h-64 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        {/* Background Track */}
                        <circle cx="128" cy="128" r="110" fill="none" stroke="#1e293b" strokeWidth="12" />

                        {/* Segments - Simplified to Concentric for Clarity & "Sum to 100" aesthetic */}
                        {/* Cardio (Red) - Outer */}
                        <circle
                            cx="128" cy="128" r="110"
                            fill="none" stroke="#ef4444" strokeWidth="12"
                            strokeDasharray={`${(metrics.cardiovascular / 100) * 690} 690`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        {/* Psycho (Purple) - Middle */}
                        <circle
                            cx="128" cy="128" r="94"
                            fill="none" stroke="#a855f7" strokeWidth="12"
                            strokeDasharray={`${(metrics.psychoEmotional / 100) * 590} 590`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        {/* Metabolic (Green) - Inner */}
                        <circle
                            cx="128" cy="128" r="78"
                            fill="none" stroke="#10b981" strokeWidth="12"
                            strokeDasharray={`${(metrics.metabolic / 100) * 490} 490`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-white">{totalScore}</span>
                        <span className="text-xs uppercase tracking-widest text-slate-500 mt-1">Live Score</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric Cards - Enhanced */}
                <MetricCard
                    icon={<Zap size={24} />}
                    label="Metabolic Base"
                    value={metrics.metabolic}
                    color="text-emerald-400"
                    bg="bg-emerald-400"
                />
                <MetricCard
                    icon={<Brain size={24} />}
                    label="Psycho-Emotional"
                    value={metrics.psychoEmotional}
                    color="text-purple-400"
                    bg="bg-purple-400"
                />
                <MetricCard
                    icon={<Heart size={24} />}
                    label="Cardiovascular"
                    value={metrics.cardiovascular}
                    color="text-red-400"
                    bg="bg-red-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Routine Effectiveness */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-6 text-emerald-400">
                        <TrendingUp size={20} />
                        <h3 className="font-bold text-lg">Routine Stability</h3>
                    </div>
                    {['Sleep Quality', 'Dietary Balance', 'Physical Output'].map((item, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">{item}</span>
                                <span className="text-slate-200 font-mono">
                                    {Math.round(totalScore + (i % 2 === 0 ? 5 : -5))}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalScore + (i % 2 === 0 ? 5 : -5)}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-gradient-to-r from-slate-600 to-slate-400 opacity-60"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Recommendations */}
                <div className="glass-panel p-6 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <SparklesIcon />
                        <h3 className="font-bold text-lg">Health Recommendations</h3>
                    </div>
                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                        {getRecommendations().map((rec, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => alert(`Initiating recovery protocol for: ${rec.title}`)}
                                className={`p-4 rounded-xl bg-slate-900/50 border transition-all cursor-pointer ${getTypeStyles(rec.type)}`}
                            >
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-semibold text-slate-200">{rec.title}</h4>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-slate-800 ${rec.impact === 'Critical' ? 'text-rose-400' : 'text-slate-400'}`}>
                                        {rec.impact} Impact
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 mb-4">{rec.desc}</p>
                                {rec.type !== 'stable' && (
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
                                        Follow Advice <ArrowRight size={10} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Daily Reminder Settings */}
                <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 col-span-1 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-blue-400">
                            <Bell size={20} />
                            <h3 className="font-bold text-lg">Daily Assessment Reminder</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={reminderSettings.isEnabled}
                                onChange={(e) => reminderSettings.setEnabled(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1">
                            <p className="text-slate-400 text-sm mb-4">
                                Set a daily reminder to complete your systemic health assessment. Regular data entry ensures higher accuracy in your Live Life Score.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-[200px]">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="time"
                                        value={reminderSettings.time}
                                        onChange={(e) => reminderSettings.setTime(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                                {reminderSettings.isEnabled && (
                                    <span className="text-xs font-mono text-blue-400 animate-pulse flex items-center gap-1">
                                        <BellRing size={12} /> Sync Active
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="w-full md:w-48 h-24 bg-blue-500/5 rounded-xl border border-blue-500/10 flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Scheduled for</span>
                            <span className="text-2xl font-bold text-slate-200">{reminderSettings.time}</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Survey Modal */}
            <AnimatePresence>
                {showSurvey && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel w-full max-w-md p-8 rounded-2xl border-primary/30 relative"
                        >
                            <button
                                onClick={() => setShowSurvey(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                                <Activity className="text-primary" />
                                Daily Calibration
                            </h2>

                            <div className="space-y-6">
                                <RangeInput
                                    label="Sleep Quality"
                                    value={surveyData.sleep}
                                    onChange={(v) => setSurveyData(prev => ({ ...prev, sleep: v }))}
                                    icon={<Brain size={16} />}
                                />
                                <RangeInput
                                    label="Hydration Level"
                                    value={surveyData.water}
                                    onChange={(v) => setSurveyData(prev => ({ ...prev, water: v }))}
                                    icon={<Zap size={16} />}
                                />
                                <RangeInput
                                    label="Physical Activity"
                                    value={surveyData.exercise}
                                    onChange={(v) => setSurveyData(prev => ({ ...prev, exercise: v }))}
                                    icon={<TrendingUp size={16} />}
                                />
                            </div>

                            <button
                                onClick={handleSurveySubmit}
                                className="w-full mt-8 py-4 bg-primary text-slate-950 font-bold rounded-xl hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                            >
                                <Check size={20} />
                                Calibrate & Update Score
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const MetricCard = ({ icon, label, value, color, bg }: any) => (
    <div className={`glass-panel p-6 rounded-2xl relative overflow-hidden group border-t border-white/5`}>
        <div className={`absolute inset-0 ${bg}/5 group-hover:${bg}/10 transition-colors`} />
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${bg}/10 rounded-xl ${color}`}>
                {icon}
            </div>
            <span className="text-2xl font-bold text-slate-100">{Math.round(value)}</span>
        </div>
        <h3 className="font-semibold text-slate-200">{label}</h3>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                className={`h-full ${bg}`}
            />
        </div>
    </div>
);

const RangeInput = ({ label, value, onChange, icon }: { label: string, value: number, onChange: (val: number) => void, icon: React.ReactNode }) => (
    <div>
        <div className="flex justify-between mb-2 text-sm text-slate-300">
            <span className="flex items-center gap-2">{icon} {label}</span>
            <span className="font-mono text-primary">{value}%</span>
        </div>
        <input
            type="range"
            min="0" max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
        />
    </div>
);

const SparklesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

export default HealthStats;
