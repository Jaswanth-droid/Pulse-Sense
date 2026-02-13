import React, { useState, useEffect } from 'react';
import { Send, Zap, Sparkles, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '../hooks/useVoice';

interface SignalInputProps {
    onAddLog: (text: string) => void;
    isAnalyzing: boolean;
}

const SignalInput: React.FC<SignalInputProps> = ({ onAddLog, isAnalyzing }) => {
    const [text, setText] = useState('');
    const { isListening, transcript, startListening, stopListening } = useVoice();

    // Sync voice transcript to input
    useEffect(() => {
        if (transcript) {
            setText(transcript);
        }
    }, [transcript]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAddLog(text);
            setText('');
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto mb-12"
        >
            <div className={`glass-panel rounded-2xl p-6 glow-border transition-all duration-500 ${isListening ? 'border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.3)]' : ''}`}>
                <div className="flex items-center justify-between mb-4 text-primary font-medium">
                    <div className="flex items-center gap-2">
                        <Zap size={18} className="animate-pulse" />
                        <span>Real-time Life Signal Logger</span>
                    </div>
                    {isListening && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs uppercase tracking-wider text-red-400 font-bold flex items-center gap-2"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Listening
                        </motion.span>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Describe your day... (e.g., 'Woke up with dry eyes, had a late coffee, felt a bit dizzy after lunch')"}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 pr-12 h-32 focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-slate-500"
                    />

                    <div className="absolute bottom-4 right-4 flex gap-2 items-center">
                        <div className="relative group">
                            {/* Mnemosync Ripple Animation */}
                            {isListening && (
                                <>
                                    <motion.div
                                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                        className="absolute inset-0 rounded-xl bg-red-500/40 -z-10"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                                        className="absolute inset-0 rounded-xl bg-red-500/30 -z-10"
                                    />
                                </>
                            )}
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`p-3 rounded-xl transition-all relative z-10 flex items-center justify-center overflow-hidden ${isListening
                                    ? 'text-white'
                                    : 'text-white'
                                    }`}
                                style={{
                                    background: isListening
                                        ? 'linear-gradient(135deg, #ef4444 0%, #be123c 100%)'
                                        : 'linear-gradient(135deg, #4c1d95 0%, #d946ef 100%)',
                                    boxShadow: isListening
                                        ? '0 0 25px rgba(239, 68, 68, 0.6), inset 0 2px 0 rgba(255,255,255,0.2)'
                                        : '0 4px 15px rgba(124, 58, 237, 0.4), inset 0 2px 0 rgba(255,255,255,0.2)'
                                }}
                            >
                                {/* Shimmer effect on hover */}
                                {!isListening && (
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '200%' }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                    />
                                )}
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isAnalyzing || !text.trim()}
                            className="p-2 bg-primary text-slate-950 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isAnalyzing ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <Sparkles size={20} />
                                </motion.div>
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-4 min-h-[40px] flex items-center justify-center">
                    {isListening ? (
                        <div className="flex items-center gap-2">
                            {[...Array(7)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 6 }}
                                    animate={{ height: [10, 32 + Math.random() * 20, 10] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.3 + Math.random() * 0.4,
                                        ease: "easeInOut"
                                    }}
                                    className="w-2 rounded-full bg-gradient-to-t from-cyan-400 via-purple-500 to-fuchsia-500 shadow-[0_0_20px_rgba(236,72,153,0.8)]"
                                />
                            ))}
                            <span className="ml-4 text-xs font-mono text-cyan-400 animate-pulse tracking-[0.2em] font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                                LISTENING...
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 opacity-40">
                            <div className="h-[2px] w-12 rounded-full bg-slate-700" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">
                                Neural Link Active
                            </span>
                            <div className="h-[2px] w-12 rounded-full bg-slate-700" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SignalInput;
