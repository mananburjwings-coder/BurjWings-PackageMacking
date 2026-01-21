import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users } from "lucide-react";

export default function HeroSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-cyan-900/90"></div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
                animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur-xl"
            ></motion.div>
            
            <motion.div
                animate={{ 
                    y: [0, 30, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-32 right-20 w-32 h-32 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full opacity-15 blur-2xl"
            ></motion.div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-6"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Build Your
                        <span className="block bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                            Perfect Journey
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Craft a completely personalized travel experience with our luxury package builder
                    </p>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-6 mb-16"
                >
                    {[
                        { icon: MapPin, text: "Premium Destinations" },
                        { icon: Calendar, text: "Flexible Dates" },
                        { icon: Users, text: "Group Packages" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
                        >
                            <item.icon className="w-5 h-5 text-cyan-400" />
                            <span className="text-white font-medium">{item.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}