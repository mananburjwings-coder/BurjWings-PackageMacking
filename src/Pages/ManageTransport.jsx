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
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Car } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ADMIN_USERS } from "@/utils/constants";

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
    b2b_price_50_seater: 0,
  });

  const queryClient = useQueryClient();
  const userName = localStorage.getItem("userName");

  // Admin Configuration
const isAdmin = ADMIN_USERS.includes(userName);
  // Fetch Transport Data
  const {
    data: transports = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["transports"],
    queryFn: () => base44.entities.Transportation.list(),
    staleTime: 0,
  });

  const filteredTransports = transports.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Transportation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      base44.entities.Transportation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      resetForm();
    },
  });

  // Hard Delete with cache clearing to prevent recycling
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Transportation.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["transports"] });
      const previousData = queryClient.getQueryData(["transports"]);
      queryClient.setQueryData(["transports"], (old) =>
        old ? old.filter((item) => item.id !== deletedId) : [],
      );
      return { previousData };
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["transports"] });
      refetch();
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["transports"], context.previousData);
      alert("Delete failed: " + err.message);
    },
  });

  const resetForm = () => {
    setFormData({
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
      b2b_price_50_seater: 0,
    });
    setEditingTransport(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTransport && editingTransport.id) {
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
      b2b_price_50_seater: transport.b2b_price_50_seater || 0,
    });
    setEditingTransport(transport);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this transport permanently?",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Transportation
            </h1>
            <p className="text-slate-600">
              Add 7, 14, 22, 35, 50 seater options
            </p>
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
            {isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => resetForm()}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Transport
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTransport
                        ? "Edit Transport"
                        : "Add New Transport"}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Fill out the form to add or edit transportation options.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Transport Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        placeholder="e.g. Luxury SUV"
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
                      />
                    </div>
                    <div>
                      <Label className="font-bold text-blue-600">
                        B2C Rates (AED)
                      </Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {["7", "14", "22", "35", "50"].map((size) => (
                          <div key={size}>
                            <Label>{size} Seater</Label>
                            <Input
                              type="number"
                              value={formData[`price_${size}_seater`]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [`price_${size}_seater`]: parseFloat(
                                    e.target.value,
                                  ),
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="font-bold text-green-600">
                        B2B Rates (AED)
                      </Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {["7", "14", "22", "35", "50"].map((size) => (
                          <div key={size}>
                            <Label>B2B {size} Seater</Label>
                            <Input
                              type="number"
                              value={formData[`b2b_price_${size}_seater`]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [`b2b_price_${size}_seater`]: parseFloat(
                                    e.target.value,
                                  ),
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      {editingTransport ? "Update" : "Save"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTransports.map((transport) => (
                <motion.div
                  key={transport.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative h-40 bg-slate-100">
                      {transport.image ? (
                        <img
                          src={transport.image}
                          alt={transport.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Car className="w-12 h-12" />
                        </div>
                      )}
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => handleEdit(transport)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(transport.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">
                        {transport.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-1">
                        {transport.description || "No description"}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        {["7", "14", "22", "35", "50"].map((size) => (
                          <div
                            key={size}
                            className="flex justify-between border-b pb-1"
                          >
                            <span>{size} Seater:</span>
                            <span className="font-bold text-green-700">
                              AED {transport[`price_${size}_seater`] || 0}
                            </span>
                          </div>
                        ))}
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
