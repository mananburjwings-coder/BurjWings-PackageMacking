import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Car, DollarSign } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ManageTransport() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTransport, setEditingTransport] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        description: "",
        price_7_seater: 0,
        price_14_seater: 0,
        price_22_seater: 0,
        price_35_seater: 0,
        price_50_seater: 0,
        b2b_price_7_seater: 0,
        b2b_price_14_seater: 0,
        b2b_price_22_seater: 0,
        b2b_price_35_seater: 0,
        b2b_price_50_seater: 0
    });

    const queryClient = useQueryClient();

    const { data: transports = [], isLoading } = useQuery({
        queryKey: ['transports'],
        queryFn: () => base44.entities.Transportation.list()
    });

    const filteredTransports = transports.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Transportation.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transports'] });
            resetForm();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Transportation.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transports'] });
            resetForm();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Transportation.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transports'] })
    });

    const resetForm = () => {
        setFormData({ 
            name: "", image: "", description: "", 
            price_7_seater: 0, price_14_seater: 0, price_22_seater: 0, 
            price_35_seater: 0, price_50_seater: 0,
            b2b_price_7_seater: 0, b2b_price_14_seater: 0, b2b_price_22_seater: 0, 
            b2b_price_35_seater: 0, b2b_price_50_seater: 0
        });
        setEditingTransport(null);
        setIsDialogOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingTransport) {
            updateMutation.mutate({ id: editingTransport.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (transport) => {
        setFormData({
            name: transport.name,
            image: transport.image || "",
            description: transport.description || "",
            price_7_seater: transport.price_7_seater || 0,
            price_14_seater: transport.price_14_seater || 0,
            price_22_seater: transport.price_22_seater || 0,
            price_35_seater: transport.price_35_seater || 0,
            price_50_seater: transport.price_50_seater || 0,
            b2b_price_7_seater: transport.b2b_price_7_seater || 0,
            b2b_price_14_seater: transport.b2b_price_14_seater || 0,
            b2b_price_22_seater: transport.b2b_price_22_seater || 0,
            b2b_price_35_seater: transport.b2b_price_35_seater || 0,
            b2b_price_50_seater: transport.b2b_price_50_seater || 0
        });
        setEditingTransport(transport);
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Manage Transportation</h1>
                        <p className="text-slate-600">Add 7, 14, 22, 35, 50 seater options</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Input 
                            placeholder="Search transport..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64"
                        />
                        <Link to={createPageUrl("Dashboard")}>
                            <Button variant="outline">Back</Button>
                        </Link>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => resetForm()}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Transport
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{editingTransport ? "Edit Transport" : "Add New Transport"}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label>Transport Name (e.g. 7 Seater)</Label>
                                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. 7 Seater Car" />
                                    </div>
                                    <div>
                                        <Label>Image</Label>
                                        <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Comfortable AC Van" />
                                    </div>
                                    <div>
                                        <Label className="font-bold text-blue-600">B2C Rates</Label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <Label>7 Seater (AED)</Label>
                                                <Input type="number" value={formData.price_7_seater} onChange={(e) => setFormData({ ...formData, price_7_seater: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <Label>14 Seater (AED)</Label>
                                                <Input type="number" value={formData.price_14_seater} onChange={(e) => setFormData({ ...formData, price_14_seater: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <Label>22 Seater (AED)</Label>
                                                <Input type="number" value={formData.price_22_seater} onChange={(e) => setFormData({ ...formData, price_22_seater: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <Label>35 Seater (AED)</Label>
                                                <Input type="number" value={formData.price_35_seater} onChange={(e) => setFormData({ ...formData, price_35_seater: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <Label>50 Seater (AED)</Label>
                                                <Input type="number" value={formData.price_50_seater} onChange={(e) => setFormData({ ...formData, price_50_seater: parseFloat(e.target.value) })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="font-bold text-green-600">B2B Rates</Label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <Label>B2B 7 Seater (AED)</Label>
                                                <Input type="number" value={formData.b2b_price_7_seater} onChange={(e) => setFormData({ ...formData, b2b_price_7_seater: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <Label>B2B 14 Seater (AED)</Label>
                                                <Input type="number" value={formData.b2b_price_14_seater} onChange={(e) => setFormData({ ...formData, b2b_price_14_seater: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <Label>B2B 22 Seater (AED)</Label>
                                                <Input type="number" value={formData.b2b_price_22_seater} onChange={(e) => setFormData({ ...formData, b2b_price_22_seater: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <Label>B2B 35 Seater (AED)</Label>
                                                <Input type="number" value={formData.b2b_price_35_seater} onChange={(e) => setFormData({ ...formData, b2b_price_35_seater: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <Label>B2B 50 Seater (AED)</Label>
                                                <Input type="number" value={formData.b2b_price_50_seater} onChange={(e) => setFormData({ ...formData, b2b_price_50_seater: parseFloat(e.target.value) })} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                        {editingTransport ? "Update Transport" : "Add Transport"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {isLoading ? <div className="text-center py-12">Loading...</div> : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredTransports.map((transport) => (
                                <motion.div key={transport.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                                        {transport.image && (
                                            <div className="h-40 w-full bg-slate-100">
                                                <img src={transport.image} alt={transport.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                {!transport.image && (
                                                    <div className="p-3 bg-green-100 rounded-xl">
                                                        <Car className="w-8 h-8 text-green-600" />
                                                    </div>
                                                )}
                                                <div className="flex gap-2 ml-auto">
                                                    <Button size="icon" variant="outline" onClick={() => handleEdit(transport)}><Edit className="w-4 h-4" /></Button>
                                                    <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(transport.id)}><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg mb-2">{transport.name}</h3>
                                            <p className="text-slate-600 text-sm mb-4">{transport.description || "No description"}</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex justify-between"><span>7 Seater:</span> <span className="font-bold text-green-600">AED {transport.price_7_seater || 0}</span></div>
                                                <div className="flex justify-between"><span>14 Seater:</span> <span className="font-bold text-green-600">AED {transport.price_14_seater || 0}</span></div>
                                                <div className="flex justify-between"><span>22 Seater:</span> <span className="font-bold text-green-600">AED {transport.price_22_seater || 0}</span></div>
                                                <div className="flex justify-between"><span>35 Seater:</span> <span className="font-bold text-green-600">AED {transport.price_35_seater || 0}</span></div>
                                                <div className="flex justify-between"><span>50 Seater:</span> <span className="font-bold text-green-600">AED {transport.price_50_seater || 0}</span></div>
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