import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, AlertCircle, X, Trash2, CheckCircle2 } from 'lucide-react';

export interface Notification {
    id: string;
    type: 'missed_survey' | 'appointment' | 'alert';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
}

interface NotificationPanelProps {
    notifications: Notification[];
    onClearAll: () => void;
    onDismiss: (id: string) => void;
    onAction: (type: Notification['type']) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClearAll, onDismiss, onAction }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-16 right-0 w-80 glass-panel rounded-2xl border-slate-700/50 shadow-2xl z-[100] overflow-hidden"
        >
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <Bell size={14} className="text-primary" />
                    NOTIFICATIONS
                </h3>
                {notifications.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="text-[10px] font-mono text-slate-500 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Trash2 size={10} /> CLEAR_ALL
                    </button>
                )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <AnimatePresence initial={false}>
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <CheckCircle2 size={32} className="mx-auto mb-3 text-slate-700 opacity-20" />
                            <p className="text-xs text-slate-500 font-mono">NO_NOTIFICATIONS_YET</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors group relative"
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 p-1.5 rounded-lg flex-shrink-0 ${notif.type === 'missed_survey' ? 'bg-rose-500/10 text-rose-400' :
                                            notif.type === 'appointment' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-primary/10 text-primary'
                                        }`}>
                                        {notif.type === 'missed_survey' ? <AlertCircle size={14} /> :
                                            notif.type === 'appointment' ? <Calendar size={14} /> :
                                                <Bell size={14} />}
                                    </div>
                                    <div className="flex-1 cursor-pointer" onClick={() => onAction(notif.type)}>
                                        <h4 className="text-xs font-bold text-slate-100 mb-0.5">{notif.title}</h4>
                                        <p className="text-[11px] text-slate-400 leading-tight mb-1">{notif.message}</p>
                                        <span className="text-[9px] font-mono text-slate-600">{notif.timestamp}</span>
                                    </div>
                                    <button
                                        onClick={() => onDismiss(notif.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-white text-slate-600 transition-all"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default NotificationPanel;
