import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Star, MapPin, CheckCircle, Plus, X } from "lucide-react";
import { format } from "date-fns";

const hotels = [
    {
        id: 1,
        name: "Luxe Ocean Resort",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        rating: 5,
        location: "Beachfront Paradise",
        price_per_night: 250
    },
    {
        id: 2,
        name: "Metropolitan Grand",
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
        rating: 4,
        location: "City Center",
        price_per_night: 180
    },
    {
        id: 3,
        name: "Mountain View Lodge",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
        rating: 4,
        location: "Alpine Heights",
        price_per_night: 150
    },
    {
        id: 4,
        name: "Heritage Palace",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
        rating: 5,
        location: "Historic District",
        price_per_night: 320
    },
    {
        id: 5,
        name: "Sunset Villa",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
        rating: 4,
        location: "Tropical Garden",
        price_per_night: 200
    }
];

export default function HotelSelection({ selectedHotels, setSelectedHotels }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentHotel, setCurrentHotel] = useState(null);
    const [tempDates, setTempDates] = useState({ check_in: "", check_out: "" });

    const handleHotelSelect = (hotel) => {
        setCurrentHotel(hotel);
        setTempDates({ check_in: "", check_out: "" });
        setShowDatePicker(true);
    };

    const handleDateConfirm = () => {
        if (tempDates.check_in && tempDates.check_out && currentHotel) {
            const nights = Math.ceil(
                (new Date(tempDates.check_out) - new Date(tempDates.check_in)) / (1000 * 60 * 60 * 24)
            );
            const totalPrice = nights * currentHotel.price_per_night;
            
            const newHotelEntry = {
                ...currentHotel,
                check_in: tempDates.check_in,
                check_out: tempDates.check_out,
                nights: nights,
                total_price: totalPrice,
                entry_id: Date.now()
            };
            
            setSelectedHotels(prev => [...prev, newHotelEntry]);
            setShowDatePicker(false);
            setCurrentHotel(null);
            setTempDates({ check_in: "", check_out: "" });
        }
    };

    const removeHotel = (entryId) => {
        setSelectedHotels(prev => prev.filter(h => h.entry_id !== entryId));
    };

    const getTotalHotelPrice = () => {
        return selectedHotels.reduce((sum, h) => sum + h.total_price, 0);
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
                        Choose Your
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Perfect Stay
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Select multiple hotels for different parts of your journey
                    </p>
                </motion.div>

                {/* Hotel Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {hotels.map((hotel, index) => (
                        <motion.div
                            key={hotel.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="relative group cursor-pointer"
                            onClick={() => handleHotelSelect(hotel)}
                        >
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 transition-all duration-500 group-hover:shadow-2xl">
                                {/* Hotel Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Price Badge */}
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        ${hotel.price_per_night}/night
                                    </div>
                                </div>

                                {/* Hotel Info */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        {[...Array(hotel.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                        {hotel.name}
                                    </h3>
                                    <div className="flex items-center text-slate-600 mb-4">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{hotel.location}</span>
                                    </div>
                                    <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Hotel
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Date Picker Modal */}
                <AnimatePresence>
                    {showDatePicker && currentHotel && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setShowDatePicker(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                                    Select Your Stay Dates
                                </h3>
                                <p className="text-center text-slate-600 mb-2">
                                    <span className="font-medium">{currentHotel.name}</span>
                                </p>
                                <p className="text-center text-green-600 font-bold mb-6">
                                    ${currentHotel.price_per_night} per night
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Check-in</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left rounded-xl"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {tempDates.check_in ? format(new Date(tempDates.check_in), 'MMM d') : 'Select'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={tempDates.check_in ? new Date(tempDates.check_in) : undefined}
                                                    onSelect={(date) => setTempDates(prev => ({ ...prev, check_in: date }))}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Check-out</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left rounded-xl"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {tempDates.check_out ? format(new Date(tempDates.check_out), 'MMM d') : 'Select'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={tempDates.check_out ? new Date(tempDates.check_out) : undefined}
                                                    onSelect={(date) => setTempDates(prev => ({ ...prev, check_out: date }))}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {tempDates.check_in && tempDates.check_out && (
                                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                        <p className="text-center text-blue-800 font-medium">
                                            {Math.ceil((new Date(tempDates.check_out) - new Date(tempDates.check_in)) / (1000 * 60 * 60 * 24))} nights = 
                                            <span className="text-xl font-bold ml-2">
                                                ${Math.ceil((new Date(tempDates.check_out) - new Date(tempDates.check_in)) / (1000 * 60 * 60 * 24)) * currentHotel.price_per_night}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <Button 
                                    onClick={handleDateConfirm}
                                    disabled={!tempDates.check_in || !tempDates.check_out}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
                                >
                                    Add to Package
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Selected Hotels Summary */}
                <AnimatePresence>
                    {selectedHotels.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-2xl font-bold text-slate-900">
                                    Selected Hotels ({selectedHotels.length})
                                </h4>
                                <div className="text-xl font-bold text-green-600">
                                    Total: ${getTotalHotelPrice()}
                                </div>
                            </div>
                            <div className="space-y-4">
                                {selectedHotels.map((hotel) => (
                                    <motion.div
                                        key={hotel.entry_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-lg"
                                    >
                                        <img
                                            src={hotel.image}
                                            alt={hotel.name}
                                            className="w-20 h-20 rounded-xl object-cover"
                                        />
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-slate-900">{hotel.name}</h5>
                                            <p className="text-sm text-slate-600">
                                                {format(new Date(hotel.check_in), 'MMM d')} - {format(new Date(hotel.check_out), 'MMM d, yyyy')}
                                            </p>
                                            <p className="text-sm text-slate-500">{hotel.nights} nights</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">${hotel.total_price}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeHotel(hotel.entry_id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
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