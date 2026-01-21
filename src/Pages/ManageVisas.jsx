import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ManageVisas() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVisa, setEditingVisa] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        country: "",
        image: "",
        adult_price: 0,
        child_price: 0,
        b2b_adult_price: 0,
        b2b_child_price: 0
    });

    const queryClient = useQueryClient();

    const { data: visas = [], isLoading } = useQuery({
        queryKey: ['visas'],
        queryFn: () => base44.entities.Visa.list()
    });

    const filteredVisas = visas.filter(v => 
        v.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Visa.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visas'] });
            resetForm();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Visa.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visas'] });
            resetForm();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Visa.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visas'] })
    });

    const resetForm = () => {
        setFormData({ country: "", image: "", adult_price: 0, child_price: 0, b2b_adult_price: 0, b2b_child_price: 0 });
        setEditingVisa(null);
        setIsDialogOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingVisa) {
            updateMutation.mutate({ id: editingVisa.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (visa) => {
        setFormData({
            country: visa.country,
            image: visa.image || "",
            adult_price: visa.adult_price || 0,
            child_price: visa.child_price || 0,
            b2b_adult_price: visa.b2b_adult_price || 0,
            b2b_child_price: visa.b2b_child_price || 0
        });
        setEditingVisa(visa);
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Manage Visas</h1>
                        <p className="text-slate-600">Add and edit visa pricing</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Input 
                            placeholder="Search visas..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64"
                        />
                        <Link to={createPageUrl("Dashboard")}>
                            <Button variant="outline">Back</Button>
                        </Link>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => resetForm()}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Visa
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{editingVisa ? "Edit Visa" : "Add New Visa"}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label>Country / Visa Name</Label>
                                        <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required placeholder="e.g. Dubai Tourist Visa" />
                                    </div>
                                    <div>
                                        <Label>Image</Label>
                                        <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Adult Price (AED)</Label>
                                            <Input type="number" value={formData.adult_price} onChange={(e) => setFormData({ ...formData, adult_price: parseFloat(e.target.value) })} required />
                                        </div>
                                        <div>
                                            <Label>Child Price (AED)</Label>
                                            <Input type="number" value={formData.child_price} onChange={(e) => setFormData({ ...formData, child_price: parseFloat(e.target.value) })} required />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                                        {editingVisa ? "Update Visa" : "Add Visa"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {isLoading ? <div className="text-center py-12">Loading...</div> : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredVisas.map((visa) => (
                                <motion.div key={visa.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                                        {visa.image && (
                                            <div className="h-40 w-full bg-slate-100">
                                                <img src={visa.image} alt={visa.country} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                {!visa.image && (
                                                    <div className="p-3 bg-orange-100 rounded-xl">
                                                        <FileText className="w-8 h-8 text-orange-600" />
                                                    </div>
                                                )}
                                                <div className="flex gap-2 ml-auto">
                                                    <Button size="icon" variant="outline" onClick={() => handleEdit(visa)}><Edit className="w-4 h-4" /></Button>
                                                    <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(visa.id)}><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg mb-2">{visa.country}</h3>
                                            <div className="flex justify-between items-center pt-3 border-t">
                                                <div className="text-blue-600 font-bold">Adult: AED {visa.adult_price}</div>
                                                <div className="text-purple-600 font-bold">Child: AED {visa.child_price}</div>
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