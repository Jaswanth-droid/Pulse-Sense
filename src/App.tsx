import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Heart, Zap, Waves, Settings, Bell, Shield, Sparkles, Activity, Battery, TrendingUp } from 'lucide-react'
import SignalInput from './components/SignalInput'
import SignalCard, { Signal } from './components/SignalCard'
import HealthStats from './components/HealthStats'
import MetricDetailView, { MetricType } from './components/MetricDetailView'
import NotificationPanel, { Notification } from './components/NotificationPanel'
import SettingsView, { UserProfile } from './components/SettingsView'
import { useVoice } from './hooks/useVoice'

function App() {
    const [signals, setSignals] = useState<Signal[]>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [view, setView] = useState<'dashboard' | 'health' | 'details' | 'settings'>('dashboard')
    const [activeDetailMetric, setActiveDetailMetric] = useState<MetricType | null>(null)
    const [activeFollowUp, setActiveFollowUp] = useState<{ id: string, type: Signal['type'], title: string } | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Alex Rivera',
        age: '28',
        weight: '72',
        height: '178',
        goal: 'longevity'
    })
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 'mock-pt',
            type: 'appointment',
            title: 'Optometry Checkup',
            message: 'Annual vision assessment scheduled for tomorrow at 10:00.',
            timestamp: 'Tomorrow',
            isRead: false
        }
    ])
    const [showNotificationPanel, setShowNotificationPanel] = useState(false)
    const [metrics, setMetrics] = useState({
        metabolic: 50,
        psychoEmotional: 50,
        cardiovascular: 50
    })

    // Reminder State (Global)
    const [reminderTime, setReminderTime] = useState("20:00")
    const [isReminderEnabled, setIsReminderEnabled] = useState(false)
    const [showReminderAlert, setShowReminderAlert] = useState(false)

    // Historical Daily Data (Mock + Real-time Sync)
    const [history, setHistory] = useState([
        { date: 'Feb 06', avg: 62 },
        { date: 'Feb 07', avg: 65 },
        { date: 'Feb 08', avg: 58 },
        { date: 'Feb 09', avg: 72 },
        { date: 'Feb 10', avg: 68 },
        { date: 'Feb 11', avg: 55 },
        { date: 'Feb 12', avg: 50 },
    ])

    const { speak } = useVoice()

    // Real-time reminder check
    useEffect(() => {
        if (!isReminderEnabled) return;

        const checkTime = () => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            const targetTime = `${reminderTime}:00`;

            if (currentTime === targetTime) {
                setShowReminderAlert(true);
                speak("Daily assessment reminder is due.");
            }
        };

        const interval = setInterval(checkTime, 1000); // Check every second for "live" feel
        return () => clearInterval(interval);
    }, [isReminderEnabled, reminderTime, speak]);

    const handleSurveyComplete = (avg: number) => {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        setHistory(prev => {
            const existingIndex = prev.findIndex(h => h.date === today);
            if (existingIndex !== -1) {
                const next = [...prev];
                next[existingIndex] = { ...next[existingIndex], avg };
                return next;
            } else {
                return [...prev, { date: today, avg }];
            }
        });
        // Clear missed survey notification if it exists
        setNotifications(prev => prev.filter(n => n.type !== 'missed_survey'));
    };

    // Notification Logic: Check for missed survey
    useEffect(() => {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        const hasLoggedToday = history.some(h => h.date === today && h.avg !== -1); // Assuming -1 means no data as requested earlier

        if (!hasLoggedToday) {
            const missedNotifId = 'missed-survey-today';
            setNotifications(prev => {
                if (prev.some(n => n.id === missedNotifId)) return prev;
                return [{
                    id: missedNotifId,
                    type: 'missed_survey',
                    title: 'Health Assessment Missed',
                    message: "You haven't completed your daily systemic health sync yet. Real-time accuracy is lower without baseline data.",
                    timestamp: 'Today',
                    isRead: false
                }, ...prev];
            });
        }
    }, [history]);

    const analyzeLog = async (text: string) => {
        setIsAnalyzing(true)

        // Simulate AI Latency
        await new Promise(resolve => setTimeout(resolve, 1500))

        const lowerText = text.toLowerCase()
        let newSignal: Signal | null = null

        if (lowerText.includes('stressed') || lowerText.includes('anxious') || lowerText.includes('overwhelmed')) {
            newSignal = {
                id: Date.now().toString(),
                type: 'psycho-emotional',
                riskScore: 82,
                title: 'Elevated Stress Indicators',
                description: 'Language markers suggest a heightened emotional load. Frequency aligns with potential strain patterns.',
                timestamp: 'Just Now',
                confidence: 0.94,
                followUpQuestion: "I hear you. It sounds like a lot to carry. Have you had a moment to disconnect since this started?"
            }
        } else if (lowerText.includes('heart') || lowerText.includes('chest') || lowerText.includes('palpitations') || lowerText.includes('racing')) {
            newSignal = {
                id: Date.now().toString(),
                type: 'cardiovascular',
                riskScore: 88,
                title: 'Heart Rhythm Variance',
                description: 'Self-reported palpitations correlated with context. Not a diagnosis, but a pattern worth monitoring.',
                timestamp: 'Just Now',
                confidence: 0.89,
                followUpQuestion: "That sensation can be unsettling. Did this feeling start suddenly, or did it build up over time?"
            }
        } else if (lowerText.includes('hungry') || lowerText.includes('shaky') || lowerText.includes('faint') || lowerText.includes('sugar')) {
            newSignal = {
                id: Date.now().toString(),
                type: 'metabolic',
                riskScore: 65,
                title: 'Rapid Energy Drop',
                description: 'Indicators align with a sudden shift in energy levels. Correlating with recent dietary logs.',
                timestamp: 'Just Now',
                confidence: 0.78,
                followUpQuestion: "Noted. When was the last time you had a balanced meal with protein?"
            }
        } else if (lowerText.includes('flashback') || lowerText.includes('nightmare') || lowerText.includes('reliving') || lowerText.includes('remote') || lowerText.includes('detached') || lowerText.includes('jumpy')) {
            newSignal = {
                id: Date.now().toString(),
                type: 'psycho-emotional',
                riskScore: 92,
                title: 'Trauma Response Pattern',
                description: 'Language markers suggest intrusive memories or hyperarousal. This pattern often correlates with processed trauma signals.',
                timestamp: 'Just Now',
                confidence: 0.96,
                followUpQuestion: "That sounds incredibly heavy. When these memories come up, do you have a safe space or grounding technique that usually helps?"
            }
        } else if (lowerText.includes('alone') || lowerText.includes('avoid') || lowerText.includes('people') || lowerText.includes('room') || lowerText.includes('no energy')) {
            newSignal = {
                id: Date.now().toString(),
                type: 'psycho-emotional',
                riskScore: 75,
                title: 'Social Withdrawal Indicator',
                description: 'Reports indicate a potential decline in social engagement. This can sometimes be a precursor to deeper mood shifts.',
                timestamp: 'Just Now',
                confidence: 0.82,
                followUpQuestion: "It's okay to need space. Have you felt this need to pull away increasing over the last few days?"
            }
        } else if (lowerText.includes('tremor') || lowerText.includes('shake') || lowerText.includes('stiff') || lowerText.includes('hand') || lowerText.includes('balance') || lowerText.includes('shuffle')) {
            newSignal = {
                id: Date.now().toString(),
                type: 'cardiovascular',
                riskScore: 78,
                title: 'Motor Control Variance',
                description: 'Reports of involuntary movement or stiffness detected. This pattern warrants longitudinal tracking of motor function.',
                timestamp: 'Just Now',
                confidence: 0.88,
                followUpQuestion: "Noticed. Does this stiffness or shaking happen closer to when you wake up, or later in the day?"
            }
        } else if (lowerText.includes('forget') || lowerText.includes('lost') || lowerText.includes('confused') || lowerText.includes('repeat') || lowerText.includes('memory') || lowerText.includes('brain fog')) {
            newSignal = {
                id: Date.now().toString(),
                type: 'psycho-emotional',
                riskScore: 85,
                title: 'Cognitive Pattern Drift',
                description: 'Language markers suggest short-term memory lapses or spatial confusion. frequency is key context here.',
                timestamp: 'Just Now',
                confidence: 0.91,
                followUpQuestion: "That can be frustrating. Is it small details slipping away, or larger events?"
            }
        } else {
            // Contextual Relevance Check
            if (activeFollowUp) {
                const contextKeywords: Record<Signal['type'], string[]> = {
                    'psycho-emotional': ['yes', 'no', 'fine', 'okay', 'better', 'worse', 'help', 'safe', 'unbalanced', 'moment', 'disconnect', 'space', 'days', 'memory', 'frustrat', 'detail'],
                    'cardiovascular': ['sudden', 'time', 'build', 'wake', 'day', 'stiff', 'shake', 'palpitation', 'rhythm', 'breath', 'chest'],
                    'metabolic': ['meal', 'protein', 'sugar', 'liquid', 'hungry', 'energy', 'today', 'unusual', 'body', 'skin']
                };

                const isRelevant = contextKeywords[activeFollowUp.type].some(k => lowerText.includes(k)) ||
                    lowerText.length < 30; // Shorter responses are often context-dependent

                if (isRelevant) {
                    newSignal = {
                        id: Date.now().toString(),
                        type: activeFollowUp.type,
                        riskScore: 0, // Context updates shouldn't necessarily spike risk
                        title: `Refinement: ${activeFollowUp.title}`,
                        description: `Contextual update received for previous ${activeFollowUp.type} inquiry. Adjusting personalized model based on user response.`,
                        timestamp: 'Just Now',
                        confidence: 0.98
                    };
                    setActiveFollowUp(null); // Clear after successful refinement
                }
            }

            if (!newSignal) {
                const systemicMap: Record<string, { keywords: string[], type: Signal['type'], title: string, desc: string, q: string }> = {
                    'neurological': {
                        keywords: ['headache', 'dizzy', 'vision', 'blur', 'seizure', 'faint', 'coordination', 'weakness', 'speech', 'numb', 'migraine'],
                        type: 'psycho-emotional',
                        title: 'Neurological Variance',
                        desc: 'Markers indicate potential nervous system disruption. Correlation with sleep and stress recommended.',
                        q: "Please sit down if you feel unsteady. Did this sensation come on suddenly?"
                    },
                    'respiratory': {
                        keywords: ['breath', 'cough', 'wheeze', 'chest', 'air', 'choke', 'phlegm', 'sneeze', 'shortness'],
                        type: 'cardiovascular',
                        title: 'Respiratory Strain Pattern',
                        desc: 'Keywords suggest respiratory effort or restriction. Monitoring environmental triggers.',
                        q: "Has it been harder to catch your breath during activity or while resting?"
                    },
                    'digestive': {
                        keywords: ['stomach', 'nausea', 'vomit', 'gut', 'bloated', 'diarrhea', 'constipat', 'acid', 'burn', 'indigestion'],
                        type: 'metabolic',
                        title: 'Gastrointestinal Distress',
                        desc: 'Digestive system markers detected. Potential link to dietary input or stress.',
                        q: "Uncomfortable digestion can be draining. Have you eaten anything new or unusual today?"
                    },
                    'integumentary': {
                        keywords: ['rash', 'itch', 'hives', 'sweat', 'pale', 'blue', 'bruise', 'lump', 'skin', 'dry', 'redness'],
                        type: 'metabolic',
                        title: 'Dermatological Flag',
                        desc: 'Skin-related keywords detected. Often a visible indicator of internal or environmental response.',
                        q: "Is the area bothering you localized, or is it affecting other parts of your body?"
                    },
                    'musculoskeletal': {
                        keywords: ['pain', 'ache', 'sore', 'muscle', 'joint', 'bone', 'stiff', 'cramp', 'back', 'neck', 'arthritis'],
                        type: 'cardiovascular',
                        title: 'Musculoskeletal Strain',
                        desc: 'Reports of physical discomfort in tissue or joints. Assessing impact on mobility.',
                        q: "On a scale of 1-10, how much is this limiting your movement right now?"
                    },
                    'immune': {
                        keywords: ['fever', 'chill', 'hot', 'cold', 'sick', 'flu', 'sore throat', 'gland', 'swollen', 'infection'],
                        type: 'metabolic',
                        title: 'Immune Response Indicator',
                        desc: 'System appears to be mounting a defense response. Energy conservation recommended.',
                        q: "Have you been around anyone who was feeling unwell recently?"
                    },
                    'discomfort_general': {
                        keywords: ['hurt', 'agony', 'pain', 'discomfort', 'suffering', 'malaise'],
                        type: 'cardiovascular',
                        title: 'General Distress Signal',
                        desc: 'Acute discomfort reported. Priority is to establish severity and localization.',
                        q: "I'm listening. Can you describe the quality of the sensation? Is it sharp, dull, or throbbing?"
                    },
                    'mood_general': {
                        keywords: ['sad', 'hopeless', 'cry', 'angry', 'mood', 'depressed', 'manic', 'bipolar'],
                        type: 'psycho-emotional',
                        title: 'Mood Stability Variance',
                        desc: 'Emotional modulation markers detected. Deviation from baseline mood stability.',
                        q: "It's valid to feel this way. Has a specific event triggered this shift?"
                    }
                };

                let foundSystem = false;
                for (const [key, system] of Object.entries(systemicMap)) {
                    if (system.keywords.some(k => lowerText.includes(k))) {
                        newSignal = {
                            id: Date.now().toString(),
                            type: system.type,
                            riskScore: 75 + Math.floor(Math.random() * 15),
                            title: system.title,
                            description: system.desc,
                            timestamp: 'Just Now',
                            confidence: 0.85,
                            followUpQuestion: system.q
                        };
                        foundSystem = true;
                        break;
                    }
                }

                if (!foundSystem) {
                    newSignal = {
                        id: Date.now().toString(),
                        type: 'psycho-emotional',
                        riskScore: 12,
                        title: 'Baseline Update',
                        description: 'Log recorded. No significant risk signals detected against your personalized baseline.',
                        timestamp: 'Just Now',
                        confidence: 0.65
                    }
                }
            }

            if (newSignal) {
                setSignals(prev => [newSignal!, ...prev])

                // Only update metrics if it's a "real" signal, not just a refinement
                if (!newSignal.title.startsWith('Refinement:')) {
                    const categoryKey = newSignal.type === 'psycho-emotional' ? 'psychoEmotional' : newSignal.type;
                    setMetrics(prev => ({
                        ...prev,
                        [categoryKey]: Math.max(0, prev[categoryKey as keyof typeof prev] - (newSignal!.riskScore / 5))
                    }))
                }

                if (newSignal.followUpQuestion) {
                    setActiveFollowUp({
                        id: newSignal.id,
                        type: newSignal.type,
                        title: newSignal.title
                    });

                    let speechText = newSignal.followUpQuestion;
                    if (newSignal.riskScore > 85) {
                        speechText = "I've detected a significant pattern. " + speechText + " Please note: This signal indicates a high risk pattern. Please consult a healthcare professional immediately.";
                    }
                    speak(speechText);
                } else if (!newSignal.title.startsWith('Refinement:')) {
                    // If it's a new signal without a question, clear old context
                    setActiveFollowUp(null);
                }
            }
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="min-h-screen text-slate-100 p-6 md:p-12 selection:bg-primary/30 relative overflow-hidden">
            {/* Health & Wellness Background Layer */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#020617]" />
                <HeartbeatLine />
                <FloatingHealthSymbols />
                <KineticOrb color="rgba(168, 85, 247, 0.15)" size="600px" top="-10%" left="-10%" duration={20} />
                <KineticOrb color="rgba(20, 184, 166, 0.15)" size="500px" bottom="-10%" right="-10%" duration={25} />
                <KineticOrb color="rgba(59, 130, 246, 0.1)" size="400px" top="20%" right="10%" duration={18} />
            </div>

            {/* Content Wrapper to stay above background */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <nav className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-border"
                        >
                            <Shield className="text-slate-950" size={24} />
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">PULSE<span className="text-primary">SENSE</span></h1>
                            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Hea AI Prototype v1.0</p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-center">
                        <div className="hidden md:flex gap-4">
                            <MetricBadge
                                icon={<Zap size={14} />}
                                label="Metabolic"
                                value={Math.round(metrics.metabolic)}
                                color="text-yellow-400"
                                onClick={() => {
                                    setActiveDetailMetric('metabolic');
                                    setView('details');
                                }}
                            />
                            <MetricBadge
                                icon={<Brain size={14} />}
                                label="Psycho-Emot"
                                value={Math.round(metrics.psychoEmotional)}
                                color="text-purple-400"
                                onClick={() => {
                                    setActiveDetailMetric('psycho-emotional');
                                    setView('details');
                                }}
                            />
                            <MetricBadge
                                icon={<Heart size={14} />}
                                label="Cardio"
                                value={Math.round(metrics.cardiovascular)}
                                color="text-red-400"
                                onClick={() => {
                                    setActiveDetailMetric('cardiovascular');
                                    setView('details');
                                }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('health')}
                                className={`p-2 rounded-lg transition-colors ${view === 'health' ? 'bg-primary text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                            >
                                <Activity size={18} />
                            </button>
                            <div className="relative">
                                <IconButton
                                    icon={<Bell size={18} />}
                                    hasBadge={notifications.length > 0}
                                    onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                                />
                                <AnimatePresence>
                                    {showNotificationPanel && (
                                        <NotificationPanel
                                            notifications={notifications}
                                            onClearAll={() => {
                                                setNotifications([]);
                                                setShowNotificationPanel(false);
                                            }}
                                            onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
                                            onAction={(type) => {
                                                if (type === 'missed_survey') {
                                                    setView('health');
                                                }
                                                setShowNotificationPanel(false);
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                            <IconButton
                                icon={<Settings size={18} />}
                                onClick={() => setView('settings')}
                            />
                        </div>
                    </div>
                </nav>

                <AnimatePresence mode="wait">
                    {view === 'health' ? (
                        <HealthStats
                            key="health"
                            metrics={metrics}
                            onUpdateMetrics={(key, val) => setMetrics(prev => ({ ...prev, [key]: val }))}
                            onSurveyComplete={handleSurveyComplete}
                            onClose={() => setView('dashboard')}
                            reminderSettings={{
                                time: reminderTime,
                                isEnabled: isReminderEnabled,
                                setTime: setReminderTime,
                                setEnabled: setIsReminderEnabled
                            }}
                        />
                    ) : view === 'details' && activeDetailMetric ? (
                        <MetricDetailView
                            key="details"
                            type={activeDetailMetric}
                            onClose={() => {
                                setView('dashboard');
                                setActiveDetailMetric(null);
                            }}
                        />
                    ) : view === 'settings' ? (
                        <SettingsView
                            profile={userProfile}
                            onSave={(updated) => {
                                setUserProfile(updated);
                                setView('dashboard');
                            }}
                            onClose={() => setView('dashboard')}
                        />
                    ) : (
                        <motion.main
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12"
                        >
                            {/* Left Col: Input & Description */}
                            <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent italic">
                                        Unmasking Hidden Health Signals.
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        Speak your day. Our AI scans for "weak" signals in your natural language—subtle patterns that clinical records often miss.
                                    </p>
                                </div>

                                <SignalInput onAddLog={analyzeLog} isAnalyzing={isAnalyzing} />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel p-6 rounded-2xl border-slate-700/30 relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <TrendingUp size={16} className="text-primary" />
                                            Periodic Health Analysis
                                        </h4>
                                        <span className="text-[10px] font-mono text-slate-500">REALTIME_SYNC</span>
                                    </div>

                                    <div className="h-40 relative px-4">
                                        {/* Grid Background */}
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                            <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
                                        </div>

                                        {/* Interactive Nodes & Labels */}
                                        <div className="absolute inset-x-4 inset-y-0 flex justify-between">
                                            {history.map((day, i) => (
                                                <div key={i} className="flex-1 relative group cursor-help">
                                                    {/* Hollow Circular Node (Fixed Shape) */}
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{
                                                            scale: 1,
                                                            opacity: 1,
                                                            bottom: `${day.avg}%`
                                                        }}
                                                        transition={{
                                                            delay: i * 0.1,
                                                            type: "spring",
                                                            stiffness: 260,
                                                            damping: 20
                                                        }}
                                                        className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-[rgb(168,85,247)] bg-slate-950/50 shadow-[0_0_12px_rgba(168,85,247,0.7)] z-20 translate-y-1/2"
                                                    />

                                                    {/* Tooltip on hover */}
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-30 -translate-y-full mb-4 border border-slate-700 shadow-xl pointer-events-none">
                                                        {day.avg}% Health
                                                    </div>

                                                    {/* Date Label */}
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                                        <span className={`text-[9px] font-mono transition-colors ${i === history.length - 1 ? 'text-primary font-bold' : 'text-slate-500'}`}>
                                                            {day.date}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Col: Signal Dashboard */}
                            <div className="lg:col-span-12 xl:col-span-8">
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Activity className="text-primary" size={20} />
                                        Signal Feed
                                    </h3>
                                    <span className="text-xs text-slate-500 font-mono">LIVE_STREAM_CONNECTED</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    <AnimatePresence>
                                        {signals.length === 0 ? (
                                            <div className="col-span-2 flex flex-col items-center justify-center opacity-30 mt-20">
                                                <Waves size={64} className="animate-pulse mb-4 text-slate-700" />
                                                <p className="font-mono text-sm">AWAITING INPUT_DATA...</p>
                                            </div>
                                        ) : (
                                            signals.map(signal => (
                                                <SignalCard key={signal.id} signal={signal} />
                                            ))
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.main>
                    )}
                </AnimatePresence>
            </div>

            {/* Global Reminder Alert Modal */}
            <AnimatePresence>
                {showReminderAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-panel w-full max-w-sm p-8 rounded-3xl border-blue-500/50 text-center shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                        >
                            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
                                <Bell size={40} className="animate-bounce" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Daily Assessment Reminder is Due</h3>
                            <p className="text-slate-400 mb-8 text-sm">
                                Your scheduled systemic health sync is starting now. Real-time data improves baseline accuracy.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setShowReminderAlert(false);
                                        setView('health');
                                    }}
                                    className="flex-1 py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
                                >
                                    Start Sync
                                </button>
                                <button
                                    onClick={() => setShowReminderAlert(false)}
                                    className="px-6 py-4 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 transition-all"
                                >
                                    Later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function MetricBadge({ icon, label, value, color, onClick }: { icon: React.ReactNode, label: string, value: number, color: string, onClick?: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full border-slate-700/50 transition-colors"
        >
            <span className={color}>{icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
            <span className="text-xs font-mono font-bold">{value}%</span>
        </motion.button>
    )
}

function IconButton({ icon, hasBadge, onClick }: { icon: React.ReactNode, hasBadge?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass-panel hover:bg-slate-800 transition-colors relative"
        >
            {icon}
            {hasBadge && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse" />
            )}
        </button>
    )
}

function BaselineItem({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">{label}</span>
            <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
        </div>
    )
}

function KineticOrb({ color, size, top, left, right, bottom, duration }: any) {
    return (
        <motion.div
            animate={{
                x: [0, 50, -50, 0],
                y: [0, -50, 50, 0],
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.1, 0.9, 1]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{
                position: 'absolute',
                top, left, right, bottom,
                width: size,
                height: size,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                filter: 'blur(80px)',
                borderRadius: '50%',
                zIndex: 0
            }}
        />
    );
}

function HeartbeatLine() {
    return (
        <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute top-1/2 -translate-y-1/2">
                <motion.path
                    d="M 0 50 L 300 50 L 320 40 L 340 60 L 360 20 L 380 80 L 400 50 L 700 50 L 720 40 L 740 60 L 760 20 L 780 80 L 800 50 L 1000 50"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.5)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: [0, 1, 1],
                        opacity: [0, 1, 0],
                        x: [0, -100]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </svg>
        </div>
    );
}

function FloatingHealthSymbols() {
    const symbols = [
        { Icon: Heart, color: "text-red-500/20", top: "15%", left: "10%", delay: 0 },
        { Icon: Brain, color: "text-purple-500/20", top: "25%", right: "15%", delay: 2 },
        { Icon: Activity, color: "text-teal-500/20", bottom: "20%", left: "20%", delay: 4 },
        { Icon: Zap, color: "text-yellow-500/20", top: "60%", right: "25%", delay: 1 },
        { Icon: Battery, color: "text-blue-500/20", bottom: "40%", right: "10%", delay: 3 },
    ];

    return (
        <div className="absolute inset-0">
            {symbols.map((symbol, i) => (
                <motion.div
                    key={i}
                    style={{ position: 'absolute', top: symbol.top, left: symbol.left, right: symbol.right, bottom: symbol.bottom }}
                    animate={{
                        y: [0, -40, 0],
                        rotate: [0, 15, -15, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 5,
                        repeat: Infinity,
                        delay: symbol.delay,
                        ease: "easeInOut"
                    }}
                >
                    <symbol.Icon size={48} className={symbol.color} />
                </motion.div>
            ))}
        </div>
    );
}

export default App
