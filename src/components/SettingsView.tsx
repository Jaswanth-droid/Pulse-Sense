import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Save, X, ArrowLeft, Target, Scale, Ruler, Calendar } from 'lucide-react';

export interface UserProfile {
    name: string;
    age: string;
    weight: string;
    height: string;
    goal: string;
}

interface SettingsViewProps {
    profile: UserProfile;
    onSave: (updatedProfile: UserProfile) => void;
    onClose: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onSave, onClose }) => {
    const [formData, setFormData] = useState<UserProfile>(profile);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="col-span-12 max-w-4xl mx-auto w-full pb-20"
        >
            <header className="mb-12">
                <button
                    onClick={onClose}
                    className="mb-4 text-xs font-mono text-primary hover:text-primary/80 flex items-center gap-2 transition-colors uppercase tracking-widest"
                >
                    <ArrowLeft size={14} />
                    RETURN_TO_SYSTEM
                </button>
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary glow-border">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-white tracking-tight uppercase">User Credentials</h2>
                        <p className="text-slate-500 font-mono text-[10px] tracking-widest uppercase mt-1">Identity Protocol v4.0 // Secure_Access_Level_01</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="glass-panel p-8 rounded-3xl border-slate-700/30 space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <User size={16} className="text-primary" />
                        CORE_IDENTITY
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                                placeholder="ENTER_NAME"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider ml-1">Biological Age</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                                    placeholder="AGE"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Biometrics */}
                <div className="glass-panel p-8 rounded-3xl border-slate-700/30 space-y-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Target size={16} className="text-secondary" />
                            BIOMETRIC_DATA
                        </h3>
                        {(() => {
                            const w = parseFloat(formData.weight);
                            const h = parseFloat(formData.height) / 100;
                            if (w > 0 && h > 0) {
                                const bmi = (w / (h * h)).toFixed(1);
                                const bmiVal = parseFloat(bmi);
                                let category = { label: 'UNDERWEIGHT', color: 'text-blue-400', bg: 'bg-blue-400' };
                                if (bmiVal >= 30) category = { label: 'OBESE', color: 'text-rose-500', bg: 'bg-rose-500' };
                                else if (bmiVal >= 25) category = { label: 'OVERWEIGHT', color: 'text-yellow-500', bg: 'bg-yellow-500' };
                                else if (bmiVal >= 18.5) category = { label: 'NORMAL', color: 'text-emerald-400', bg: 'bg-emerald-400' };

                                return (
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[9px] font-mono text-slate-500 uppercase">BMI_INDEX</p>
                                            <p className="text-sm font-bold text-white font-mono">{bmi}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${category.bg}/10 ${category.color} border border-${category.color.split('-')[1]}-500/20`}>
                                            {category.label}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider ml-1">Weight (kg)</label>
                            <div className="relative">
                                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors font-mono text-sm"
                                    placeholder="KG"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider ml-1">Height (cm)</label>
                            <div className="relative">
                                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors font-mono text-sm"
                                    placeholder="CM"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider ml-1">Primary Optimization Goal</label>
                        <select
                            value={formData.goal}
                            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm appearance-none cursor-pointer"
                        >
                            <option value="longevity">Longevity & Cellular Repair</option>
                            <option value="performance">Peak Cognitive Performance</option>
                            <option value="metabolic">Metabolic Harmonization</option>
                            <option value="recovery">Systemic Recovery Optima</option>
                        </select>
                    </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-4 rounded-2xl bg-slate-800/50 text-slate-300 font-bold hover:bg-slate-800 transition-all uppercase tracking-widest text-xs border border-slate-700"
                    >
                        ABORT_CHANGES
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-widest text-xs flex items-center gap-2"
                    >
                        <Save size={16} />
                        UPDATE_CREDENTIALS
                    </button>
                </div>
            </form>

            <div className="mt-12 p-6 glass-panel rounded-3xl border-dashed border-slate-700 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Shield size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white mb-1 tracking-tight">Data Sovereignty Protocol</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Your biometric and identity credentials are encrypted at the edge. Pulse Sense operates under the "Privacy by Default" architecture—none of your sensitive data leaves this local interface unless explicitly synced with authorized nodes.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsView;
