import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Users, CheckCircle } from "lucide-react";

const activities = [
    {
        id: 1,
        name: "Desert Safari Adventure",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
        duration: "6 hours",
        groupSize: "Up to 8 people",
        adult_price: 120,
        child_price: 60
    },
    {
        id: 2,
        name: "Burj Khalifa Sky Experience",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
        duration: "3 hours",
        groupSize: "Individual",
        adult_price: 85,
        child_price: 45
    },
    {
        id: 3,
        name: "Marina Luxury Cruise",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        duration: "4 hours",
        groupSize: "Up to 12 people",
        adult_price: 150,
        child_price: 75
    },
    {
        id: 4,
        name: "Global Village Cultural Tour",
        image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop",
        duration: "5 hours",
        groupSize: "Up to 15 people",
        adult_price: 65,
        child_price: 35
    },
    {
        id: 5,
        name: "Adventure Theme Park",
        image: "https://images.unsplash.com/photo-1594736797933-d0ccba2b3632?w=400&h=300&fit=crop",
        duration: "8 hours",
        groupSize: "Family friendly",
        adult_price: 95,
        child_price: 50
    }
];

export default function ActivitySelection({ selectedActivities, setSelectedActivities, adults, children }) {
    const handleActivityToggle = (activity) => {
        setSelectedActivities(prev => {
            const isSelected = prev.some(a => a.id === activity.id);
            if (isSelected) {
                return prev.filter(a => a.id !== activity.id);
            } else {
                return [...prev, activity];
            }
        });
    };

    const isSelected = (activityId) => {
        return selectedActivities.some(a => a.id === activityId);
    };

    const calculateActivityPrice = (activity) => {
        const adultTotal = (adults || 0) * activity.adult_price;
        const childTotal = (children || 0) * activity.child_price;
        return adultTotal + childTotal;
    };

    const getTotalActivitiesPrice = () => {
        return selectedActivities.reduce((sum, activity) => {
            return sum + calculateActivityPrice(activity);
        }, 0);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="py-20 bg-gradient-to-b from-white to-slate-50"
        >
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Unforgettable
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Experiences Await
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Choose activities with separate pricing for adults and children
                    </p>
                </motion.div>

                {/* Activities Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className={`relative group cursor-pointer ${
                                isSelected(activity.id) 
                                    ? 'ring-4 ring-green-400 ring-opacity-50' 
                                    : ''
                            }`}
                            onClick={() => handleActivityToggle(activity)}
                        >
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 transition-all duration-500 group-hover:shadow-2xl">
                                {/* Activity Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={activity.image}
                                        alt={activity.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    
                                    {/* Price Badges */}
                                    <div className="absolute top-4 right-4 space-y-2">
                                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            Adult: ${activity.adult_price}
                                        </div>
                                        <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            Child: ${activity.child_price}
                                        </div>
                                    </div>
                                    
                                    {/* Selection Overlay */}
                                    <AnimatePresence>
                                        {isSelected(activity.id) && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="bg-green-500 text-white p-4 rounded-full shadow-lg"
                                                >
                                                    <CheckCircle className="w-8 h-8" />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Checkbox */}
                                    <div className="absolute top-4 left-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="bg-white/90 backdrop-blur-sm rounded-full p-2"
                                        >
                                            <Checkbox
                                                checked={isSelected(activity.id)}
                                                onChange={() => handleActivityToggle(activity)}
                                                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Activity Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                        {activity.name}
                                    </h3>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-slate-600">
                                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                            <span className="text-sm">{activity.duration}</span>
                                        </div>
                                        <div className="flex items-center text-slate-600">
                                            <Users className="w-4 h-4 mr-2 text-blue-500" />
                                            <span className="text-sm">{activity.groupSize}</span>
                                        </div>
                                    </div>

                                    {/* Price calculation preview */}
                                    {(adults > 0 || children > 0) && (
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <p className="text-sm text-slate-600">
                                                {adults > 0 && <span>{adults} Adult(s): ${adults * activity.adult_price}</span>}
                                                {adults > 0 && children > 0 && <span> + </span>}
                                                {children > 0 && <span>{children} Child(ren): ${children * activity.child_price}</span>}
                                            </p>
                                            <p className="text-lg font-bold text-green-600 mt-1">
                                                Total: ${calculateActivityPrice(activity)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Selected Activities Summary */}
                <AnimatePresence>
                    {selectedActivities.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-8 border border-green-200"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-2xl font-bold text-slate-900">
                                    Selected Activities ({selectedActivities.length})
                                </h4>
                                <div className="text-xl font-bold text-green-600">
                                    Total: ${getTotalActivitiesPrice()}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedActivities.map((activity) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-lg"
                                    >
                                        <img
                                            src={activity.image}
                                            alt={activity.name}
                                            className="w-16 h-16 rounded-xl object-cover"
                                        />
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-slate-900">{activity.name}</h5>
                                            <p className="text-sm text-green-600 font-bold">
                                                ${calculateActivityPrice(activity)}
                                            </p>
                                        </div>
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}