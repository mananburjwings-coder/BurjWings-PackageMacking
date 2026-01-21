import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Hotel,
  MapPin,
  Car,
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Check if user is logged in
  const userBranch = localStorage.getItem("userBranch");
  const userName = localStorage.getItem("userName");

  React.useEffect(() => {
    if (!userBranch) {
      window.location.href = createPageUrl("BranchSelection");
    }
  }, [userBranch]);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBranch, setSelectedBranch] = React.useState(
    userBranch || "Dubai",
  );

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages", userName],
    queryFn: () => base44.entities.TravelPackage.list("-created_date"),
  });

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.phone?.includes(searchTerm) ||
      pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !pkg.branch
      ? selectedBranch === "Dubai"
      : pkg.branch === selectedBranch;
    const matchesUser = pkg.username === userName;
    return matchesSearch && matchesBranch && matchesUser;
  });

  const formatPackagePrice = (amount, currency = "AED") => {
    if (!amount) return currency === "INR" ? "₹0" : "AED 0";
    // If stored amount is already converted or if we just want to show the symbol:
    // Assuming grand_total is stored in the currency unit specified by pkg.currency
    // OR if grand_total is always base, we convert.
    // Based on TravelBooking, grand_total is SUM of components.
    // Components in TravelBooking seem to be calculated based on currency?
    // In TravelBooking: total = ... * rooms.
    // The display there uses formatPrice.
    // But saveMutation saves `calculateGrandTotal()`.
    // calculateGrandTotal() sums `selectedHotels` totals.
    // In TravelBooking, `selectedHotels` totals are calculated in `confirmAddHotel`.
    // `roomPrice * rooms`. `roomPrice` comes from `currentHotel.price_per_night`.
    // Is `price_per_night` converted? No, it comes from DB.
    // So `grand_total` is in BASE currency (AED) usually.
    // So we should convert it if currency is INR?
    // User said "show in $ change to pakage mad currency".
    // If `TravelBooking` saves `grand_total` in AED, but sets `currency` to 'INR', we should convert here?
    // OR does `TravelBooking` save the converted amount?
    // Let's look at TravelBooking logic again.
    // `roomPrice = nights * currentHotel.price_per_night`.
    // `total_price = roomPrice...`.
    // The DB prices are AED.
    // So `grand_total` is in AED.
    // `formatPrice` in TravelBooking converts if INR.
    // So here we should do the same.
    if (currency === "INR")
      return `₹${(amount * 25.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    return `AED ${amount.toLocaleString()}`;
  };

  const { data: hotels = [] } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => base44.entities.Hotel.list(),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: () => base44.entities.Activity.list(),
  });

  const { data: transports = [] } = useQuery({
    queryKey: ["transports"],
    queryFn: () => base44.entities.Transportation.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TravelPackage.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });

  const stats = [
    {
      label: "Total Packages",
      value: packages.length,
      icon: Package,
      color: "blue",
    },
    { label: "Hotels", value: hotels.length, icon: Hotel, color: "indigo" },
    {
      label: "Activities",
      value: activities.length,
      icon: MapPin,
      color: "purple",
    },
    { label: "Transport", value: transports.length, icon: Car, color: "green" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Travel Package Dashboard
            </h1>
            <p className="text-slate-600">
              Welcome, {userName} • Branch: {selectedBranch}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Link to={createPageUrl("ManageHotels")}>
              <Button variant="outline" className="gap-2">
                <Hotel className="w-4 h-4" /> Hotels
              </Button>
            </Link>
            <Link to={createPageUrl("ManageActivities")}>
              <Button variant="outline" className="gap-2">
                <MapPin className="w-4 h-4" /> Activities
              </Button>
            </Link>
            <Link to={createPageUrl("ManageTransport")}>
              <Button variant="outline" className="gap-2">
                <Car className="w-4 h-4" /> Transport
              </Button>
            </Link>
            <Link to={createPageUrl("ManageVisas")}>
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" /> Visas
              </Button>
            </Link>
            <Link to={createPageUrl("ManageSICTransport")}>
              <Button variant="outline" className="gap-2">
                <MapPin className="w-4 h-4" /> SIC Transport
              </Button>
            </Link>
            <Link
              to={`${createPageUrl("TravelBooking")}?branch=${selectedBranch}`}
            >
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" /> New Package
              </Button>
            </Link>
            <Button
              onClick={() => {
                localStorage.clear();
                window.location.href = createPageUrl("BranchSelection");
              }}
              variant="outline"
              className="gap-2"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Packages List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Packages
            </CardTitle>
            <div className="relative w-64">
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <Eye className="w-4 h-4 absolute left-2.5 top-3 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No packages found.</p>
                {packages.length === 0 && (
                  <Link to={createPageUrl("TravelBooking")}>
                    <Button className="mt-4">Create Package</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-slate-900">
                          {pkg.name}
                        </h3>
                        {/* Status badge removed as requested */}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {pkg.destination || "Not set"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {pkg.adults || 0} Adults, {pkg.children || 0} Children
                        </span>
                        {pkg.arrival_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(pkg.arrival_date), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                          {formatPackagePrice(pkg.grand_total, pkg.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={
                          createPageUrl("TravelBooking") + "?cloneId=" + pkg.id
                        }
                      >
                        <Button variant="outline" size="sm" className="gap-1">
                          <Package className="w-4 h-4" /> Clone
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => deleteMutation.mutate(pkg.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
