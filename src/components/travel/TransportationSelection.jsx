import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Plane, Bus, Ship, CheckCircle } from "lucide-react";

const transportOptions = [
    {
        id: 1,
        name: "Airport Transfer (Round Trip)",
        icon: "plane",
        description: "Luxury sedan pickup and drop-off",
        price: 80
    },
    {
        id: 2,
        name: "Private Car with Driver",
        icon: "car",
        description: "Full day private transportation",
        price: 150
    },
    {
        id: 3,
        name: "Luxury SUV Rental",
        icon: "car",
        description: "Self-drive premium SUV per day",
        price: 200
    },
    {
        id: 4,
        name: "Group Tour Bus",
        icon: "bus",
        description: "Comfortable AC coach for group travel",
        price: 45
    },
    {
        id: 5,
        name: "Yacht Charter",
        icon: "ship",
        description: "Private yacht experience",
        price: 500
    },
    {
        id: 6,
        name: "Helicopter Tour",
        icon: "plane",
        description: "Scenic aerial tour",
        price: 350
    }
];

const iconMap = {
    plane: Plane,
    car: Car,
    bus: Bus,
    ship: Ship
};

export default function TransportationSelection({ selectedTransport, setSelectedTransport }) {
    const handleTransportToggle = (transport) => {
        setSelectedTransport(prev => {
            const isSelected = prev.some(t => t.id === transport.id);
            if (isSelected) {
                return prev.filter(t => t.id !== transport.id);
            } else {
                return [...prev, transport];
            }
        });
    };

    const isSelected = (transportId) => {
        return selectedTransport.some(t => t.id === transportId);
    };

    const getTotalTransportPrice = () => {
        return selectedTransport.reduce((sum, t) => sum + t.price, 0);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="py-20 bg-gradient-to-b from-slate-50 to-white"
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
                        Premium
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Transportation
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Select your preferred modes of transportation
                    </p>
                </motion.div>

                {/* Transport Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {transportOptions.map((transport, index) => {
                        const IconComponent = iconMap[transport.icon];
                        return (
                            <motion.div
                                key={transport.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.03 }}
                                className={`relative cursor-pointer ${
                                    isSelected(transport.id) 
                                        ? 'ring-4 ring-blue-400 ring-opacity-50' 
                                        : ''
                                }`}
                                onClick={() => handleTransportToggle(transport)}
                            >
                                <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 ${
                                    isSelected(transport.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-100 hover:border-blue-300'
                                }`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${
                                            isSelected(transport.id)
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-green-600">${transport.price}</span>
                                            <Checkbox
                                                checked={isSelected(transport.id)}
                                                onChange={() => handleTransportToggle(transport)}
                                                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {transport.name}
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {transport.description}
                                    </p>
                                    
                                    {isSelected(transport.id) && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute top-2 right-2"
                                        >
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Selected Transport Summary */}
                <AnimatePresence>
                    {selectedTransport.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-8 border border-indigo-200"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-2xl font-bold text-slate-900">
                                    Selected Transportation ({selectedTransport.length})
                                </h4>
                                <div className="text-xl font-bold text-green-600">
                                    Total: ${getTotalTransportPrice()}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {selectedTransport.map((transport) => {
                                    const IconComponent = iconMap[transport.icon];
                                    return (
                                        <motion.div
                                            key={transport.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg"
                                        >
                                            <IconComponent className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium text-slate-900">{transport.name}</span>
                                            <span className="text-green-600 font-bold">${transport.price}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}