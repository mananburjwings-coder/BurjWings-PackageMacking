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
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ADMIN_USERS } from "@/utils/constants";

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
    b2b_child_price: 0,
  });

  const queryClient = useQueryClient();
  const userName = localStorage.getItem("userName");

  // Admin Configuration
const isAdmin = ADMIN_USERS.includes(userName);
  // Fetch Visas from Supabase
  const {
    data: visas = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["visas"],
    queryFn: () => base44.entities.Visa.list(),
    staleTime: 0,
  });

  const filteredVisas = visas.filter((v) =>
    v.country?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Visa.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visas"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Visa.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visas"] });
      resetForm();
    },
  });

  // Strict Delete with cache removal
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Visa.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["visas"] });
      const previousData = queryClient.getQueryData(["visas"]);
      queryClient.setQueryData(["visas"], (old) =>
        old ? old.filter((item) => item.id !== deletedId) : [],
      );
      return { previousData };
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["visas"] });
      refetch();
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["visas"], context.previousData);
      alert("Delete failed: " + err.message);
    },
  });

  const resetForm = () => {
    setFormData({
      country: "",
      image: "",
      adult_price: 0,
      child_price: 0,
      b2b_adult_price: 0,
      b2b_child_price: 0,
    });
    setEditingVisa(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVisa && editingVisa.id) {
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
      b2b_child_price: visa.b2b_child_price || 0,
    });
    setEditingVisa(visa);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this visa permanently?")
    ) {
      deleteMutation.mutate(id);
    }
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
            {isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => resetForm()}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Visa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingVisa ? "Edit Visa" : "Add New Visa"}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Provide details about the visa country and its pricing for
                      adults and children.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Country / Visa Name</Label>
                      <Input
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        required
                        placeholder="e.g. Dubai Tourist Visa"
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
                    <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
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
                    <Button
                      type="submit"
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      {editingVisa ? "Update Visa" : "Add Visa"}
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
              {filteredVisas.map((visa) => (
                <motion.div
                  key={visa.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative h-40 bg-slate-100">
                      {visa.image ? (
                        <img
                          src={visa.image}
                          alt={visa.country}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <FileText className="w-12 h-12" />
                        </div>
                      )}
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => handleEdit(visa)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(visa.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{visa.country}</h3>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="text-blue-600 font-bold">
                          Adult: AED {visa.adult_price}
                        </div>
                        <div className="text-purple-600 font-bold">
                          Child: AED {visa.child_price}
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
