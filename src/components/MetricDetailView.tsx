import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Brain, Heart, CheckCircle2, Info, Activity } from 'lucide-react';

export type MetricType = 'metabolic' | 'cardiovascular' | 'psycho-emotional';

interface MetricDetailViewProps {
    type: MetricType;
    onClose: () => void;
}

const METRIC_CONTENT = {
    'metabolic': {
        title: 'Metabolic Health',
        icon: <Zap size={32} />,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400',
        importance: 'Metabolic health is the engine of your longevity. It governs how your body processes energy, manages blood sugar, and maintains cellular integrity. Dysregulation here often precedes chronic conditions like Type 2 diabetes and metabolic syndrome.',
        description: 'PULSE SENSE monitors your metabolic state by analyzing language markers related to energy fluctuations, dietary patterns, and systemic fatigue. It looks for "energy crashes" or "digestive distress" signals that correlate with blood glucose stability and mitochondrial efficiency.',
        practices: [
            { title: 'Intermittent Fasting', desc: 'Allows the body to switch to fat-burning mode (ketosis) and promotes cellular autophagy.' },
            { title: 'Protein-First Nutrition', desc: 'Stabilizes blood sugar levels and supports muscle mass, a primary metabolic organ.' },
            { title: 'Regular Hydration', desc: 'Essential for enzymatic processes and maintaining optimal blood volume/viscosity.' },
            { title: 'Post-Meal Walking', desc: 'A 10-minute walk after meals significantly blunts glucose spikes.' }
        ]
    },
    'cardiovascular': {
        title: 'Cardiovascular Health',
        icon: <Heart size={32} />,
        color: 'text-red-400',
        bg: 'bg-red-400',
        importance: 'Your heart is the ultimate endurance machine. Cardiovascular health determines your VO2 Max, blood pressure stability, and recovery capacity. It is the leading predictor of all-cause mortality.',
        description: 'Our AI scans for respiratory strain markers, mentions of palpitations, and physical stiffness. By correlating these with your reported activity levels, we estimate the "load" on your cardiovascular system and its ability to return to a rest state.',
        practices: [
            { title: 'Zone 2 Training', desc: 'Steady-state aerobic exercise that improves mitochondrial density and heart efficiency.' },
            { title: 'Breathwork (Box Breathing)', desc: 'Activates the parasympathetic nervous system to lower heart rate and blood pressure.' },
            { title: 'Magnesium Intake', desc: 'Supports heart rhythm and muscle relaxation across the vascular system.' },
            { title: 'Sauna Exposure', desc: 'Mimics cardiovascular exercise and improves arterial flexibility.' }
        ]
    },
    'psycho-emotional': {
        title: 'Psycho-Emotional Health',
        icon: <Brain size={32} />,
        color: 'text-purple-400',
        bg: 'bg-purple-400',
        importance: 'Mental wellness is the operating system of your life. It influences decision-making, immune function, and biological aging. Chronic stress or emotional burnout can physically degrade systemic health.',
        description: 'This is Pulse Sense\'s primary focus. We analyze semantic density, sentiment shift, and cognitive load markers in your speech. We look for signs of "hyperarousal" (stress) or "social withdrawal" that indicate emotional strain before they manifest physically.',
        practices: [
            { title: 'Mindfulness Meditation', desc: 'Strengthens the prefrontal cortex and reduces amygdala reactivity to stress.' },
            { title: 'Digital Decompression', desc: 'Setting boundaries with technology to reduce cognitive overload and dopamine fatigue.' },
            { title: 'Deep Sleep Optimization', desc: 'Essential for "glymphatic drainage" – clearing metabolic waste from the brain.' },
            { title: 'Social Connection', desc: 'Meaningful human interaction triggers oxytocin, broad-spectrum stress buffer.' }
        ]
    }
};

const MetricDetailView: React.FC<MetricDetailViewProps> = ({ type, onClose }) => {
    const data = METRIC_CONTENT[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="col-span-12 space-y-8 pb-20"
        >
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button
                        onClick={onClose}
                        className="mb-4 text-xs font-mono text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        BACK_TO_DASHBOARD
                    </button>
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${data.bg}/10 ${data.color} glow-border`}>
                            {data.icon}
                        </div>
                        <div>
                            <h2 className={`text-4xl font-bold ${data.color} tracking-tight uppercase`}>{data.title}</h2>
                            <p className="text-slate-500 font-mono text-[10px] tracking-widest uppercase mt-1">Detailed Analysis Protocol v2.4</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase text-slate-500 mb-1">Status</span>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                            <Activity size={14} /> ACTIVE_TRACKING
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Importance & Description */}
                <div className="lg:col-span-7 space-y-8">
                    <section className="glass-panel p-8 rounded-3xl border-slate-700/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Info size={120} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            Clinical Importance
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg">
                            {data.importance}
                        </p>
                    </section>

                    <section className="glass-panel p-8 rounded-3xl border-slate-700/30">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            How PULSE SENSE Tracks This
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                            {data.description}
                        </p>
                    </section>
                </div>

                {/* Right: Best Practices */}
                <div className="lg:col-span-5">
                    <section className="glass-panel p-8 rounded-3xl border-primary/20 h-full">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <CheckCircle2 size={20} />
                            </div>
                            Best Optimization Practices
                        </h3>
                        <div className="space-y-6">
                            {data.practices.map((practice, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-primary/40 transition-all"
                                >
                                    <h4 className="font-bold text-slate-100 mb-1">{practice.title}</h4>
                                    <p className="text-sm text-slate-400">{practice.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 border-dashed">
                            <p className="text-[11px] text-slate-500 italic text-center">
                                *Note: These practices are for informational purposes only. Consult with your healthcare physician before making significant lifestyle changes.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default MetricDetailView;
