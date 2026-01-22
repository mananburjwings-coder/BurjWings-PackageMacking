// import React, { useState } from "react";
// import { base44 } from "@/api/base44Client";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Plus, Edit, Trash2, Star, MapPin, Bed, DollarSign } from "lucide-react";
// import ImageUpload from "@/components/ui/ImageUpload";
// import { Link } from "react-router-dom";
// import { createPageUrl } from "@/utils";

// export default function ManageHotels() {
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [editingHotel, setEditingHotel] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [formData, setFormData] = useState({
//         name: "",
//         image: "",
//         rating: 5,
//         location: "",
//         price_per_night: 0,
//         extra_bed_price: 0,
//         b2b_price_per_night: 0,
//         b2b_extra_bed_price: 0
//     });

//     const queryClient = useQueryClient();

//     const { data: hotels = [], isLoading } = useQuery({
//         queryKey: ['hotels'],
//         queryFn: () => base44.entities.Hotel.list()
//     });

//     const filteredHotels = hotels.filter(h => 
//         h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         h.location?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const createMutation = useMutation({
//         mutationFn: (data) => base44.entities.Hotel.create(data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['hotels'] });
//             resetForm();
//         }
//     });

//     // Inside ManageHotels.jsx

// const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => base44.entities.Hotel.update(id, data),
//     onSuccess: () => {
//         // This is critical: it tells the app to refresh the list after updating
//         queryClient.invalidateQueries({ queryKey: ['hotels'] });
//         resetForm();
//     }
// });

// const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editingHotel) {
//         // Ensure you are passing the exact ID of the hotel being edited
//         updateMutation.mutate({ 
//             id: editingHotel.id, 
//             data: formData 
//         });
//     } else {
//         createMutation.mutate(formData);
//     }
// };

//     const deleteMutation = useMutation({
//         mutationFn: (id) => base44.entities.Hotel.delete(id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hotels'] })
//     });

//     const resetForm = () => {
//         setFormData({ name: "", image: "", rating: 5, location: "", price_per_night: 0, extra_bed_price: 0, b2b_price_per_night: 0, b2b_extra_bed_price: 0 });
//         setEditingHotel(null);
//         setIsDialogOpen(false);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (editingHotel) {
//             updateMutation.mutate({ id: editingHotel.id, data: formData });
//         } else {
//             createMutation.mutate(formData);
//         }
//     };

//     const handleEdit = (hotel) => {
//         setFormData({
//             name: hotel.name,
//             image: hotel.image || "",
//             rating: hotel.rating || 5,
//             location: hotel.location || "",
//             price_per_night: hotel.price_per_night || 0,
//             extra_bed_price: hotel.extra_bed_price || 0,
//             b2b_price_per_night: hotel.b2b_price_per_night || 0,
//             b2b_extra_bed_price: hotel.b2b_extra_bed_price || 0
//         });
//         setEditingHotel(hotel);
//         setIsDialogOpen(true);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//                     <div>
//                         <h1 className="text-3xl font-bold text-slate-900">Manage Hotels</h1>
//                         <p className="text-slate-600">Add, edit, and manage hotel options</p>
//                     </div>
//                     <div className="flex items-center gap-4 w-full md:w-auto">
//                         <Input 
//                             placeholder="Search hotels..." 
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full md:w-64"
//                         />
//                         <Link to={createPageUrl("Dashboard")}>
//                             <Button variant="outline">Back</Button>
//                         </Link>
//                         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                             <DialogTrigger asChild>
//                                 <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => resetForm()}>
//                                     <Plus className="w-4 h-4 mr-2" /> Add Hotel
//                                 </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-md">
//                                 <DialogHeader>
//                                     <DialogTitle>{editingHotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
//                                 </DialogHeader>
//                                 <form onSubmit={handleSubmit} className="space-y-4">
//                                     <div>
//                                         <Label>Hotel Name</Label>
//                                         <Input
//                                             value={formData.name}
//                                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                             required
//                                         />
//                                     </div>
//                                     <div>
//                                         <Label>Image</Label>
//                                         <ImageUpload 
//                                             value={formData.image}
//                                             onChange={(url) => setFormData({ ...formData, image: url })}
//                                         />
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <Label>Rating (1-5)</Label>
//                                             <Input
//                                                 type="number"
//                                                 min="1"
//                                                 max="5"
//                                                 value={formData.rating}
//                                                 onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
//                                             />
//                                         </div>
//                                         <div>
//                                             <Label>Location</Label>
//                                             <Input
//                                                 value={formData.location}
//                                                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <Label className="font-bold text-blue-600">B2C Rates</Label>
//                                         <div className="grid grid-cols-2 gap-4 mt-2">
//                                             <div>
//                                                 <Label>Price/Night (AED)</Label>
//                                                 <Input
//                                                     type="number"
//                                                     value={formData.price_per_night}
//                                                     onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })}
//                                                     required
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <Label>Extra Bed Price (AED)</Label>
//                                                 <Input
//                                                     type="number"
//                                                     value={formData.extra_bed_price}
//                                                     onChange={(e) => setFormData({ ...formData, extra_bed_price: parseFloat(e.target.value) })}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <Label className="font-bold text-green-600">B2B Rates</Label>
//                                         <div className="grid grid-cols-2 gap-4 mt-2">
//                                             <div>
//                                                 <Label>B2B Price/Night (AED)</Label>
//                                                 <Input
//                                                     type="number"
//                                                     value={formData.b2b_price_per_night}
//                                                     onChange={(e) => setFormData({ ...formData, b2b_price_per_night: parseFloat(e.target.value) })}
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <Label>B2B Extra Bed (AED)</Label>
//                                                 <Input
//                                                     type="number"
//                                                     value={formData.b2b_extra_bed_price}
//                                                     onChange={(e) => setFormData({ ...formData, b2b_extra_bed_price: parseFloat(e.target.value) })}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <Button type="submit" className="w-full">
//                                         {editingHotel ? "Update Hotel" : "Add Hotel"}
//                                     </Button>
//                                 </form>
//                             </DialogContent>
//                         </Dialog>
//                     </div>
//                 </div>

//                 {/* Hotels Grid */}
//                 {isLoading ? (
//                     <div className="text-center py-12">Loading...</div>
//                 ) : (
//                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         <AnimatePresence>
//                             {filteredHotels.map((hotel) => (
//                                 <motion.div
//                                     key={hotel.id}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                 >
//                                     <Card className="overflow-hidden hover:shadow-lg transition-shadow">
//                                         <div className="relative h-48 bg-slate-200">
//                                             {hotel.image ? (
//                                                 <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
//                                             ) : (
//                                                 <div className="w-full h-full flex items-center justify-center text-slate-400">
//                                                     No Image
//                                                 </div>
//                                             )}
//                                             <div className="absolute top-2 right-2 flex gap-2">
//                                                 <Button size="icon" variant="secondary" onClick={() => handleEdit(hotel)}>
//                                                     <Edit className="w-4 h-4" />
//                                                 </Button>
//                                                 <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(hotel.id)}>
//                                                     <Trash2 className="w-4 h-4" />
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                         <CardContent className="p-4">
//                                             <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
//                                             <div className="flex items-center gap-1 mb-2">
//                                                 {[...Array(hotel.rating || 5)].map((_, i) => (
//                                                     <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                                                 ))}
//                                             </div>
//                                             <div className="flex items-center text-slate-600 text-sm mb-2">
//                                                 <MapPin className="w-4 h-4 mr-1" />
//                                                 {hotel.location || "Not specified"}
//                                             </div>
//                                             <div className="flex justify-between items-center mt-4">
//                                                 <div className="flex items-center text-green-600 font-bold">
//                                                     AED {hotel.price_per_night}/night
//                                                 </div>
//                                                 <div className="flex items-center text-blue-600 text-sm">
//                                                     <Bed className="w-4 h-4 mr-1" />
//                                                     + AED {hotel.extra_bed_price || 0}
//                                                 </div>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 </motion.div>
//                             ))}
//                         </AnimatePresence>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Star, MapPin, Bed } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ManageHotels() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        rating: 5,
        location: "",
        price_per_night: 0,
        extra_bed_price: 0,
        b2b_price_per_night: 0,
        b2b_extra_bed_price: 0
    });

    const queryClient = useQueryClient();

    // Fetch Hotels
    const { data: hotels = [], isLoading } = useQuery({
        queryKey: ['hotels'],
        queryFn: () => base44.entities.Hotel.list()
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Hotel.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hotels'] });
            resetForm();
        }
    });

    // Update Mutation
    const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Hotel.update(id, data),
    onSuccess: () => {
        // Force React Query to fetch the new list from LocalStorage
        queryClient.invalidateQueries({ queryKey: ['hotels'] });
        resetForm(); // Closes the dialog and clears editingHotel state
    }
});
    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Hotel.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hotels'] })
    });

    const resetForm = () => {
        setFormData({ name: "", image: "", rating: 5, location: "", price_per_night: 0, extra_bed_price: 0, b2b_price_per_night: 0, b2b_extra_bed_price: 0 });
        setEditingHotel(null);
        setIsDialogOpen(false);
    };

 const handleSubmit = (e) => {
    e.preventDefault();
    if (editingHotel && editingHotel.id) {
        // Send as an object containing both 'id' and 'data' keys
        updateMutation.mutate({ 
            id: editingHotel.id, 
            data: formData 
        });
    } else {
        createMutation.mutate(formData);
    }
};

    const handleEdit = (hotel) => {
        setFormData({
            name: hotel.name,
            image: hotel.image || "",
            rating: hotel.rating || 5,
            location: hotel.location || "",
            price_per_night: hotel.price_per_night || 0,
            extra_bed_price: hotel.extra_bed_price || 0,
            b2b_price_per_night: hotel.b2b_price_per_night || 0,
            b2b_extra_bed_price: hotel.b2b_extra_bed_price || 0
        });
        setEditingHotel(hotel);
        setIsDialogOpen(true);
    };

    const filteredHotels = hotels.filter(h => 
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        h.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Manage Hotels</h1>
                        <p className="text-slate-600">Add, edit, and manage hotel options</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Input 
                            placeholder="Search hotels..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64"
                        />
                        <Link to={createPageUrl("Dashboard")}>
                            <Button variant="outline">Back</Button>
                        </Link>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => resetForm()}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Hotel
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{editingHotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label>Hotel Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Image</Label>
                                        <ImageUpload 
                                            value={formData.image}
                                            onChange={(url) => setFormData({ ...formData, image: url })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Rating (1-5)</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={formData.rating}
                                                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Location</Label>
                                            <Input
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="font-bold text-blue-600">B2C Rates</Label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <Label>Price/Night (AED)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.price_per_night}
                                                    onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Extra Bed Price (AED)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.extra_bed_price}
                                                    onChange={(e) => setFormData({ ...formData, extra_bed_price: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="font-bold text-green-600">B2B Rates</Label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <Label>B2B Price/Night (AED)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.b2b_price_per_night}
                                                    onChange={(e) => setFormData({ ...formData, b2b_price_per_night: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                            <div>
                                                <Label>B2B Extra Bed (AED)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.b2b_extra_bed_price}
                                                    onChange={(e) => setFormData({ ...formData, b2b_extra_bed_price: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        {editingHotel ? "Update Hotel" : "Add Hotel"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredHotels.map((hotel) => (
                                <motion.div
                                    key={hotel.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative h-48 bg-slate-200">
                                            {hotel.image ? (
                                                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <Button size="icon" variant="secondary" onClick={() => handleEdit(hotel)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(hotel.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(hotel.rating || 5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <div className="flex items-center text-slate-600 text-sm mb-2">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {hotel.location || "Not specified"}
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center text-green-600 font-bold">
                                                    AED {hotel.price_per_night}/night
                                                </div>
                                                <div className="flex items-center text-blue-600 text-sm">
                                                    <Bed className="w-4 h-4 mr-1" />
                                                    + AED {hotel.extra_bed_price || 0}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}