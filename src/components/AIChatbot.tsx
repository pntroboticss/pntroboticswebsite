"use client";
import { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Smooth wave letter animation component
function WaveText({ text }: { text: string }) {
    const letters = text.split("");
    const colors = [
        "#93c5fd", // blue-300
        "#a5b4fc", // indigo-300
        "#c4b5fd", // violet-300
        "#67e8f9", // cyan-300
        "#a5b4fc", // indigo-300
        "#93c5fd", // blue-300
    ];
    return (
        <span className="inline-flex" aria-label={text}>
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    animate={{
                        y: [0, -5, 0],
                        color: colors,
                    }}
                    transition={{
                        y: {
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.07,
                        },
                        color: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.1,
                        },
                    }}
                    style={{ display: "inline-block", whiteSpace: letter === " " ? "pre" : "normal" }}
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </span>
    );
}

interface Message {
    role: "user" | "model";
    content: string;
    feedback?: "up" | "down";
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: "Hello! I'm **Robo-PNT**, your PNT Robotics assistant. I can help with our products, defense projects, AMR solutions, humanoid robots, or any general questions. How can I assist you?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLocalMode, setIsLocalMode] = useState(false);
    const [localKnowledge, setLocalKnowledge] = useState<{ question: string, answer: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch FAQs on mount for Local Agent indexing
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await fetch("/api/admin/faq");
                if (res.ok) {
                    const data = await res.json();
                    setLocalKnowledge(data);
                }
            } catch (err) {
                console.warn("Could not cache FAQs for Local Agent:", err);
            }
        };
        fetchFaqs();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen, messages, isLoading]);

    const toggleChat = () => setIsOpen(!isOpen);

    // Core Knowledge for Local Agent Matching
    const CORE_FACTS = [
        { keywords: ["pratik", "founder", "owner", "director", "tirodkar"], answer: "Pratik Tirodkar is the Founder & Owner of PNT Academy and PNT Robotics. He is an innovator recognized by PM Narendra Modi and featured on Shark Tank India." },
        { keywords: ["location", "address", "where", "dombivli", "office"], answer: "We are located at Plot no. A115, Infinity Business Park, MIDC, Dombivli East, Maharashtra 421203." },
        { keywords: ["contact", "phone", "call", "whatsapp", "mobile", "email"], answer: "Contact us at +91 93260 14648 or +91 81691 96916. Email: contact@pntrobotics.com." },
        { keywords: ["course", "program", "training", "learn", "robotics", "ai"], answer: "We offer Robotics, AI, and IoT training for 4th to 12th grade students, including lab setups for schools and elite internships." },
        { keywords: ["internship", "navy", "army", "projects"], answer: "We provide specialized internships based on real-world projects with the Indian Army and Navy." }
    ];

    const processLocalQuery = (query: string) => {
        const lowQuery = query.toLowerCase();

        // 1. Check Dynamic FAQs
        const faqMatch = localKnowledge.find(f =>
            lowQuery.includes(f.question.toLowerCase()) ||
            f.question.toLowerCase().split(' ').some(word => word.length > 3 && lowQuery.includes(word))
        );
        if (faqMatch) return faqMatch.answer;

        // 2. Check Core Facts
        const factMatch = CORE_FACTS.find(f =>
            f.keywords.some(k => lowQuery.includes(k))
        );
        if (factMatch) return factMatch.answer;

        return null;
    };

    const handleFeedback = async (index: number, type: "up" | "down") => {
        const aiMsg = messages[index];
        const userMsg = messages[index - 1]; // Previous message is user's query
        if (!aiMsg || !userMsg || aiMsg.feedback) return;

        // Optimistically update UI
        setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[index] = { ...newMsgs[index], feedback: type };
            return newMsgs;
        });

        try {
            await fetch("/api/chat/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userMessage: userMsg.content,
                    aiResponse: aiMsg.content,
                    isThumbsUp: type === "up",
                }),
            });
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setIsError(false);
        setIsLocalMode(false);

        const currentMessages: Message[] = [...messages, { role: "user", content: userMessage }];
        setMessages(currentMessages);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: currentMessages
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 429) {
                    // Rate limited — show polite throttle message, don't fallback
                    setMessages(prev => [...prev, {
                        role: "model",
                        content: data.error || "Please wait a moment before sending another message."
                    }]);
                    setIsLoading(false);
                    return;
                }
                if (data.fallbackTrigger) {
                    throw new Error(data.error || "Server fallback requested");
                }
                throw new Error("Network response was not ok");
            }

            const contentType = response.headers.get("Content-Type") || "";

            // Handle JSON response (Gemini fallback)
            if (contentType.includes("application/json")) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: "model", content: data.reply }]);
            } else {
                // Handle Streaming response (Groq primary)
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                if (!reader) throw new Error("Failed to initialize stream reader.");

                setMessages(prev => [...prev, { role: "model", content: "" }]);
                let accumulatedStreamingText = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedStreamingText += chunk;

                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = {
                            role: "model",
                            content: accumulatedStreamingText
                        };
                        return newMessages;
                    });
                }
            }

        } catch (error) {
            console.warn("Cloud AI unreachable, switching to Robo-Local Shield:", error);

            // Trigger Local Agent Fallback
            const localReply = processLocalQuery(userMessage);
            setIsLocalMode(true);

            if (localReply) {
                setMessages(prev => [...prev, {
                    role: "model",
                    content: `(Local Knowledge Active) ⚡ Bypassing to Secure Local Buffer! 🛡️\n\n${localReply}`
                }]);
            } else {
                setIsError(true);
                setMessages(prev => [...prev, {
                    role: "model",
                    content: "🚨 CRITICAL ERROR: My cloud processors are offline and my local archives don't have a match for this specific query. \n\nPlease patch through to Pratik's team directly via the links below! 🤖🛠️"
                }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-0 right-0 z-[100] pointer-events-none mb-16 md:mb-0">
            {/* Pulsing AI Bubble */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleChat}
                        className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.5)] flex items-center justify-center pointer-events-auto transition-all group overflow-hidden border border-white/20 backdrop-blur-xl"
                    >
                        <Bot className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform text-white drop-shadow-md" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse shadow-lg" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
                        className="absolute bottom-4 right-4 w-[calc(100vw-32px)] h-[calc(100dvh-32px)] md:bottom-6 md:right-6 md:w-[420px] md:h-[650px] pointer-events-auto flex flex-col z-20"
                    >
                        <div className="flex-1 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative ring-1 ring-black/5">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 flex items-center justify-between text-white shrink-0 shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                                            <Bot className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse shadow-md"></span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-base tracking-tight text-white drop-shadow-sm">PNT Chatbot</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={`text-[10px] uppercase font-black tracking-[0.1em] transition-colors duration-300 ${isLocalMode ? "text-orange-300" : "text-blue-100 opacity-90"}`}>
                                                {isLocalMode ? "Local Shield Active" : "Cloud Core Systems Active"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 relative z-10">
                                    <button onClick={toggleChat} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:rotate-90">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-950/50">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20, y: 10 }}
                                        animate={{ opacity: 1, x: 0, y: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "justify-start"}`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${msg.role === "user"
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-500/30"
                                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                            }`}>
                                            {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />}
                                        </div>
                                        <div className={`max-w-[85%] group rounded-[1.5rem] p-4 text-sm leading-relaxed shadow-sm ring-1 ${msg.role === "user"
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none ring-blue-500/20"
                                            : "bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none ring-black/5 dark:ring-white/5 backdrop-blur-md"
                                            }`}>

                                            {msg.role === "model" && msg.content.startsWith("(Local Knowledge Active)") && (
                                                <div className="mb-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-500/30">
                                                        Local Fallback Agent
                                                    </span>
                                                </div>
                                            )}

                                            <div className="prose prose-sm dark:prose-invert prose-p:my-0.5 max-w-none font-medium text-inherit">
                                                <ReactMarkdown>
                                                    {msg.content.replace("(Local Knowledge Active) ", "")}
                                                </ReactMarkdown>
                                            </div>

                                            {/* Feedback Buttons for AI */}
                                            {msg.role === "model" && i > 0 && !msg.content.includes("CRITICAL ERROR") && (
                                                <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleFeedback(i, "up")}
                                                        disabled={!!msg.feedback}
                                                        className={`p-1.5 rounded-md transition-colors ${msg.feedback === "up" ? "text-green-500 bg-green-50 dark:bg-green-500/10 opacity-100" : "text-slate-400 hover:text-green-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"}`}
                                                        title="Good response"
                                                    >
                                                        <ThumbsUp className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleFeedback(i, "down")}
                                                        disabled={!!msg.feedback}
                                                        className={`p-1.5 rounded-md transition-colors ${msg.feedback === "down" ? "text-red-500 bg-red-50 dark:bg-red-500/10 opacity-100" : "text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"}`}
                                                        title="Bad response"
                                                    >
                                                        <ThumbsDown className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Contact Sales Fallback UI */}
                                            {isError && i === messages.length - 1 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-5 pt-5 border-t border-white/20 dark:border-slate-700 flex flex-col gap-2.5"
                                                >
                                                    <a
                                                        href="https://wa.me/919326014648"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-center font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                                                    >
                                                        Quick WhatsApp Help
                                                    </a>
                                                    <a
                                                        href="/contact"
                                                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white dark:text-white rounded-xl text-center font-black transition-all border border-white/20 text-xs uppercase tracking-wider"
                                                    >
                                                        Talk to Sales Team
                                                    </a>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-4 justify-start"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
                                            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                                        </div>
                                        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-[1.5rem] rounded-tl-none p-5 border border-white/20 dark:border-slate-700 shadow-sm ring-1 ring-black/5">
                                            <div className="flex gap-1.5">
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 shrink-0 relative">
                                <form onSubmit={handleSendMessage} className="relative group">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about PNT Robotics..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-0 disabled:scale-90 transition-all active:scale-95"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                                <p className="text-[10px] text-center mt-3 text-slate-400 font-medium tracking-wider">Powered by PNT AI Core v2.5 (Hybrid)</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
