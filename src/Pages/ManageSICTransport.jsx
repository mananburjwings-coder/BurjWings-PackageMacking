import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ManageSICTransport() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    place_name: "",
    image: "",
    description: "",
    adult_price: 0,
    child_price: 0,
    b2b_adult_price: 0,
    b2b_child_price: 0,
  });

  const queryClient = useQueryClient();

  const { data: sicTransports = [], isLoading } = useQuery({
    queryKey: ["sicTransports"],
    queryFn: () => base44.entities.SICTransport.list(),
  });

  const filteredItems = sicTransports.filter(
    (item) =>
      item.place_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SICTransport.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sicTransports"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SICTransport.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sicTransports"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SICTransport.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sicTransports"] }),
  });

  const resetForm = () => {
    setFormData({
      place_name: "",
      image: "",
      description: "",
      adult_price: 0,
      child_price: 0,
      b2b_adult_price: 0,
      b2b_child_price: 0,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      place_name: item.place_name,
      image: item.image || "",
      description: item.description || "",
      adult_price: item.adult_price || 0,
      child_price: item.child_price || 0,
      b2b_adult_price: item.b2b_adult_price || 0,
      b2b_child_price: item.b2b_child_price || 0,
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage SIC Transport
            </h1>
            <p className="text-slate-600">Seat-in-Coach Transport by Place</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Input
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline">Back</Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() => resetForm()}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add SIC Transport
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem
                      ? "Edit SIC Transport"
                      : "Add New SIC Transport"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Place Name</Label>
                    <Input
                      value={formData.place_name}
                      onChange={(e) =>
                        setFormData({ ...formData, place_name: e.target.value })
                      }
                      required
                      placeholder="e.g. Dubai City Tour"
                    />
                  </div>
                  <div>
                    <Label>Image</Label>
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) =>
                        setFormData({ ...formData, image: url })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description..."
                    />
                  </div>
                  <div>
                    <Label className="font-bold text-blue-600">B2C Rates</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label>Adult Price (AED)</Label>
                        <Input
                          type="number"
                          value={formData.adult_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              adult_price: parseFloat(e.target.value),
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Child Price (AED)</Label>
                        <Input
                          type="number"
                          value={formData.child_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              child_price: parseFloat(e.target.value),
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="font-bold text-green-600">
                      B2B Rates
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label>B2B Adult Price (AED)</Label>
                        <Input
                          type="number"
                          value={formData.b2b_adult_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              b2b_adult_price: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>B2B Child Price (AED)</Label>
                        <Input
                          type="number"
                          value={formData.b2b_child_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              b2b_child_price: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    {editingItem ? "Update SIC Transport" : "Add SIC Transport"}
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
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-slate-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.place_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-teal-600" />
                        <h3 className="font-bold text-lg">{item.place_name}</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {item.description || "No description"}
                      </p>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="text-blue-600 font-bold">
                          Adult: AED {item.adult_price}
                        </div>
                        <div className="text-teal-600 font-bold">
                          Child: AED {item.child_price}
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
