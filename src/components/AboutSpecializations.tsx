"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const specializations = [
  "Artificial Intelligence (AI)",
  "Software Development",
  "Robotics",
  "Sensor Fusion",
  "Machine Learning",
  "Autonomous Navigation",
  "Internet of Things (IoT)",
  "Data Science & Analytics",
  "Human-Computer Interaction",
  "Robotic Arm & AGV's"
];

export default function AboutSpecializations() {
  return (
    <section className="relative py-24 bg-slate-900 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-500/20 to-purple-600/20 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">specialize</span> in
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {specializations.map((spec, index) => (
            <motion.div
              key={spec}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800 transition-colors duration-300"
            >
              {/* Subtle hover gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-medium text-slate-200 group-hover:text-white transition-colors duration-300">
                  {spec}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
