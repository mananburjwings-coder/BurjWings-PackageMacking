import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, User, Phone, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

const destinations = [
    "Dubai, UAE", "Paris, France", "Tokyo, Japan", "New York, USA", 
    "London, UK", "Singapore", "Barcelona, Spain", "Rome, Italy"
];

const services = [
    "Air Ticket", "Hotel", "Visa", "Sightseeing", 
    "Lunch", "Dinner", "Add-Ons", "Transportation", "Airport Pickup & Drop"
];

export default function BookingForm({ formData, setFormData }) {
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleServiceToggle = (service) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="py-20 bg-gradient-to-b from-white to-slate-50"
        >
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Let's Plan Your
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Dream Getaway
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Tell us about your travel preferences and we'll create the perfect package for you
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100"
                >
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="name" className="text-slate-700 font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="Enter your full name"
                                    className="h-12 rounded-xl border-slate-200 focus:border-blue-400 transition-all duration-300"
                                />
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="phone" className="text-slate-700 font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-blue-500" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="h-12 rounded-xl border-slate-200 focus:border-blue-400 transition-all duration-300"
                                />
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="space-y-2"
                            >
                                <Label className="text-slate-700 font-medium flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    Destination
                                </Label>
                                <Select onValueChange={(value) => handleInputChange("destination", value)}>
                                    <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                        <SelectValue placeholder="Choose your destination" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {destinations.map((dest) => (
                                            <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        </div>

                        <div className="space-y-6">
                            {/* Date Pickers */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="space-y-2"
                                >
                                    <Label className="text-slate-700 font-medium">Arrival Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="h-12 w-full justify-start text-left rounded-xl border-slate-200 hover:border-blue-400 transition-all duration-300"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                                                {formData.arrival_date ? format(new Date(formData.arrival_date), 'MMM d, yyyy') : 'Select date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.arrival_date ? new Date(formData.arrival_date) : undefined}
                                                onSelect={(date) => handleInputChange("arrival_date", date)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="space-y-2"
                                >
                                    <Label className="text-slate-700 font-medium">Departure Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="h-12 w-full justify-start text-left rounded-xl border-slate-200 hover:border-blue-400 transition-all duration-300"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                                                {formData.departure_date ? format(new Date(formData.departure_date), 'MMM d, yyyy') : 'Select date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.departure_date ? new Date(formData.departure_date) : undefined}
                                                onSelect={(date) => handleInputChange("departure_date", date)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </motion.div>
                            </div>

                            {/* Traveler Counts */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="space-y-2"
                                >
                                    <Label className="text-slate-700 font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        Adults
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.adults}
                                        onChange={(e) => handleInputChange("adults", parseInt(e.target.value))}
                                        className="h-12 rounded-xl border-slate-200 focus:border-blue-400 transition-all duration-300"
                                    />
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="space-y-2"
                                >
                                    <Label className="text-slate-700 font-medium">Children</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.children}
                                        onChange={(e) => handleInputChange("children", parseInt(e.target.value))}
                                        className="h-12 rounded-xl border-slate-200 focus:border-blue-400 transition-all duration-300"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="border-t border-slate-200 pt-12"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                            Choose Your Services
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {services.map((service, index) => (
                                <motion.div
                                    key={service}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                    onClick={() => handleServiceToggle(service)}
                                >
                                    <Checkbox
                                        checked={formData.services.includes(service)}
                                        onChange={() => handleServiceToggle(service)}
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                    />
                                    <span className="text-slate-700 font-medium">{service}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}