"use client";

import { useState, useEffect } from "react";
import { Cpu, Battery, Wifi, Terminal, Map, Bot, Zap, Monitor, RefreshCw, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CARD_PAIRS = [
    { id: "cpu", icon: Cpu, label: "CPU" },
    { id: "batt", icon: Battery, label: "Battery" },
    { id: "wifi", icon: Wifi, label: "Wi-Fi" },
    { id: "term", icon: Terminal, label: "Code" },
    { id: "map", icon: Map, label: "Sensor" },
    { id: "bot", icon: Bot, label: "Robot" },
    { id: "zap", icon: Zap, label: "Power" },
    { id: "mon", icon: Monitor, label: "Display" },
];

interface Card {
    uniqueId: number;
    id: string;
    icon: any;
    label: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function RoboMatchGame() {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameState, setGameState] = useState<"start" | "playing" | "won" | "lost">("start");
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds to win

    // Initialize Game
    const initGame = () => {
        const shuffled = [...CARD_PAIRS, ...CARD_PAIRS]
            .sort(() => Math.random() - 0.5)
            .map((card, idx) => ({ ...card, uniqueId: idx, isFlipped: false, isMatched: false }));
        setCards(shuffled);
        setFlippedIndexes([]);
        setMoves(0);
        setMatches(0);
        setTimeLeft(60);
        setGameState("playing");
    };

    // Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === "playing" && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === "playing") {
            setGameState("lost");
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    // Handle Card Click
    const handleCardClick = (index: number) => {
        if (gameState !== "playing" || cards[index].isFlipped || cards[index].isMatched || flippedIndexes.length === 2) {
            return;
        }

        const newFlipped = [...flippedIndexes, index];
        setFlippedIndexes(newFlipped);

        setCards((prev) => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));

        if (newFlipped.length === 2) {
            setMoves((prev) => prev + 1);
            const [first, second] = newFlipped;
            if (cards[first].id === cards[second].id) {
                // Match!
                setTimeout(() => {
                    setCards((prev) => prev.map((c, i) => (i === first || i === second) ? { ...c, isMatched: true, isFlipped: true } : c));
                    setFlippedIndexes([]);
                    setMatches((prev) => {
                        const newMatches = prev + 1;
                        if (newMatches === CARD_PAIRS.length) setGameState("won");
                        return newMatches;
                    });
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    setCards((prev) => prev.map((c, i) => (i === first || i === second) ? { ...c, isFlipped: false } : c));
                    setFlippedIndexes([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="w-full h-full bg-slate-900 flex flex-col items-center p-2 sm:p-4 relative overflow-y-auto">
            {/* Background elements */}
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.2) 0%, transparent 70%)" }} />

            {/* Header */}
            <div className="w-full max-w-2xl flex items-center justify-between mb-3 sm:mb-4 z-10 px-2 sm:px-4 shrink-0">
                <div className="flex flex-col">
                    <h2 className="text-lg sm:text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-2">
                        <Bot className="text-blue-400 w-6 h-6" /> Robo Match
                    </h2>
                    <p className="text-slate-400 text-sm">Match all parts to win a prize!</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-center bg-slate-800 px-4 py-2 rounded-xl border border-white/10">
                        <div className="text-xs text-slate-400 font-semibold mb-0.5">TIME</div>
                        <div className={`text-xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>0:{timeLeft.toString().padStart(2, '0')}</div>
                    </div>
                    <div className="text-center bg-slate-800 px-4 py-2 rounded-xl border border-white/10">
                        <div className="text-xs text-slate-400 font-semibold mb-0.5">MOVES</div>
                        <div className="text-xl font-mono font-bold text-white">{moves}</div>
                    </div>
                </div>
            </div>

            {/* Game States */}
            <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center relative z-10 overflow-y-auto p-1 sm:p-4">
                <AnimatePresence mode="wait">
                    {gameState === "start" && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center text-center max-w-sm z-10 bg-slate-800/80 backdrop-blur border border-white/10 p-8 rounded-3xl shadow-2xl"
                        >
                            <Bot className="w-20 h-20 text-blue-500 mb-6" />
                            <h3 className="text-2xl font-black text-white mb-2">Build the Robot!</h3>
                            <p className="text-slate-300 text-sm mb-8">Test your memory. Match all pairs of robotics components in under 60 seconds to win an exclusive coupon code.</p>
                            <button
                                onClick={initGame}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-3 rounded-xl w-full hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all active:scale-95"
                            >
                                Start Mission
                            </button>
                        </motion.div>
                    )}

                    {gameState === "playing" && (
                        <motion.div
                            key="playing"
                            variants={{
                                hidden: { opacity: 0 },
                                show: { opacity: 1, transition: { staggerChildren: 0.08 } }
                            }}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="grid grid-cols-4 gap-1 sm:gap-2.5 w-full mx-auto z-10 p-1 sm:p-2"
                            style={{ maxWidth: "min(100%, 500px)" }}
                        >
                        {cards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <motion.button
                                    key={card.uniqueId}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.5, y: 20 },
                                        show: { opacity: 1, scale: 1, y: 0 }
                                    }}
                                    onClick={() => handleCardClick(index)}
                                    whileHover={{ scale: card.isFlipped ? 1 : 1.05 }}
                                    whileTap={{ scale: card.isFlipped ? 1 : 0.95 }}
                                    className={`relative w-full aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform perspective-1000 ${
                                        card.isFlipped ? "rotate-y-180" : ""
                                    }`}
                                    style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                                >
                                    {/* Card Inner */}
                                    <div className={`absolute inset-0 w-full h-full rounded-2xl transition-all duration-500 ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}`} style={{ transformStyle: "preserve-3d" }}>
                                        {/* Back (Cover) */}
                                        <div className="absolute inset-0 w-full h-full bg-slate-800 border-2 border-slate-700 rounded-xl sm:rounded-2xl flex grid grid-cols-3 grid-rows-3 gap-0.5 p-2 backface-hidden items-center justify-center">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl sm:rounded-2xl" />
                                            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        {/* Front (Face) */}
                                        <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-200 border-2 border-white rounded-xl sm:rounded-2xl flex flex-col items-center justify-center backface-hidden !rotate-y-180" style={{ transform: "rotateY(180deg)" }}>
                                            <div className={`transition-all duration-300 ${card.isMatched ? 'text-green-500 scale-110 drop-shadow-md' : 'text-blue-600'}`}>
                                                <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-bold text-slate-700">{card.label}</span>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}

                {gameState === "won" && (
                    <motion.div
                        key="won"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="flex flex-col items-center text-center z-20 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 p-5 sm:p-8 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.2)] max-w-md w-full"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                            className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 mb-4 sm:mb-6"
                        >
                            <Award className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                        </motion.div>
                        <h3 className="text-xl sm:text-3xl font-black text-white mb-2 tracking-tight">Mission Accomplished!</h3>
                        <p className="text-emerald-100/80 mb-6">You matched all the components in <span className="font-bold text-white">{60 - timeLeft}s</span> flat. You&apos;ve unlocked your reward!</p>
                        
                        <div 
                            className="w-full bg-black/40 border border-white/10 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 relative group cursor-pointer" 
                            onClick={() => {
                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                    navigator.clipboard.writeText("PNTWEB2026");
                                    alert("Coupon PNTWEB2026 copied to clipboard!");
                                } else {
                                    alert("Please copy the code manually: PNTWEB2026");
                                }
                            }}
                        >
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-1">Your Coupon Code</div>
                            <div className="text-xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-wider">PNT<span className="text-white">WEB</span>2026</div>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                <span className="text-xs font-bold text-white bg-black/60 px-2 py-1 rounded">Click to Copy</span>
                            </div>
                        </div>

                        <button
                            onClick={initGame}
                            className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" /> Play Again
                        </button>
                    </motion.div>
                )}

                {gameState === "lost" && (
                    <motion.div
                        key="lost"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center z-20 bg-rose-950/80 backdrop-blur-md border border-rose-500/30 p-5 sm:p-8 rounded-3xl shadow-xl max-w-sm"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50 mb-6">
                            <span className="text-3xl font-black text-white">0:00</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Time&apos;s Up!</h3>
                        <p className="text-rose-100/80 mb-8">The robot powered down before you could assemble it.</p>
                        <button
                            onClick={initGame}
                            className="bg-white text-rose-600 font-bold px-8 py-3 rounded-xl w-full hover:bg-rose-50 transition-colors"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}
