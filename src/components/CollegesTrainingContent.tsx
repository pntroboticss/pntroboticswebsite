"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const NetworkBackground = dynamic(
    () => import('@/components/NetworkBackground'),
    { ssr: false }
);
import { 
    Activity, Navigation, Settings, RadioTower, Hand, 
    ChevronDown, CheckCircle2, Award, Briefcase, FileCheck, Calendar, List, Download, Mail,
    ArrowRight, Star, Quote, Microchip, GraduationCap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ClientOnly from "@/components/ClientOnly";

type ProgramDay = {
    day: string;
    title: string;
    topics: string[];
};

type Program = {
    id: string;
    level: "Basic" | "Intermediate" | "Advanced";
    duration: string;
    title: string;
    badgeTagline: string;
    icon: React.ElementType<{ className?: string }>;
    shortObjective: string;
    objective: string;
    learningOutcomes: string[];
    days: ProgramDay[];
    color: string;
};

const PROGRAMS: Program[] = [
    {
        id: "basic-robotic-arms",
        level: "Basic",
        duration: "5 Days",
        title: "Basic Level: Robotic Arms",
        badgeTagline: "5-DOF Hardware Build",
        icon: Activity,
        color: "from-blue-500 to-indigo-600",
        shortObjective: "Build, program, and control a 5-DOF robotic arm using microcontrollers.",
        objective: "Teach students how to build, program, and control a 5-DOF robotic arm. Hands-on training with stepper motors, motor drivers, and microcontrollers. Provide open components (drivers, motors, control system) for temporary use. Ensure students can operate the robotic arm independently by the end of the workshop.",
        learningOutcomes: [
            "Understanding of robotic arm components",
            "Selection and sourcing of components",
            "Programming microcontrollers for motor control",
            "Multi-motor coordination and logic building",
            "Debugging and testing robotic movements"
        ],
        days: [
            {
                day: "Day 1",
                title: "Introduction to Robotic Arms",
                topics: [
                    "A robotic arm is a programmable mechanical arm designed to mimic human arm movements. Used in industrial automation, medical applications, defense, and research.",
                    "Common types: Cartesian robots (linear motion), SCARA robots (selective compliance), Articulated robots (multi-joint motion), Delta robots (high-speed picking)",
                    "Components: Motors (Stepper/Servo/DC), Motor Drivers, Microcontrollers (Arduino/ESP32/STM32), Power Supply, Frame & Joints, Sensors (Encoders, limit switches, force sensors)",
                    "Motor Selection Criteria: Torque, speed, precision",
                    "Microcontroller Selection: Processing power, I/O pins",
                    "Driver Selection: Compatible with selected motor",
                    "Sourcing Components: Online platforms, local electronics markets, industrial suppliers"
                ]
            },
            {
                day: "Day 2",
                title: "Microcontrollers & Programming",
                topics: [
                    "Role of microcontrollers in robotics",
                    "Introduction to microcontrollers: Arduino & ESP32",
                    "Comparison of Arduino, ESP32, STM32 — Features: I/O pins, communication interfaces, processing speed",
                    "IDEs: Arduino IDE, PlatformIO",
                    "Basics of C/C++ programming for robotics",
                    "Writing the first program: \"Blinking LED\" as a starting point",
                    "Advanced programming"
                ]
            },
            {
                day: "Day 3",
                title: "Stepper Motor Control with Drivers",
                topics: [
                    "Stepper Motors: High-precision control, divided steps per rotation",
                    "Driver Modules: A4988, DRV8825 (low-power); TB6600 (high-power industrial use)",
                    "Hands-on: Wiring Stepper Motor → Driver → Microcontroller",
                    "Writing code for basic motor control",
                    "Implementing step size and speed adjustments",
                    "Library-based control for smoother operation"
                ]
            },
            {
                day: "Day 4",
                title: "Multi-Motor Control",
                topics: [
                    "Synchronizing multiple stepper motors for joint movement",
                    "Challenges: Power distribution, step synchronization",
                    "Writing code for two-motor movement",
                    "Students test multi-motor control",
                    "Debugging common issues: Skipping steps, misalignment"
                ]
            },
            {
                day: "Day 5",
                title: "Competition Day",
                topics: [
                    "Task: Write code to move the robotic arm to complete a specific task",
                    "Each team gets time to test & refine their program",
                    "Evaluation Criteria: Accuracy of movement, Speed of execution, Efficient coding practices",
                    "Recap of key learnings",
                    "Careers in robotics & industrial automation",
                    "Certificate distribution"
                ]
            }
        ]
    },
    {
        id: "adv-robotic-arms",
        level: "Advanced",
        duration: "5 Days",
        title: "Advanced Level: Robotic Arms",
        badgeTagline: "PC-Based Control & Simulation",
        icon: Activity,
        color: "from-purple-500 to-pink-600",
        shortObjective: "Control robotic arms using computing systems. Introduce software-based control and real-time motion planning.",
        objective: "Train students to control robotic arms using computing systems instead of microcontrollers. Introduce software-based control, real-time motion planning, and automation techniques. Provide a higher level of hands-on training with multi-motor coordination and simulations.",
        learningOutcomes: [
            "Understanding the transition from embedded systems to PC-based robotic control",
            "Implementing real-time motion planning and synchronization",
            "Writing software-based scripts to control robotic arms",
            "Simulating and optimizing robotic movement before execution"
        ],
        days: [
            {
                day: "Day 1",
                title: "Introduction & Component Selection",
                topics: [
                    "Difference between microcontroller-based and PC-based control",
                    "Real-world applications of PC-based robotic arms in industrial automation",
                    "Key components: Stepper Motors & Drivers, Computing Unit (PC-based processing), Communication Interface, Sensors & Feedback Systems",
                    "Choosing motors: Torque, speed, and precision requirements",
                    "Selecting motor drivers compatible with software control",
                    "Understanding real-time control challenges (latency, processing power)",
                    "Where to source high-quality components for industrial applications"
                ]
            },
            {
                day: "Day 2",
                title: "Software Tools & Programming for Robotic Control",
                topics: [
                    "Controlling robotic arms using software instead of microcontrollers",
                    "Overview of high-level programming languages: Python, C++",
                    "Importance of real-time operating environments for robotic motion",
                    "Establishing communication between the computing system and the robotic arm",
                    "Writing a basic script to send movement commands to motors",
                    "Implementing a graphical interface for manual control (optional)"
                ]
            },
            {
                day: "Day 3",
                title: "Stepper Motor Control & Motion Synchronization",
                topics: [
                    "Differences between embedded control vs. software-driven control",
                    "How PC-based control improves multi-motor synchronization",
                    "Handling real-time motor commands in a multi-threaded environment",
                    "Connecting the motor drivers to the computing system",
                    "Sending step pulses from software to control speed and direction",
                    "Implementing motion profiles (acceleration, deceleration)"
                ]
            },
            {
                day: "Day 4",
                title: "Simulation-Based Motion Planning & Control",
                topics: [
                    "Introduction to path planning algorithms",
                    "Writing software routines for coordinated movement of multiple joints",
                    "Preventing collisions and optimizing motion sequences",
                    "Introduction to robotics simulation software",
                    "Simulating robotic arm movement before real-world execution",
                    "Adjusting parameters to optimize speed, torque, and smoothness"
                ]
            },
            {
                day: "Day 5",
                title: "Competition & Project Implementation",
                topics: [
                    "Task: Program the robotic arm to perform an autonomous operation",
                    "Scoring criteria: Accuracy of motion, Efficiency of code, Smoothness of execution",
                    "How software-based robotic control is shaping Industry 4.0",
                    "Career opportunities in automation, robotics, and AI-driven control systems",
                    "Next steps: Building more complex robotic applications",
                    "Certificate distribution & feedback session"
                ]
            }
        ]
    },
    {
        id: "basic-agv",
        level: "Basic",
        duration: "5 Days",
        title: "Basic Level: AGV",
        badgeTagline: "Microcontroller Path Follower",
        icon: Navigation,
        color: "from-emerald-500 to-teal-600",
        shortObjective: "Build a basic AGV (Path Follower) using microcontrollers and sensor-grid navigation.",
        objective: "Train students to build a basic AGV (Path Follower) using microcontrollers. Implement advanced sensor-grid-based grid navigation. Provide hands-on experience in motor control, path following, and debugging.",
        learningOutcomes: [
            "Understanding AGV concepts & applications",
            "Working with microcontrollers for AGV control",
            "Implementing sensor-based navigation",
            "Writing embedded code for AGV operation"
        ],
        days: [
            {
                day: "Day 1",
                title: "Introduction to AGVs & Components",
                topics: [
                    "AGV: A self-guided vehicle used in warehouses, industries, and logistics",
                    "Types of AGVs: Line-followers, LiDAR-based, Vision-based, AMRs",
                    "Key Components: Motors & Drivers, Sensors, Microcontroller",
                    "Motor Selection: Geared DC motors, Servo Motors",
                    "Microcontroller Selection",
                    "Sensor Placement: Array-based for grid detection"
                ]
            },
            {
                day: "Day 2",
                title: "Microcontrollers & Sensor Interfacing",
                topics: [
                    "Introduction to microcontrollers in the industry for AGV applications",
                    "Writing simple motor control programs",
                    "Using Sensors for Auto path Tracking",
                    "Configuring the threshold values for detection",
                    "Debugging sensor data using Serial Monitor"
                ]
            },
            {
                day: "Day 3",
                title: "Autonomous Path Following & Grid Navigation",
                topics: [
                    "Writing basic PID-based motor control logic",
                    "Testing AGV on single-line tracks",
                    "Understanding node-based navigation",
                    "Programming AGV for stop & turn decisions using IR sensors"
                ]
            },
            {
                day: "Day 4",
                title: "Multi-Sensor Integration & Optimization",
                topics: [
                    "Fine-tuning PID parameters for smoother motion",
                    "Avoiding overshoot and oscillations",
                    "Students refine their AGV navigation logic",
                    "Testing on different track layouts"
                ]
            },
            {
                day: "Day 5",
                title: "Competition & Project Implementation",
                topics: [
                    "Challenge: Design a logic-based code for AGV to navigate a complex grid",
                    "Scoring Criteria: Accuracy in navigation, Smoothness of movement, Code efficiency",
                    "Recap of learnings",
                    "Industry applications of AGVs",
                    "Certificate distribution",
                    "Internship selection"
                ]
            }
        ]
    },
    {
        id: "adv-agv",
        level: "Advanced",
        duration: "5 Days",
        title: "Advanced Level: AGV",
        badgeTagline: "ROS + LiDAR Autonomous Nav",
        icon: Navigation,
        color: "from-sky-500 to-blue-600",
        shortObjective: "Develop AGVs using PC-based control, ROS, and LiDAR sensors.",
        objective: "Train students to develop AGVs using PC-based control, ROS, and LiDAR sensors. Implement autonomous navigation and obstacle avoidance.",
        learningOutcomes: [
            "Transition from microcontroller-based to PC-based AGVs",
            "Using ROS for AGV motion planning",
            "Implementing LiDAR-based navigation"
        ],
        days: [
            {
                day: "Day 1",
                title: "AGV Architecture & Sensor Selection",
                topics: [
                    "Difference between embedded control & PC-based control",
                    "Real-world applications of ROS-based AGVs",
                    "Motors & Drivers: Industrial-grade motor selection",
                    "LiDAR Sensors: Mapping & obstacle detection",
                    "ROS-Compatible Computing Unit: PC/Raspberry Pi"
                ]
            },
            {
                day: "Day 2",
                title: "Software Setup & Basic Navigation Control",
                topics: [
                    "Why ROS? Open-source framework for robotic control",
                    "Setting up the ROS environment",
                    "Sending commands to AGV motors via ROS Nodes",
                    "Running basic simulations",
                    "Writing Navigation Scripts in ROS"
                ]
            },
            {
                day: "Day 3",
                title: "LiDAR-Based Mapping & Navigation",
                topics: [
                    "Generating real-time environment maps",
                    "Using SLAM (Simultaneous Localization & Mapping)",
                    "AGV decision-making based on sensor data",
                    "Adjusting navigation parameters dynamically"
                ]
            },
            {
                day: "Day 4",
                title: "Real-Time AGV Operation & Path Optimization",
                topics: [
                    "Obstacle avoidance using sensor fusion",
                    "Dynamic re-routing based on real-time inputs",
                    "Running AGV navigation in a virtual environment",
                    "Testing different track layouts for optimization"
                ]
            },
            {
                day: "Day 5",
                title: "Competition & Project Implementation",
                topics: [
                    "Task: Create a fully autonomous AGV",
                    "Scoring Criteria: Efficient path planning, Real-time obstacle avoidance, Smooth motion transitions",
                    "How AGVs & AMRs are shaping smart industries",
                    "Careers in robotics & autonomous systems",
                    "Certificate distribution & feedback session"
                ]
            }
        ]
    },
    {
        id: "amr",
        level: "Advanced",
        duration: "10 Days",
        title: "AMR (Autonomous Mobile Robot)",
        badgeTagline: "ROS + SLAM + URDF",
        icon: Settings,
        color: "from-orange-500 to-red-600",
        shortObjective: "Deep dive into AMR architecture, ROS-based software stack, SLAM, and URDF modeling.",
        objective: "Comprehensive 10-day deep dive into AMR architecture, hardware interfacing, ROS-based software stack, autonomous navigation, SLAM, LiDAR integration, and URDF robot modeling.",
        learningOutcomes: [
            "Understanding AMR hardware and software architecture",
            "Microcontroller-based drivetrain interfacing and PID control",
            "ROS setup, nodes, topics, messages, and services",
            "TurtleSim simulation and environment integration",
            "LiDAR sensor interfacing and RViz 3D visualization",
            "URDF robot modeling and autonomous navigation",
            "SLAM-based mapping and waypoint navigation"
        ],
        days: [
            {
                day: "Day 1",
                title: "Introduction to AMR",
                topics: [
                    "Understanding what is an AMR",
                    "Deep dive into different parts of AMR",
                    "Understanding of Hardware and Software components of AMR",
                    "Different types of Driving mechanisms",
                    "Specification of PNT AMR",
                    "Understanding hardware architecture and software stack of PNT AMR",
                    "PNT AMR use cases and application"
                ]
            },
            {
                day: "Day 2",
                title: "Basics of Microcontroller-Based Control",
                topics: [
                    "Introduction to Microcontrollers in the industry for AMR applications",
                    "Comparison of different types of microcontrollers used within AMR",
                    "Understanding Hardware microcontroller stack of PNT AMR",
                    "Set up of Integrated Development environments: Arduino IDE, PlatformIO",
                    "Basics of C/C++ Programming for robotics",
                    "Hardware Programming of PNT AMR (controlling the status LED and buzzer)"
                ]
            },
            {
                day: "Day 3",
                title: "AMR Drivetrain Interfacing & Hardware Interface",
                topics: [
                    "Motor interfacing with Speed and Direction control",
                    "Motor encoder interfacing",
                    "Understanding PID based closed loop system",
                    "Programming PNT AMR for fixed path navigation",
                    "Programming and calibrating PNT AMR Sensors with microcontroller",
                    "Interfacing of IMU, Obstacle sensor, Encoder, Status Indicator LED and alarm system",
                    "Understanding how sensors are used for accurate odometry calculation for robot navigation",
                    "Understanding hardware communication protocols and their uses in PNT AMR"
                ]
            },
            {
                day: "Day 4",
                title: "Introduction to ROS",
                topics: [
                    "Understanding ROS (Robot Operating System) and its role in robot development",
                    "Understanding ROS tools, libraries, and communication systems for navigation, perception, and control",
                    "Installation and setup of ROS",
                    "Installation and setup for Programming Languages Python and C++",
                    "Understanding components of ROS: Nodes, Launch file, Workspace, Packages"
                ]
            },
            {
                day: "Day 5",
                title: "TurtleSim and Simulation Environment",
                topics: [
                    "Understanding Importance of simulation environment in Robotics",
                    "Installation and Setup of TurtleSim on ROS",
                    "Interfacing turtle robot movement in a 2D environment",
                    "Understanding and interfacing ROS nodes, topics, messages, and services with respect to TurtleSim",
                    "Programming turtle bot for movement within simulated environment"
                ]
            },
            {
                day: "Day 6",
                title: "Interfacing ROS with Microcontroller",
                topics: [
                    "Understanding ROS on microcontrollers and its setup",
                    "Performing Motor control from ROS",
                    "Controlling PNT AMR movements from ROS",
                    "Setting up Teleop Control of PNT AMR"
                ]
            },
            {
                day: "Day 7",
                title: "RViz & LiDAR Sensor Interfacing and Visualisation",
                topics: [
                    "Setting up RViz (ROS Visualization Tool) for 3D visualization in ROS",
                    "Setting up Rviz to view robot data, sensors, and the robot environment",
                    "Programming PNT AMR for real time visualisation",
                    "Program PNT AMR for acquiring: Robot position, Sensor data",
                    "LiDAR Sensor interfacing and Visualisation",
                    "Create maps with PNT AMR"
                ]
            },
            {
                day: "Day 8",
                title: "Autonomous Navigation Implementation",
                topics: [
                    "Implementing autonomous navigation with PNT AMR",
                    "Configuring PNT AMR for efficient navigation",
                    "Implementing waypoint based navigation"
                ]
            },
            {
                day: "Day 9",
                title: "AMR Modeling and Visualizing in RViz",
                topics: [
                    "Creating a digital model of the PNT AMR and displaying it in RViz to visualize its structure, sensors, and movement",
                    "Configure RViz to visualize the robot model, coordinate frames, and sensor data in 3D",
                    "Create PNT AMR robot model using URDF (Unified Robot Description Format)",
                    "Describing PNT AMR using: Robot base, Wheels, Sensors, Joints, Dimensions"
                ]
            },
            {
                day: "Day 10",
                title: "Competition & Project Implementation",
                topics: [
                    "Challenge: Design a logic-based code for AMR to navigate a complex grid",
                    "Scoring Criteria: Accuracy in navigation, Smoothness of movement, Code efficiency",
                    "Recap of learnings",
                    "Industry applications of AGVs",
                    "Certificate distribution",
                    "Internship selection"
                ]
            }
        ]
    },
    {
        id: "drone",
        level: "Intermediate",
        duration: "5 Days",
        title: "Aerial Robotics / Drones",
        badgeTagline: "Tello SDK + Computer Vision",
        icon: RadioTower,
        color: "from-cyan-500 to-blue-600",
        shortObjective: "Operate and program autonomous drones using Tello SDK and advanced computer vision.",
        objective: "Train students to operate and program autonomous drones using the Tello SDK. Implement advanced computer vision for obstacle avoidance and warehouse automation. Provide hands-on experience in API-based flight control, sensor calibration, and automated navigation.",
        learningOutcomes: [
            "Proficiency in Drone SDKs and Python-based API usage",
            "Understanding and utilizing internal sensors like Barometers, IMUs, and Vision Positioning Systems (VPS)",
            "Developing autonomous routines for take-off, landing, and object detection",
            "Implementing real-world industrial solutions like QR-code based warehouse inventory tracking"
        ],
        days: [
            {
                day: "Day 1",
                title: "Drone Architecture & API Fundamentals",
                topics: [
                    "Understanding the flight mechanics of quadcopters and the role of the Intel processor",
                    "Key Components: Brushless motors, 5MP HD camera, Wi-Fi communication modules",
                    "Setting up the Python development environment and connecting to the \"TELLO-XXXXXX\" network",
                    "Task: Writing a basic \"Hello Drone\" script to establish a stable connection and retrieve battery status via API commands"
                ]
            },
            {
                day: "Day 2",
                title: "Sensor Calibration & Data Collection",
                topics: [
                    "Deep dive into the Vision Positioning System (VPS) for stable indoor hovering without GPS",
                    "Utilizing the Barometer for altitude hold and the Optical Sensor for ground distance measurement",
                    "Practice: Calibrating the IMU and compass to ensure stable flight dynamics",
                    "Data Collection: Writing scripts to log real-time sensor data (height, speed, and temperature) to the console"
                ]
            },
            {
                day: "Day 3",
                title: "Automated Flight & Precision Maneuvers",
                topics: [
                    "Programming \"Throw & Go\" startup sequences and precision landing logic using optical sensor feedback",
                    "Exercise: Creating an automated \"Box Flight\" routine using SDK commands for pitch, roll, and yaw",
                    "Task: Implementing smooth transitions between vertical and horizontal movements to simulate professional cinematography"
                ]
            },
            {
                day: "Day 4",
                title: "Object Detection & Obstacle Avoidance",
                topics: [
                    "Utilizing the 720p HD camera stream for real-time image processing",
                    "Obstacle Avoidance: Developing logic to detect proximity to objects using the Vision System and halting movement to prevent collisions",
                    "Logic: Using visual feedback from the camera to identify red/green markers and trigger specific drone reactions (e.g., flip or land)"
                ]
            },
            {
                day: "Day 5",
                title: "Warehouse Automation & Capstone Project",
                topics: [
                    "Concept: Simulating an automated inventory system where the drone scans QR codes on \"packages\" in a grid",
                    "Task: Programming the drone to fly to specific coordinates, recognize a QR code, and display the decoded information on the control interface",
                    "Challenge: Design an autonomous mission where the drone must navigate a path, avoid an obstacle, and scan a final QR code at the landing zone",
                    "Scoring Criteria: Code efficiency and stability of the flight, Accuracy of object detection and QR scanning, Safety compliance and landing precision"
                ]
            }
        ]
    },
    {
        id: "robotic-hand",
        level: "Advanced",
        duration: "5 Days",
        title: "Robotic Hand",
        badgeTagline: "EMG + AI Gesture Control",
        icon: Hand,
        color: "from-rose-500 to-pink-600",
        shortObjective: "Program a multi-finger robotic manipulator with AI gesture control and EMG.",
        objective: "Train students to build and program a multi-finger robotic manipulator using microcontrollers. Implement advanced sensor-based gesture control and feedback mechanisms. Provide hands-on experience in finger coordination, EMG integration, and real-time status monitoring.",
        learningOutcomes: [
            "Understanding robotic hand kinematics and human-machine interaction",
            "Working with ATmega328P microcontrollers for precise servo actuation",
            "Implementing capacitive touch and EMG sensor-based navigation",
            "Writing embedded code for gesture mimicry and feedback loops"
        ],
        days: [
            {
                day: "Day 1",
                title: "Introduction to Robotic Hand & Components",
                topics: [
                    "A five-fingered robotic manipulator engineered to replicate fundamental human hand movements",
                    "Applications: Robotic prosthetics, educational kits, and lightweight manipulation tasks",
                    "Actuators: 6 × 180-degree high-torque servo motors",
                    "Microcontroller: ATmega328P based system",
                    "Sensors: Capacitive touch and optional EMG modules",
                    "Motor Selection: 11 kg/cm torque servos for individual finger actuation",
                    "Display: 16×2 LCD with I2C interface for real-time status updates",
                    "Interface: Rotary encoder for menu-based control"
                ]
            },
            {
                day: "Day 2",
                title: "Microcontrollers & Finger Movement Coordination",
                topics: [
                    "Introduction to multi-servo control for individual finger movement",
                    "Programming specific finger sequences (Thumb to Little finger)",
                    "Logic: Synchronizing 5 servos to perform coordinated tasks like gripping and holding",
                    "Practice: Writing code to transition between specific gesture formations (e.g., peace sign, fist)",
                    "Calibration: Debugging servo angles using the Serial Monitor"
                ]
            },
            {
                day: "Day 3",
                title: "Feedback Mechanisms & Touch Control",
                topics: [
                    "System Logic: Using the 16×2 LCD to display current hand status (e.g., \"Grip Active\", \"Hand Open\")",
                    "Visual Cues: Programming the LCD to show real-time sensor values and motor positions",
                    "Integrating the capacitive touch sensor module for intuitive \"touch-to-actuate\" control",
                    "Task: Configuring threshold values for the touch sensor to trigger specific hand states"
                ]
            },
            {
                day: "Day 4",
                title: "Advanced Control & EMG Integration",
                topics: [
                    "Introduction to EMG (Electromyography) for gesture-based control",
                    "Capturing muscle signals to drive the robotic hand movements",
                    "Calibration: Fine-tuning sensitivity parameters for smooth muscle-to-hand response",
                    "Practical: Mapping specific muscle contractions to finger coordination patterns (e.g., closing the hand upon muscle flex)"
                ]
            },
            {
                day: "Day 5",
                title: "Competition & Project Implementation",
                topics: [
                    "Challenge: Design a logic-based code for the Robotic Hand to perform a complex \"Pick, Hold, and Release\" task using combined sensor feedback",
                    "Scoring Criteria: Accuracy in gesture formation, Smoothness of finger coordination, Effective use of LCD feedback and sensor data",
                    "Recap of industry applications in prosthetics and automation",
                    "Certificate distribution and internship selection"
                ]
            }
        ]
    }
];

export default function CollegesTrainingContent({ testimonials = [], labPartners = [] }: { testimonials?: any[]; labPartners?: any[] }) {
    const [selectedProgram, setSelectedProgram] = useState<Program>(PROGRAMS[0]);
    const [expandedDays, setExpandedDays] = useState<string[]>([]);

    const toggleDay = (dayTitle: string) => {
        setExpandedDays(prev => 
            prev.includes(dayTitle) 
                ? prev.filter(d => d !== dayTitle) 
                : [...prev, dayTitle]
        );
    };

    return (
        <section className="py-12 md:py-24 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Network Background */}
            <div className="absolute inset-0 z-0 opacity-30">
                <ClientOnly>
                    <NetworkBackground />
                </ClientOnly>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-transparent to-slate-50/80 dark:from-slate-950/80 dark:via-transparent dark:to-slate-950/80 z-0" />
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <CredibilityBadge />
                <SectionAIndustryGap />
                
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative mt-16">
                    
                    {/* Left Sidebar - Programs List */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:sticky lg:top-24 z-10">
                        <div className="mb-2 md:mb-4">
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Available Programs</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 hidden md:block">Select a program to view its detailed curriculum.</p>
                        </div>
                        
                        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 snap-x lg:overflow-x-visible">
                            {PROGRAMS.map((program) => {
                                const isSelected = selectedProgram.id === program.id;
                                return (
                                    <button
                                        key={program.id}
                                        onClick={() => {
                                            setSelectedProgram(program);
                                            setExpandedDays([]); // reset accordions
                                        }}
                                        className={`group relative flex-shrink-0 w-[280px] lg:w-full text-left p-4 rounded-2xl border transition-all duration-300 overflow-hidden snap-center ${
                                            isSelected 
                                                ? 'bg-white dark:bg-slate-900 border-indigo-500/50 dark:border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                                                : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute inset-0 opacity-10 blur-xl pointer-events-none bg-gradient-to-r from-blue-500 to-indigo-600" />
                                        )}
                                        {isSelected && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600" />
                                        )}
                                        
                                        <div className="flex gap-4 items-center relative z-10">
                                            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${
                                                isSelected 
                                                    ? 'bg-gradient-to-br ' + program.color + ' text-white' 
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                                            } transition-colors`}>
                                                <program.icon className="w-6 h-6" />
                                            </div>
                                            <div className="grow">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                                                        program.level === 'Basic' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                                        : program.level === 'Advanced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                                                    }`}>
                                                        {program.level}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {program.duration}
                                                    </span>
                                                </div>
                                                <h4 className={`font-bold text-base leading-tight mb-1 ${
                                                    isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                                                }`}>
                                                    {program.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                    {program.badgeTagline}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Panel - Detail View */}
                    <div className="w-full lg:w-2/3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedProgram.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative"
                            >
                                {/* Header area with gradient */}
                                <div className={`relative px-8 pt-12 pb-10 bg-gradient-to-br ${selectedProgram.color} overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")"}} />
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                                <selectedProgram.icon className="w-4 h-4" />
                                                {selectedProgram.badgeTagline}
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                                                {selectedProgram.title}
                                            </h2>
                                            <p className="text-white/80 font-medium max-w-xl text-sm md:text-base">
                                                {selectedProgram.shortObjective}
                                            </p>
                                        </div>
                                        
                                        <div className="shrink-0">
                                            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap">
                                                Enroll College <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-8 md:p-10 flex flex-col gap-10">
                                    
                                    {/* Overview Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Objective</h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                                {selectedProgram.objective}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Duration</p>
                                                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none mt-1">{selectedProgram.duration}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                                    <List className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Modules</p>
                                                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none mt-1">{selectedProgram.days.length} Days</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Learning Outcomes */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Learning Outcomes</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedProgram.learningOutcomes.map((outcome, idx) => (
                                                <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">{outcome}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inline Hardware Specifications */}
                                    <HardwareSpecsGrid programId={selectedProgram.id} />

                                    {/* Day-by-Day Syllabus */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Day-by-Day Curriculum</h3>
                                        <div className="flex flex-col gap-3">
                                            {selectedProgram.days.map((dayItem, idx) => {
                                                const isExpanded = expandedDays.includes(dayItem.day);
                                                return (
                                                    <div 
                                                        key={idx}
                                                        className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                                                            isExpanded 
                                                                ? 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20' 
                                                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                                                        }`}
                                                    >
                                                        <button 
                                                            onClick={() => toggleDay(dayItem.day)}
                                                            className="w-full flex items-center justify-between p-5 text-left"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <span className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                                                                    isExpanded ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                                }`}>
                                                                    {dayItem.day}
                                                                </span>
                                                                <span className="font-bold text-slate-900 dark:text-white text-base">
                                                                    {dayItem.title}
                                                                </span>
                                                            </div>
                                                            <div className={`p-1 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                                                                <ChevronDown className="w-5 h-5" />
                                                            </div>
                                                        </button>
                                                        
                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/50 ml-[4.5rem]">
                                                                        <ul className="space-y-3">
                                                                            {dayItem.topics.map((topic, i) => (
                                                                                <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 shrink-0 mt-1.5" />
                                                                                    <span>{topic}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Completion Perks */}
                                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 text-center">Program Completion Perks</h3>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 flex items-center justify-center shadow-sm">
                                                    <Award className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Industry Certificate</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 flex items-center justify-center shadow-sm">
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Internship Selection</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500 flex items-center justify-center shadow-sm">
                                                    <FileCheck className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Letter of Recommendation</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>

                <SectionBPNTEdge />
                <InternshipInstituteSection labPartners={labPartners} />
                <SectionCAlumni testimonials={testimonials} />

            </div>
        </section>
    );
}

// --- Pitch Deck & UI Injection Components below --- //

function CredibilityBadge() {
    return (
        <div className="py-8 mb-12 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Recognized & Backed By</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {/* Add your logos here matching these dimensions/aspect ratio */}
                    <div className="font-black text-xl text-slate-800 dark:text-slate-200">
                        Shark Tank India
                    </div>
                    <div className="flex items-center gap-2 font-black text-xl text-slate-800 dark:text-slate-200">
                        <Award className="w-6 h-6 text-blue-500" /> PM Modi Recognized
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionAIndustryGap() {
    return (
        <div className="py-12 mb-16">
            <div className="text-center mb-16">
                <span className="inline-block bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-5 border border-red-200 dark:border-red-500/30">⚠ The Crisis</span>
                <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">The Problem Statement</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mb-16">
                {/* India Problem Statement */}
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 lg:w-1/2 shadow-lg">
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">🇮🇳 The Current Landscape</h3>
                    <ul className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                            <p>A study by NASSCOM reveals <span className="font-bold text-red-600 dark:text-red-400">only 10% of Indian engineering graduates</span> are employable in robotics-related fields.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                            <p>Theoretical-heavy curriculum fail to provide hands-on experience and industry-ready skills.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">3</div>
                            <p>India highly lags behind countries like China and Japan in the adoption of AMR, AGVs and robotic arms.</p>
                        </li>
                    </ul>
                </motion.div>

                {/* China comparison */}
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/20 rounded-3xl p-8 lg:w-1/2 shadow-lg">
                    <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-6 flex items-center gap-2">🇨🇳 The Global Benchmark</h3>
                    <ul className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5" /></div>
                            <p>China's "Made in China 2025" initiative heavily promotes industrial automation.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5" /></div>
                            <p>Result: China produces 150,000+ robotics graduates annually, who seamlessly integrate into the workforce.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5" /></div>
                            <p>Colleges partner with robotics manufacturers to offer students live project experience and internships.</p>
                        </li>
                    </ul>
                </motion.div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 md:p-10 max-w-4xl mx-auto border border-slate-200 dark:border-slate-800 shadow-inner">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <Award className="w-8 h-8 text-blue-500" /> The Permanent Lab Solution
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> <span className="font-semibold text-slate-900 dark:text-white">Modular:</span> Scalable hardware that fits any college size.</li>
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> <span className="font-semibold text-slate-900 dark:text-white">Curriculum Alignment:</span> NEP 2020 & IEEE compliant.</li>
                    </ul>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> <span className="font-semibold text-slate-900 dark:text-white">Open-Source Native:</span> Reprogram and expand effortlessly.</li>
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> <span className="font-semibold text-slate-900 dark:text-white">Research Driven:</span> From bachelor projects to PhD theses.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function SectionBPNTEdge() {
    return (
        <div className="py-24 mt-16 border-t border-slate-200 dark:border-slate-800 relative z-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">The PNT Edge</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">It's not just a training program. It's an entire ecosystem built for sustainable innovation inside your campus.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Custom Microcontrollers", desc: "Proprietary ATmega & ESP32-based architecture ensuring full transparency and hackability. No black-box platforms.", icon: "⚙️" },
                    { title: "Syllabus Integration", desc: "Mapped perfectly to autonomous system & AI curriculum across universities for maximum academic relevance.", icon: "📚" },
                    { title: "Continuous Mentorship", desc: "Long-term faculty enablement, student evaluation, and regular support cycles guaranteeing operational success.", icon: "🤝" }
                ].map((item, i) => (
                    <div key={i} className="p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group">
                        <div className="text-5xl mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 block">{item.icon}</div>
                        <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SectionCAlumni({ 
    testimonials, 
    title = "Intern Testimonials", 
    subtitle = "Hear from students who built real industrial hardware inside our labs, bridging the gap between classroom theory and industry demands." 
}: { 
    testimonials: any[], 
    title?: string, 
    subtitle?: string 
}) {
    // Graceful fallback dummy data if the database is empty or lacks 'college' tagged testimonials
    const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
        { name: "Dewang Kanekar", role: "Bharati Vidyapeeth", quote: "Completed an Industrial Robotics Internship Program and am now an intern at PNT Robotics, working on robotic hands and trolley robots.", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" },
        { name: "Gaurav Mishra", role: "Pillai College of Engineering", quote: "Completed a 6-month internship, contributed to building a robotic arm, and am now an AI & Robotics Engineer working on innovative projects.", imageUrl: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=2670&auto=format&fit=crop" },
        { name: "Ishanya", role: "Manipal Academy (Dubai Campus)", quote: "Conducted testing on high-RPM flywheels, assembled Autonomous Navigation machines, experimented with Arduino, and used angle grinders.", imageUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2670&auto=format&fit=crop" }
    ];

    return (
        <div className="py-24 border-t border-slate-200 dark:border-slate-800 relative z-20">
            <div className="text-center mb-16 relative z-10 w-full overflow-hidden">
                <span className="inline-block bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-5 border border-blue-200 dark:border-blue-500/30">{title}</span>
                <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">Proven Outcomes</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">{subtitle}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {displayTestimonials.map((item, i) => {
                    // Fallback to initial-based avatar if image is broken or not provided
                    const coverImage = item.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1E1B4B&color=818CF8&size=512`;
                    
                    return (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] transition-all duration-500 group flex flex-col">
                            {/* Big Student Photo Header */}
                            <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img 
                                    src={coverImage} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 object-top" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>
                                
                                {/* Info injected over the image to save space and look premium */}
                                <div className="absolute bottom-6 left-6 right-6 z-10">
                                    <h4 className="font-extrabold text-white text-2xl leading-tight mb-1 tracking-tight">{item.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider truncate">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Quote Body */}
                            <div className="p-8 flex-grow flex flex-col relative bg-slate-50 dark:bg-slate-900">
                                <Quote className="absolute top-6 right-6 w-10 h-10 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors duration-300" />
                                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed italic mt-2 relative z-10 font-medium">
                                    "{item.quote}"
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function HardwareSpecsGrid({ programId }: { programId: string }) {
    let specs: string[] = [];
    
    if (programId.includes("agv") || programId.includes("amr")) {
        specs = ["Differential/Mecanum drive", "LiDAR Ready", "ROS Integration", "IR Navigation Nodes"];
    } else if (programId.includes("robotic-arms") || programId.includes("arm")) {
        specs = ["4-6 Axis Motion", "Payload: 1-2 kg", "Kinematics Support", "NEMA Steppers"];
    } else if (programId.includes("drone")) {
        specs = ["Vision Positioning (VPS)", "Barometer Array", "720p HD Stream", "Tello SDK Python"];
    } else if (programId.includes("hand")) {
        specs = ["11 kg/cm torque servos", "Capacitive touch", "EMG Feedback", "ATmega328P Core"];
    } else {
        specs = ["Microcontroller Based", "Custom 3D Printed Parts", "Sensor Array Integration", "Open Source Ready"];
    }

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Hardware Specifications</h3>
            <div className="flex flex-wrap gap-2">
                {specs.map((spec, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-black text-white dark:text-cyan-400 border border-slate-700 dark:border-cyan-900/50 rounded-lg text-xs font-bold uppercase tracking-wider shadow-inner group cursor-default transition-all hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        <Microchip className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:text-cyan-400" /> {spec}
                    </span>
                ))}
            </div>
        </div>
    );
}


// --- Internship & Placement Institute Association Section --- //

function InternshipInstituteSection({ labPartners = [] }: { labPartners?: any[] }) {
    const hiringPartners = labPartners.filter(p => p.category === 'hiring');

    let displayPartners = [...hiringPartners, ...hiringPartners];
    if (displayPartners.length < 8) {
        displayPartners = [...displayPartners, ...displayPartners, ...displayPartners, ...displayPartners];
    }

    return (
        <div className="py-16 md:py-24 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center mb-12">
                <span className="inline-block bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-3 border border-emerald-200 dark:border-emerald-500/30">Placement Network</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Internship &amp; Placement Institute Association</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Our students are placed and interned at top industrial and research organizations across India.</p>
            </div>

            {hiringPartners.length === 0 ? (
                <div className="flex flex-wrap justify-center gap-6">
                    {["Indian Navy", "DRDO", "TATA Power", "Bosch", "Siemens"].map((name, i) => (
                        <div key={i} className="w-44 h-24 rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center gap-2">
                            <GraduationCap className="w-6 h-6 text-emerald-400" />
                            <span className="text-xs font-bold text-slate-400 text-center px-2">{name}</span>
                        </div>
                    ))}
                    <div className="w-full text-center mt-4">
                        <p className="text-xs text-slate-400 font-medium">Upload logos via Admin → Partners &amp; Logos → Internship &amp; Placement Association</p>
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden group">
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

                    <motion.div
                        className="flex gap-8 items-center"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                        style={{ width: "max-content" }}
                    >
                        {displayPartners.map((c: any, i: number) => (
                            <div key={`${c._id || i}-${i}`} className="w-56 h-32 shrink-0 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-center p-4 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all group">
                                {c.imageUrl ? (
                                    <Image src={c.imageUrl} alt={c.name} width={160} height={90} className="object-contain max-h-20 transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <GraduationCap className="w-8 h-8 text-emerald-400" />
                                        <span className="font-bold text-slate-500 dark:text-slate-400 text-xs text-center truncate px-2">{c.name}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
}

// --- Lab Partners Section (Institute Lab Association) --- //

export function LabPartnersSection({ labPartners = [] }: { labPartners?: any[] }) {

    const clients = labPartners.filter(p => p.category === 'client');

    // Duplicate clients array to ensure infinite scrolling looks seamless
    let displayPartners = [...clients, ...clients];
    if (displayPartners.length < 8) {
        displayPartners = [...displayPartners, ...displayPartners, ...displayPartners, ...displayPartners];
    }

    return (
        <div className="py-16 md:py-24 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center mb-12">
                <span className="inline-block bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-3 border border-indigo-200 dark:border-indigo-500/30">Industry Connect</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Institute Lab Association</h2>
                <p className="text-slate-500 dark:text-slate-400">Trusted by leading technical institutions across India.</p>
            </div>

            {clients.length === 0 ? (
                <div className="flex flex-wrap justify-center gap-6">
                    {["IIT Mumbai", "Pune University", "VIT", "MIT College", "Symbiosis"].map((name, i) => (
                        <div key={i} className="w-44 h-24 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center gap-2">
                            <Briefcase className="w-6 h-6 text-indigo-400" />
                            <span className="text-xs font-bold text-slate-400 text-center px-2">{name}</span>
                        </div>
                    ))}
                    <div className="w-full text-center mt-4">
                        <p className="text-xs text-slate-400 font-medium">Upload logos via Admin → Partners &amp; Logos → Institute Partners (Colleges)</p>
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden group">
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

                    <motion.div
                        className="flex gap-8 items-center"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                        style={{ width: "max-content" }}
                    >
                        {displayPartners.map((c: any, i: number) => (
                            <div key={`${c._id || i}-${i}`} className="w-56 h-32 shrink-0 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-center p-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all group">
                                {c.imageUrl ? (
                                    <Image src={c.imageUrl} alt={c.name} width={160} height={90} className="object-contain max-h-20 transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                    <span className="font-bold text-slate-400 dark:text-slate-600 truncate px-2">{c.name}</span>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
}

