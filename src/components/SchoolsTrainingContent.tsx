"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, BookOpen, Users, Trophy, 
    ArrowRight, Star, GraduationCap, Cpu, Code, 
    Shield, BarChart, FileCheck, Zap, Rocket,
    Wrench, Globe, Brain, Lightbulb, Cog, ExternalLink
} from "lucide-react";
import { getLiveSchools } from "@/lib/actions/db";
import TestimonialsSlider from "./TestimonialsSlider";

// Videos are auto-fetched from /api/admin/videos (auto-detects /public/videos/)

// ── Rotating hero text phrases ──────────────────────────────────────
const ROTATING_WORDS = [
    "Robotics",
    "Artificial Intelligence",
    "Drone Technology",
    "Cyber Security",
    "3D Printing",
    "IoT & Smart Devices",
];

// ── Fallback school names ───────────────────────────────────────────
const STATIC_FALLBACK_SCHOOLS = [
    { id: '1', name: "THE RAJAS INTERNATIONAL SCHOOL", imageUrl: "" },
    { id: '2', name: "ORION ICSE", imageUrl: "" },
    { id: '3', name: "DSK SCHOOL", imageUrl: "" },
    { id: '4', name: "MRIS", imageUrl: "" },
    { id: '5', name: "BIRLA INSTITUTE OF TECHNOLOGY & SCIENCE, PILANI", imageUrl: "" },
    { id: '6', name: "Vishwashanti Gurukul School", imageUrl: "" },
    { id: '7', name: "Sloka International School", imageUrl: "" },
    { id: '8', name: "NES International School", imageUrl: "" },
    { id: '9', name: "C.B.M. HIGH SCHOOL", imageUrl: "" },
    { id: '10', name: "TCIS The Cambria International School", imageUrl: "" },
    { id: '11', name: "JIJAMATA CONVENT SCHOOL", imageUrl: "" },
];

// ── ALL 17 2-Day Workshop Modules ─────────────────────────────────────────
const WORKSHOP_MODULES = [
    { title: "Warehouse Robots", icon: Cpu, desc: "Make an Autonomous Robot which can follow a line, identify an Obstacle and manage delivery of parcels.", backDesc: "Make an Autonomous Robot which can follow a line, identify an Obstacle and manage delivery of parcels." },
    { title: "Industrial Humanoid Robot", icon: Users, desc: "Mini humanoid robots are fun, programmable devices that walk using microcontrollers.", backDesc: "Mini humanoid robots are fun, programmable devices that walk using microcontrollers." },
    { title: "3D Gaming", icon: Trophy, desc: "Interactive games with three-dimensional graphics—height, width, and depth.", backDesc: "Interactive games with three-dimensional graphics—height, width, and depth." },
    { title: "Solar Panel & Smart Energy", icon: Lightbulb, desc: "Use the sun to build your own fun, solar-powered car with cool solar panels.", backDesc: "Use the sun to build your own fun, solar-powered car with cool solar panels." },
    { title: "3D Printing", icon: Cog, desc: "Turns computer designs into real 3D objects by building them layer by layer.", backDesc: "Turns computer designs into real 3D objects by building them layer by layer." },
    { title: "Android App Development", icon: Globe, desc: "Use the Android OS to create your own apps like a music player, gallery, or mail app.", backDesc: "Use the Android OS to create your own apps like a music player, gallery, or mail app." },
    { title: "Python", icon: Code, desc: "Beginner-friendly, high-level programming language designed to be easy to read.", backDesc: "Beginner-friendly, high-level programming language designed to be easy to read." },
    { title: "IoT", icon: Zap, desc: "Connects everyday objects using electronics and software so they can collect and share data.", backDesc: "Connects everyday objects using electronics and software so they can collect and share data." },
    { title: "Mobi-Robotics", icon: Wrench, desc: "A simple robotics project controlled by a phone—like a line follower or object avoider.", backDesc: "A simple robotics project controlled by a phone—like a line follower or object avoider." },
    { title: "Medical Robot", icon: Wrench, desc: "Prototype version to deliver food and medicine.", backDesc: "Prototype version to deliver food and medicine." },
    { title: "Chat GPT", icon: Brain, desc: "Teach students how to build their own chatbot!", backDesc: "Teach students how to build their own chatbot!" },
    { title: "Smart Farming", icon: Globe, desc: "Using sensors to predict weather and help farmers, just like a weather forecasting robot.", backDesc: "Using sensors to predict weather and help farmers, just like a weather forecasting robot." },
    { title: "Artificial Intelligence", icon: Brain, desc: "Creating smart machines that think and act like humans.", backDesc: "Creating smart machines that think and act like humans." },
    { title: "Web Designing", icon: Globe, desc: "Skills and techniques to create functional and visually appealing websites.", backDesc: "Skills and techniques to create functional and visually appealing websites." },
    { title: "Cyber Security", icon: Shield, desc: "Protects computers, networks, and data from malicious attacks.", backDesc: "Protects computers, networks, and data from malicious attacks." },
    { title: "Virtual Reality", icon: Star, desc: "Computer-generated worlds with realistic scenes and objects.", backDesc: "Computer-generated worlds with realistic scenes and objects." },
    { title: "Industrial Robotic Arm", icon: Cpu, desc: "Learn robotic mechanics by designing and programming robotic arms.", backDesc: "Learn robotic mechanics by designing and programming robotic arms." },
];

// ── Impact Statistics ────────────────────────────────────────────────
const STATS = [
    { value: 100, suffix: "+", label: "Schools Partnered" },
    { value: 25000, suffix: "+", label: "Students Trained" },
    { value: 17, suffix: "", label: "Workshop Modules" },
    { value: 50, suffix: "+", label: "Certified Trainers" },
];

// ── Core Programs ────────────────────────────────────────────────────
const CORE_PROGRAMS = [
    { title: "Robotics Lab Setup", icon: Cpu, desc: "We design, equip, and set up complete STEM robotics labs with professional-grade kits, workbenches, and tools.", color: "from-blue-500 to-cyan-500" },
    { title: "AI & Coding Curriculum", icon: Code, desc: "Structured year-long AI, Python, and computational thinking courses aligned with NEP 2020 framework.", color: "from-purple-500 to-pink-500" },
    { title: "Teacher Training", icon: GraduationCap, desc: "Intensive 40-hour hands-on certification programs that upskill your educators to teach robotics and AI.", color: "from-orange-500 to-red-500" },
    { title: "Hackathons & Competitions", icon: Trophy, desc: "We prepare students for national-level hackathons, tech fests, and robotics olympiads with dedicated mentorship.", color: "from-green-500 to-emerald-500" },
];

// ── 6-Step Implementation Journey ──────────────────────────────────────
const IMPLEMENTATION_JOURNEY = [
    { step: "01", title: "Schedule a Call", desc: "Book a consultation with our experts to discuss your school's vision and requirements." },
    { step: "02", title: "Select a Program", desc: "Choose from our 2 Days Training Program, STEM Coding curriculum, Robotics Lab setup, or Bootcamp training." },
    { step: "03", title: "Teacher & Kits Assigned", desc: "A dedicated PNT educator is assigned, and high-quality robotics kits are dispatched to your school." },
    { step: "04", title: "Execution of Programs", desc: "Hands-on, curriculum-aligned sessions begin with your students, fostering real-world tech skills." },
    { step: "05", title: "Internship (Kavach Project)", desc: "Top students receive opportunities to work on the prestigious Kavach Cyber Security/Robotics project." },
    { step: "06", title: "Robotics Championship", desc: `Students showcase their innovations at our annual National Robotics Championship ${new Date().getFullYear()}-${new Date().getFullYear() + 1}.` },
];

// ── 5-Step Learning Journey ───────────────────────────────────────────
const LEARNING_JOURNEY = [
    { step: "01", title: "Robotics Curriculum", desc: "Master block coding, logic, and hardware assembly.", icon: Lightbulb },
    { step: "02", title: "Kavach Program", desc: "Engage in our specialized cyber security and IoT modules.", icon: Shield },
    { step: "03", title: "Code Submission", desc: "Students submit their capstone projects and smart programs.", icon: Code },
    { step: "04", title: "Video Presentation", desc: "Pitching and presenting the functional prototypes on video.", icon: FileCheck },
    { step: "05", title: "IIT Finale", desc: "Compete at the grand finale hosted at premier IIT campuses.", icon: Trophy },
];

// ── Grade-Wise Project Explorer (Individual Grades 1–10) ─────────────
const GRADE_EXPLORER_DATA = [
    {
        grade: "Grade 1",
        title: "Foundations of Electricity",
        desc: "Simple circuits, switches and basic electronic concepts.",
        tags: ["Table Lamp", "Fire Alarm Game", "Door Bell", "Electric Fan"],
        color: "bg-blue-500"
    },
    {
        grade: "Grade 2",
        title: "Electromagnetism & Mechanisms",
        desc: "Electromagnetic principles and simple automated systems.",
        tags: ["Make your own Electromagnet", "Elevator", "Street Lamp Project", "Traffic Light System"],
        color: "bg-cyan-500"
    },
    {
        grade: "Grade 3",
        title: "Motion & Energy",
        desc: "Motion, energy conversion and introductory robotics.",
        tags: ["Windmill", "Military Tank", "Walking Robot", "Hand Electricity Generator"],
        color: "bg-violet-500"
    },
    {
        grade: "Grade 4",
        title: "Solar & Remote Technology",
        desc: "Renewable energy, remote control systems and cranes.",
        tags: ["Solar Car", "Solar Fan", "Soap Dispenser", "Remote Control Car", "Electromagnet Crane"],
        color: "bg-green-500"
    },
    {
        grade: "Grade 5",
        title: "Smart Automation Systems",
        desc: "Autonomous robots, security systems and smart home tech.",
        tags: ["Amazon Warehouse Robot", "Obstacle Avoider Robot", "Line Follower Robot", "Theft Detection", "Security Alarm", "Touchless Door Bell"],
        color: "bg-yellow-500"
    },
    {
        grade: "Grade 6",
        title: "Sensors & Humanoid Bots",
        desc: "Sensor integration, real-time systems and bipedal robots.",
        tags: ["Real-time Street Light System", "Distance Measurement", "People Counter", "Smart Blind Stick", "Walking Robot", "Dancing Robot"],
        color: "bg-orange-500"
    },
    {
        grade: "Grade 7",
        title: "Joystick Control & IoT",
        desc: "Joystick-controlled robots, app control and smart systems.",
        tags: ["Humanoid Robot with Joystick", "Android App Robot Control", "Smart Dustbin", "Smart Water Tank", "Smart Hand Sanitizer"],
        color: "bg-red-500"
    },
    {
        grade: "Grade 8",
        title: "Electronics & Software Projects",
        desc: "Digital systems, displays and functional software applications.",
        tags: ["Smart Door Lock", "Digital Clock", "Snake Game", "Smart Calculator", "Virtual Meeting Software"],
        color: "bg-pink-500"
    },
    {
        grade: "Grade 9",
        title: "AI & Computer Vision",
        desc: "Machine learning, image recognition and AI-powered applications.",
        tags: ["Gender Detection", "Face Mask Detection", "Chatbot", "Age & Gender ML Python", "Emotion Detection"],
        color: "bg-indigo-500"
    },
    {
        grade: "Grade 10",
        title: "Data Science & Prediction Models",
        desc: "Real-world ML models, classification and gesture recognition.",
        tags: ["Walmart Forecasting", "Cancer Prediction", "Diabetes Prediction", "Gesture Recognition", "IRIS Classification"],
        color: "bg-emerald-500"
    },
];

// ── Specific School Testimonials ─────────────────────────────────────
const SCHOOL_TESTIMONIALS = [
    {
        name: "Mrs. Deena Rawat",
        role: "Principal, CBM High School",
        quote: "The robotics curriculum introduced by PNT Academy has been a game-changer. The blend of practical activities and conceptual learning has ignited curiosity and creativity. It is truly heartening to see such innovation become an integral part of our school's academic journey."
    },
    {
        name: "Mrs. Suchita Singh",
        role: "Principal, SVVNS School, Pune",
        quote: "PNT Academy has brought a refreshing wave of futuristic learning to SVVNS. The hands-on projects have helped children grasp complex concepts effortlessly. We believe this exposure will give them a strong foundation for life."
    },
    {
        name: "Mr. Bhushan",
        role: "Principal, Cambria International School, Kalyan",
        quote: "Partnering with PNT Academy has been one of the most impactful decisions for our school. The sessions are interactive, engaging, and tailored to different learning levels. The feedback from parents and students has been overwhelmingly positive."
    }
];

// ── Why Choose Us ────────────────────────────────────────────────────
const WHY_CHOOSE = [
    { title: "NEP 2020 Aligned", desc: "Our curriculum is fully aligned with India's National Education Policy for experiential and skill-based learning.", icon: FileCheck },
    { title: "Shark Tank Featured", desc: "PNT Academy was recognized and featured on Shark Tank India for our innovative approach to tech education.", icon: Star },
    { title: "Real Hardware Kits", desc: "No simulations. Students work with actual Arduino boards, sensors, drones, and 3D printers in every session.", icon: Wrench },
    { title: "End-to-End Support", desc: "From lab setup to teacher training to student assessments — we handle the entire tech education lifecycle.", icon: Users },
    { title: "Proven Track Record", desc: "With 100+ schools and 25,000+ students trained, our programs deliver measurable learning outcomes.", icon: Trophy },
    { title: "Government Recognized", desc: "Registered under Startup India and recognized by MSME for contributions to STEM education nationwide.", icon: Shield },
];

// ── Inclusions ───────────────────────────────────────────────────────
const INCLUSIONS = [
    { title: "Curriculum", icon: BookOpen, desc: "Structured, NEP 2020 aligned syllabus." },
    { title: "Softwares", icon: Code, desc: "Access to all required proprietary & open-source software." },
    { title: "Training & Delivery", icon: Users, desc: "Expert trainers and systematic classroom delivery." },
    { title: "Assessment", icon: FileCheck, desc: "Regular evaluation and progress tracking." },
    { title: "Competitions", icon: Trophy, desc: "National & state-level robotics championships." },
    { title: "ToolsKit", icon: Wrench, desc: "Comprehensive hardware kits for every student." },
];

// ── Why Coding ───────────────────────────────────────────────────────
const WHY_CODING = [
    { title: "Create Future Innovators", desc: "By coding early, students start building real applications and software.", icon: Rocket },
    { title: "Develop Logical Skills", desc: "Early learning develops strong logical and analytical thinking skills.", icon: Brain },
    { title: "Problem Solving", desc: "Enhances problem-solving capability and computational thinking.", icon: Lightbulb },
    { title: "Gain Recognition", desc: "Start participating and winning in various national coding competitions.", icon: Trophy },
];

// ═══════════════════════════════════════════════════════════════════════
// COUNT-UP NUMBER COMPONENT (on-load only, no hover)
// ═══════════════════════════════════════════════════════════════════════
function CountUpNumber({ value, suffix }: { value: number; suffix: string }) {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (isInView && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 2200;
            const steps = 60;
            const stepTime = Math.floor(duration / steps);
            const increment = value / steps;
            let current = 0;
            let stepCount = 0;

            const timer = setInterval(() => {
                stepCount++;
                // Easing: accelerate then decelerate
                const progress = stepCount / steps;
                const easedProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                current = Math.floor(easedProgress * value);
                
                if (stepCount >= steps) {
                    setDisplayValue(value);
                    clearInterval(timer);
                } else {
                    setDisplayValue(current);
                }
            }, stepTime);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <div ref={ref} className="text-3xl md:text-5xl font-black text-white tabular-nums">
            {displayValue.toLocaleString()}{suffix}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// SEAMLESS VIDEO BACKGROUND (auto-fetches from API, crossfade 0.5s)
// ═══════════════════════════════════════════════════════════════════════
function SeamlessVideoHero() {
    const [videoUrls, setVideoUrls] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Auto-fetch video list from the API (picks up any file in /public/videos/)
    useEffect(() => {
        fetch("/api/admin/videos")
            .then((res) => res.json())
            .then((data: any[]) => {
                if (data && data.length > 0) {
                    setVideoUrls(data.map((v) => {
                        let url = v.url;
                        const trims = [];
                        if (v.startTime > 0) trims.push(`so_${v.startTime}`);
                        if (v.endTime > 0) trims.push(`eo_${v.endTime}`);
                        
                        if (trims.length > 0 && url.includes("/upload/")) {
                            url = url.replace("/upload/", `/upload/${trims.join(",")}/`);
                        }
                        return url;
                    }));
                } else {
                    // Fallback in case API fails
                    setVideoUrls(["/videos/Students_Build_Robots_Cinematic_Montage.mp4"]);
                }
            })
            .catch(() => {
                setVideoUrls(["/videos/Students_Build_Robots_Cinematic_Montage.mp4"]);
            });
    }, []);

    const handleVideoEnd = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % (videoUrls.length || 1));
    }, [videoUrls.length]);

    useEffect(() => {
        if (videoUrls.length === 0) return;
        const currentVideo = videoRefs.current[currentIndex];
        if (currentVideo) {
            currentVideo.currentTime = 0;
            currentVideo.play().catch(() => {});
        }
    }, [currentIndex, videoUrls]);

    if (videoUrls.length === 0) return null;

    return (
        <div className="absolute inset-0 w-full h-full z-0 hidden md:block">
            {videoUrls.map((src, i) => (
                <video
                    key={src}
                    ref={(el) => { videoRefs.current[i] = el; }}
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    src={src}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    style={{ opacity: currentIndex === i ? 1 : 0 }}
                />
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// ROTATING TEXT ANIMATION (full-width, no clipping)
// ═══════════════════════════════════════════════════════════════════════
function RotatingText() {
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % ROTATING_WORDS.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <span className="block w-full h-[1.2em] relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.span
                    key={currentWord}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-x-0 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                >
                    {ROTATING_WORDS[currentWord]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function SchoolsTrainingContent({ championshipLink = "/championship" }: { championshipLink?: string }) {
    const [liveSchools, setLiveSchools] = useState<any[]>([]);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
    const [activeGrade, setActiveGrade] = useState(0);

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const yearString = `${currentYear}-${nextYear}`;

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const schools = await getLiveSchools();
                if (schools && schools.length > 0) {
                    setLiveSchools(schools);
                } else {
                    setLiveSchools(STATIC_FALLBACK_SCHOOLS);
                }
            } catch (err) {
                console.error("Failed to load schools:", err);
                setLiveSchools(STATIC_FALLBACK_SCHOOLS);
            }
        };
        fetchSchools();
    }, []);

    const marqueeRow1 = [...liveSchools, ...liveSchools, ...liveSchools];
    const marqueeRow2 = [...liveSchools.slice().reverse(), ...liveSchools.slice().reverse(), ...liveSchools.slice().reverse()];

    return (
        <div className="w-full flex flex-col pt-20 relative z-10">

            {/* ═══════════════════════════════════════════════════════════
                SECTION 0: CINEMATIC SEAMLESS VIDEO HERO
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Desktop: Seamless multi-video crossfade */}
                <SeamlessVideoHero />
                
                {/* Mobile: Gradient fallback */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50/90 via-white/70 to-purple-50/90 dark:from-slate-900/90 dark:via-blue-950/70 dark:to-purple-950/90 block md:hidden z-0" />

                {/* Overlay */}
                <div className="absolute inset-0 z-[1] bg-white/50 dark:bg-slate-900/70 backdrop-blur-[3px]"></div>

                {/* Floating particles */}
                <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-blue-500/30 dark:bg-blue-400/20"
                            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                            animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                        />
                    ))}
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-0 flex flex-col items-center justify-center text-center py-20 md:py-32">
                    
                    {/* Championship Banner — prominently styled */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <Link 
                            href="/championship"
                            className="group inline-flex items-center gap-4 px-7 py-4 rounded-2xl backdrop-blur-xl border border-blue-300/60 dark:border-blue-500/50 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.92) 0%, rgba(79,70,229,0.92) 60%, rgba(124,58,237,0.92) 100%)' }}
                        >
                            {/* Shimmer */}
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                            {/* Pulsing live dot */}
                            <span className="relative flex h-3.5 w-3.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-80" />
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-300" />
                            </span>
                            {/* Trophy */}
                            <span className="text-3xl leading-none">🏆</span>
                            {/* Text block */}
                            <span className="flex flex-col items-start">
                                <span className="text-yellow-200 text-[10px] font-black uppercase tracking-[0.2em]">Now Open for Registration</span>
                                <span className="text-white text-base md:text-xl font-black tracking-wide leading-tight">National Robotics Championship {yearString}</span>
                            </span>
                            {/* Arrow */}
                            <span className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/30 text-white text-sm group-hover:translate-x-1 transition-transform shrink-0">
                                →
                            </span>
                        </Link>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-6 w-full max-w-4xl"
                    >
                        <span className="block">Learn</span>
                        <RotatingText />
                        <span className="block">at Your School</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-3xl text-lg md:text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-10"
                    >
                        Delivering hands-on workshops, real-world projects, and industry exposure to prepare your students for the careers of tomorrow.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link href="/contact" className="px-10 py-5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 group text-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] mx-auto inline-flex">
                            Partner with Us
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1: IMPACT STATS (COUNT-UP ON LOAD)
            ═══════════════════════════════════════════════════════════ */}
            <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-purple-600 relative z-10 overflow-hidden">
                <motion.div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
                <motion.div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 5, repeat: Infinity }} />
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                    {STATS.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="flex flex-col items-center"
                        >
                            <CountUpNumber value={stat.value} suffix={stat.suffix} />
                            <div className="text-blue-100 text-sm md:text-base font-medium mt-2">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2: SINGLE-RAIL LOGO TICKER
            ═══════════════════════════════════════════════════════════ */}
            <section className="w-full py-16 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0 mb-8">
                    <h3 className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2">
                        TRUSTED BY 100+ SCHOOLS ACROSS INDIA
                    </h3>
                    <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                        From Pune to Delhi, our programs are transforming classrooms into innovation hubs.
                    </p>
                </div>

                <div className="w-full overflow-hidden relative">
                    <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                    <motion.div 
                        className="flex gap-12 items-center whitespace-nowrap min-w-max py-4"
                        animate={{ x: [0, -1200] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
                    >
                        {marqueeRow1.map((school, i) => (
                            <LogoPill key={`r1-${i}`} school={school} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3: CORE PROGRAMS
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">OUR OFFERINGS</motion.p>
                        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Comprehensive Tech Curriculums</motion.h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Equip your institution with structured programs from foundational hardware to advanced AI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CORE_PROGRAMS.map((core, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-8 rounded-2xl hover:border-blue-500/50 hover:shadow-xl transition-shadow group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${core.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <core.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{core.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{core.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4: WHY PNT ACADEMY
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <p className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">WHY PNT ACADEMY?</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">What Makes Us Different</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">We don&apos;t just teach — we transform your school into a centre of tech innovation.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {WHY_CHOOSE.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-purple-500/40 hover:shadow-lg transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                                    <item.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4.5: PROGRAM INCLUSIONS
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-white dark:bg-black/80 relative z-10 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">WHAT YOU GET</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Program Inclusions</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-6" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {INCLUSIONS.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl transition-all group"
                            >
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                                    <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4.7: WHY CODING
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-slate-50 dark:bg-slate-900/30 relative z-10 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-sm mb-3">EARLY ADVANTAGE</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Why Teach Coding?</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mt-6" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {WHY_CODING.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 5: 1-YEAR STEM CURRICULUM & GRADE EXPLORER
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-slate-100 dark:bg-black/40 relative z-10 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="w-full lg:w-1/2">
                            <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">COMPREHENSIVE PROGRAM</p>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">1-Year STEM Robotics Curriculum</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                                Transform your school&apos;s tech education with our flagship year-long curriculum. From grade 1 to 10, students evolve from basic block coding to complex Python AI and robotics engineering.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">42+</div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Hands-on Projects</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                    <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">100%</div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">NEP 2020 Aligned</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">1st-10th</div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Grade Coverage</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                    <div className="text-3xl font-black text-orange-600 dark:text-orange-400 mb-1">24/7</div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Technical Support</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 relative flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl">
                            <div className="bg-white/90 dark:bg-slate-900/90 p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 backdrop-blur-xl flex flex-col h-full relative z-10 w-full">
                                
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                                        <GraduationCap className="w-8 h-8 text-blue-500" />
                                        Interactive Curriculum
                                    </h3>
                                </div>
                                
                                {/* Grade Chips Row */}
                                <div className="flex overflow-x-auto gap-2.5 pb-4 mb-4 mt-2 custom-scrollbar select-none" style={{ scrollSnapType: 'x mandatory' }}>
                                    {GRADE_EXPLORER_DATA.map((grade, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveGrade(i)}
                                            style={{ scrollSnapAlign: 'start' }}
                                            className={`whitespace-nowrap flex-shrink-0 px-6 py-3 rounded-full text-sm font-black transition-all duration-300 ${activeGrade === i ? grade.color + ' text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105'}`}
                                        >
                                            {grade.grade}
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Selected Grade Content */}
                                <div className="relative flex-grow flex flex-col min-h-[350px]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeGrade}
                                            initial={{ opacity: 0, x: 20, scale: 0.98 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: -20, scale: 0.98 }}
                                            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                                            className="flex flex-col flex-grow bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 p-6 md:p-8 rounded-3xl shadow-inner relative overflow-hidden"
                                        >
                                            {/* Decorative Background Glow */}
                                            <div className={`absolute -right-12 -top-12 w-64 h-64 ${GRADE_EXPLORER_DATA[activeGrade].color} opacity-10 dark:opacity-20 blur-[60px] rounded-full pointer-events-none`} />
                                            <div className={`absolute -left-12 -bottom-12 w-64 h-64 ${GRADE_EXPLORER_DATA[activeGrade].color} opacity-[0.05] dark:opacity-10 blur-[60px] rounded-full pointer-events-none`} />
                                            
                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex items-center gap-5 mb-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl ${GRADE_EXPLORER_DATA[activeGrade].color} shadow-xl shadow-[${GRADE_EXPLORER_DATA[activeGrade].color}]/20 shrink-0`}>
                                                        {activeGrade + 1}
                                                    </div>
                                                    <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                                        {GRADE_EXPLORER_DATA[activeGrade].title}
                                                    </h4>
                                                </div>
                                                
                                                <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-10 flex-grow">
                                                    {GRADE_EXPLORER_DATA[activeGrade].desc}
                                                </p>
                                                
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-5">Key Projects & Deliverables</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {GRADE_EXPLORER_DATA[activeGrade].tags.map((tag, idx) => (
                                                            <span key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-3 transition-transform hover:-translate-y-1">
                                                                <span className={`w-2.5 h-2.5 rounded-full ${GRADE_EXPLORER_DATA[activeGrade].color} shadow-sm`} />
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 6: STUDENT LEARNING JOURNEY
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-transparent relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-sm mb-3">STUDENT EXPERIENCE</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">5-Step Learning Journey</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">How students evolve from absolute beginners to confident innovators.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative max-w-6xl mx-auto">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[45px] left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-emerald-500/10 via-emerald-500/40 to-emerald-500/10 z-0"></div>
                        
                        {LEARNING_JOURNEY.map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative flex flex-col items-center text-center group w-full max-w-[200px]"
                            >
                                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center mb-6 z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                                    <step.icon className="w-8 h-8 text-emerald-500" />
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center border-4 border-slate-50 dark:border-slate-900 transition-colors">
                                        {step.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 7: 17 WORKSHOP MODULES (3D FLIP CARDS)
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">2 TRAINING DAYS PROGRAM</p>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">17 Workshop Modules</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">Double tap/hover to flip these interactive preview cards to view more details.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {WORKSHOP_MODULES.map((module, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 6) * 0.08 }}
                                className="relative h-72 w-full group cursor-pointer"
                                style={{ perspective: "1200px" }}
                                onMouseEnter={() => setFlippedIndex(i)}
                                onMouseLeave={() => setFlippedIndex(null)}
                                onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
                            >
                                <motion.div
                                    animate={{ rotateY: flippedIndex === i ? 180 : 0 }}
                                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 22 }}
                                    className="w-full h-full relative"
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* FRONT */}
                                    <div 
                                        className="absolute w-full h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-7 flex flex-col justify-between shadow-md group-hover:shadow-xl transition-shadow"
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <div>
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-md shrink-0">
                                                    <module.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{module.title}</h3>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{module.desc}</p>
                                        </div>
                                        <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-700/50 mt-auto">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                                                Tap/Hover to view details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* BACK */}
                                    <div 
                                        className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-7 flex flex-col justify-between shadow-lg"
                                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-3">{module.title}</h3>
                                            <p className="text-blue-100 text-sm leading-relaxed">{module.backDesc}</p>
                                        </div>
                                        <div className="flex flex-col gap-3 pt-4 border-t border-white/20 mt-auto">
                                            <button className="w-full py-3 bg-white text-blue-600 font-black rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-all active:scale-95">
                                                Book Workshop
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 8: IMPLEMENTATION JOURNEY TIMELINE
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm relative z-10">
                <div className="max-w-4xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">HOW IT WORKS</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Implementation Journey</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto mt-4">A structured, 6-step process from initial consultation to continuous student engagement.</p>
                    </div>
                    
                    <div className="relative border-l-2 border-blue-200 dark:border-slate-700 ml-6 md:ml-12 pl-8 md:pl-16 space-y-14">
                        {IMPLEMENTATION_JOURNEY.map((step, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="relative group"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.15, rotate: 360 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="absolute -left-[45px] md:-left-[77px] top-0 w-12 h-12 bg-white dark:bg-slate-900 border-[3px] border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                >
                                    {step.step}
                                </motion.div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 9: TESTIMONIALS SLIDER
            ═══════════════════════════════════════════════════════════ */}
            <TestimonialsSlider staticData={SCHOOL_TESTIMONIALS} category="schools" title="Teacher Testimonials" subtitle="What Educators Say" />

            {/* ═══════════════════════════════════════════════════════════
                SECTION 10: FINAL CTA
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-transparent relative z-10">
                <div className="max-w-4xl mx-auto px-4 md:px-8 xl:px-0 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-20 shadow-2xl relative overflow-hidden"
                    >
                        <motion.div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} />
                        <motion.div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-300/10 rounded-full blur-2xl" animate={{ scale: [1.3, 1, 1.3], y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} />

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight relative z-10">Ready to Transform Your School?</h2>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
                            Join the 100+ schools that have already future-proofed their students. Get a free consultation and customized program proposal.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link href="/contact" className="px-10 py-5 rounded-xl font-bold text-blue-700 bg-white hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center gap-2 group text-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)]">
                                Schedule a Free Consultation
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="tel:+919326014648" className="px-10 py-5 rounded-xl font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1">
                                📞 Call Us Now
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// LOGO PILL COMPONENT
// ═══════════════════════════════════════════════════════════════════════
function LogoPill({ school }: { school: any }) {
    if (school.imageUrl) {
        return (
            <div className="relative h-20 w-48 md:h-24 md:w-56 shrink-0 hover:scale-110 transition-transform">
                <Image src={school.imageUrl} alt={school.name || "School Logo"} fill className="object-contain" />
            </div>
        );
    }
    return (
        <div className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shrink-0 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
            {school.name}
        </div>
    );
}
