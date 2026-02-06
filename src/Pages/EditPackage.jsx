import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar as CalendarIcon,
  Save,
  ArrowLeft,
  Download,
  Hotel,
  MapPin,
  Car,
  Plane,
  Bus,
  Ship,
  Plus,
  X,
  Bed,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

const iconMap = { plane: Plane, car: Car, bus: Bus, ship: Ship };

const destinations = [
  "Dubai, UAE",
  "Paris, France",
  "Tokyo, Japan",
  "New York, USA",
  "London, UK",
  "Singapore",
  "Barcelona, Spain",
  "Rome, Italy",
];

const services = [
  "Air Ticket",
  "Hotel",
  "Visa",
  "Sightseeing",
  "Lunch",
  "Dinner",
  "Add-Ons",
  "Transportation",
  "Airport Pickup & Drop",
];

export default function EditPackage() {
  const urlParams = new URLSearchParams(window.location.search);
  // URL માં જો 'id' હોય તો એડિટ મોડ, અને 'cloneId' હોય તો નવું મોડ
  const packageId = urlParams.get("id");
  const cloneId = urlParams.get("cloneId");
  const targetId = packageId || cloneId;

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    destination: "",
    arrival_date: "",
    departure_date: "",
    adults: 1,
    children: 0,
    services: [],
    status: "draft",
  });
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState([]);

  const [showHotelModal, setShowHotelModal] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [hotelDates, setHotelDates] = useState({ check_in: "", check_out: "" });
  const [extraBeds, setExtraBeds] = useState(0);

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [activityDate, setActivityDate] = useState("");

  const [showTransportModal, setShowTransportModal] = useState(false);
  const [currentTransport, setCurrentTransport] = useState(null);
  const [transportDates, setTransportDates] = useState([]);
  const [transportType, setTransportType] = useState("7 Seater");

  const [currency, setCurrency] = useState("AED");
  const [rooms, setRooms] = useState(1);

  const formatPrice = (amount) => {
    if (!amount) return currency === "INR" ? "₹0" : "AED 0";
    if (currency === "INR")
      return `₹${(amount * 25.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    return `AED ${amount.toLocaleString()}`;
  };

  // Fetch existing data
  const { data: packageData } = useQuery({
    queryKey: ["package", targetId],
    queryFn: () => base44.entities.TravelPackage.list(), // List all and then filter
    enabled: !!targetId,
  });

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

  // Load package data for editing
  useEffect(() => {
    if (packageData && targetId) {
      const pkg = packageData.find((p) => p.id === targetId);
      if (pkg) {
        setFormData({
          name: pkg.name || "",
          phone: pkg.phone || "",
          destination: pkg.destination || "",
          arrival_date: pkg.arrival_date || "",
          departure_date: pkg.departure_date || "",
          adults: pkg.adults || 1,
          children: pkg.children || 0,
          services: pkg.services || [],
          status: pkg.status || "draft",
        });
        setSelectedHotels(pkg.selected_hotels || []);
        setSelectedActivities(pkg.selected_activities || []);
        setSelectedTransport(pkg.selected_transport || []);
        setCurrency(pkg.currency || "AED");
      }
    }
  }, [packageData, targetId]);

  const calculateHotelTotal = () =>
    selectedHotels.reduce((sum, h) => sum + (h.total_price || 0), 0);
  const calculateActivitiesTotal = () =>
    selectedActivities.reduce(
      (sum, act) =>
        sum +
        formData.adults * (act.adult_price || 0) +
        formData.children * (act.child_price || 0),
      0,
    );
  const calculateTransportTotal = () =>
    selectedTransport.reduce((sum, t) => sum + (t.total_price || 0), 0);
  const calculateGrandTotal = () =>
    calculateHotelTotal() +
    calculateActivitiesTotal() +
    calculateTransportTotal();

  // UPDATE logic implemented here
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // જો 'id' URL માં હોય તો જ Update થશે, નહીંતર New Create થશે
      if (packageId) {
        return base44.entities.TravelPackage.update(packageId, data);
      } else {
        return base44.entities.TravelPackage.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setIsSaving(false);
      alert(
        packageId ? "Package Updated Successfully!" : "New Package Created!",
      );
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    const data = {
      ...formData,
      selected_hotels: selectedHotels,
      selected_activities: selectedActivities,
      selected_transport: selectedTransport,
      hotel_total: calculateHotelTotal(),
      activities_total: calculateActivitiesTotal(),
      transport_total: calculateTransportTotal(),
      grand_total: calculateGrandTotal(),
      currency: currency,
      username: localStorage.getItem("userName") || "Guest",
      branch: localStorage.getItem("userBranch") || "Dubai",
    };
    saveMutation.mutate(data);
  };

  const handleAddHotel = (hotel) => {
    setCurrentHotel(hotel);
    setHotelDates({ check_in: "", check_out: "" });
    setExtraBeds(0);
    setRooms(1);
    setShowHotelModal(true);
  };

  const confirmAddHotel = () => {
    if (hotelDates.check_in && hotelDates.check_out && currentHotel) {
      const nights = Math.max(
        1,
        Math.ceil(
          (new Date(hotelDates.check_out) - new Date(hotelDates.check_in)) /
            (1000 * 60 * 60 * 24),
        ),
      );
      const roomPrice = nights * currentHotel.price_per_night;
      const extraBedPrice =
        nights * (currentHotel.extra_bed_price || 0) * extraBeds;
      const totalRoomPrice = roomPrice * rooms;
      const totalExtraBedPrice = extraBedPrice * rooms;

      setSelectedHotels((prev) => [
        ...prev,
        {
          ...currentHotel,
          check_in: hotelDates.check_in,
          check_out: hotelDates.check_out,
          nights,
          rooms,
          extra_beds: extraBeds,
          total_price: totalRoomPrice + totalExtraBedPrice,
          entry_id: Date.now(),
        },
      ]);
      setShowHotelModal(false);
    }
  };

  const handleAddActivity = (activity) => {
    setCurrentActivity(activity);
    setActivityDate("");
    setShowActivityModal(true);
  };

  const confirmAddActivity = () => {
    if (activityDate && currentActivity) {
      setSelectedActivities((prev) => [
        ...prev,
        {
          ...currentActivity,
          date: activityDate,
          entry_id: Date.now(),
        },
      ]);
      setShowActivityModal(false);
    }
  };

  const handleAddTransport = (transport) => {
    setCurrentTransport(transport);
    setTransportDates([]);
    setTransportType("7 Seater");
    setShowTransportModal(true);
  };

  const confirmAddTransport = () => {
    if (transportDates.length > 0 && currentTransport) {
      const typeKey = `price_${transportType.split(" ")[0]}_seater`;
      const pricePerDay = currentTransport[typeKey] || 0;
      const total = pricePerDay * transportDates.length;

      setSelectedTransport((prev) => [
        ...prev,
        {
          ...currentTransport,
          dates: transportDates,
          vehicle_type: transportType,
          days: transportDates.length,
          price: pricePerDay,
          total_price: total,
          entry_id: Date.now(),
        },
      ]);
      setShowTransportModal(false);
    }
  };

  const addTransportDate = (date) => {
    if (
      date &&
      !transportDates.some(
        (d) => new Date(d).getTime() === new Date(date).getTime(),
      )
    ) {
      setTransportDates((prev) =>
        [...prev, date].sort((a, b) => new Date(a) - new Date(b)),
      );
    }
  };

  const removeTransportDate = (dateToRemove) =>
    setTransportDates((prev) => prev.filter((d) => d !== dateToRemove));

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const jsPDF = (await import("jspdf")).jsPDF;
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 0;

      const checkAddPage = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Cover Page logic
      for (let i = 0; i < 50; i++) {
        const ratio = i / 50;
        pdf.setFillColor(15 + 15 * ratio, 23 + 41 * ratio, 42 + 133 * ratio);
        pdf.rect(0, (pageHeight / 50) * i, pageWidth, pageHeight / 50 + 1, "F");
      }

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(48);
      pdf.setFont("helvetica", "bold");
      pdf.text("YOUR JOURNEY", pageWidth / 2, 70, { align: "center" });
      pdf.setFontSize(42);
      pdf.text("BEGINS HERE", pageWidth / 2, 90, { align: "center" });

      pdf.setFillColor(6, 182, 212);
      pdf.rect(pageWidth / 2 - 50, 105, 100, 20, "F");
      pdf.setFontSize(16);
      pdf.text("PREMIUM TRAVEL PACKAGE", pageWidth / 2, 117, {
        align: "center",
      });

      if (formData.name) {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin + 20, 140, contentWidth - 40, 35, "F");
        pdf.setTextColor(30, 64, 175);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text("PREPARED FOR", pageWidth / 2, 152, { align: "center" });
        pdf.setFontSize(22);
        pdf.setFont("helvetica", "bold");
        pdf.text(formData.name.toUpperCase(), pageWidth / 2, 165, {
          align: "center",
        });
      }

      if (formData.destination) {
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(28);
        pdf.text("DESTINATION", pageWidth / 2, 200, { align: "center" });
        pdf.setFontSize(32);
        pdf.setTextColor(6, 182, 212);
        pdf.text(formData.destination.toUpperCase(), pageWidth / 2, 220, {
          align: "center",
        });
      }

      pdf.setFillColor(22, 163, 74);
      pdf.rect(margin + 10, 240, contentWidth - 20, 30, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.text("PACKAGE TOTAL", pageWidth / 2, 252, { align: "center" });
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.text(formatPrice(calculateGrandTotal()), pageWidth / 2, 265, {
        align: "center",
      });

      pdf.save(
        "Travel-Package-" +
          (formData.name?.replace(/\s+/g, "-") || "Package") +
          ".pdf",
      );
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Error generating PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {packageId ? "Edit Package" : "New Package"}
              </h1>
              <p className="text-slate-600">Configure your travel package</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() =>
                setCurrency((prev) => (prev === "AED" ? "INR" : "AED"))
              }
              className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-200"
            >
              {currency === "AED" ? "Switch to INR (₹)" : "Switch to AED"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {/* બટનનું નામ બદલાશે */}
              {packageId ? "Save Changes" : "Save Package"}
            </Button>
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="bg-green-600 hover:bg-green-700"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              PDF
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Traveler Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Destination</Label>
                  <Select
                    value={formData.destination}
                    onValueChange={(v) =>
                      setFormData({ ...formData, destination: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Adults</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.adults}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adults: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Children</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.children}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          children: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Arrival</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />{" "}
                          {formData.arrival_date
                            ? format(new Date(formData.arrival_date), "MMM d")
                            : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            formData.arrival_date
                              ? new Date(formData.arrival_date)
                              : undefined
                          }
                          onSelect={(d) =>
                            setFormData({ ...formData, arrival_date: d })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Departure</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />{" "}
                          {formData.departure_date
                            ? format(new Date(formData.departure_date), "MMM d")
                            : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            formData.departure_date
                              ? new Date(formData.departure_date)
                              : undefined
                          }
                          onSelect={(d) =>
                            setFormData({ ...formData, departure_date: d })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData({ ...formData, status: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleService(service)}
                    >
                      <Checkbox checked={formData.services.includes(service)} />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Hotels</span>
                  <span className="font-bold">
                    {formatPrice(calculateHotelTotal())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Activities</span>
                  <span className="font-bold">
                    {formatPrice(calculateActivitiesTotal())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transport</span>
                  <span className="font-bold">
                    {formatPrice(calculateTransportTotal())}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">TOTAL</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(calculateGrandTotal())}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5" /> Hotels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {selectedHotels.map((hotel, idx) => (
                    <div
                      key={hotel.entry_id || idx}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <img
                        src={hotel.image}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{hotel.name}</p>
                        <p className="text-xs text-slate-500">
                          {hotel.check_in &&
                            format(new Date(hotel.check_in), "MMM d")}{" "}
                          -{" "}
                          {hotel.check_out &&
                            format(new Date(hotel.check_out), "MMM d")}{" "}
                          ({hotel.nights} nights)
                        </p>
                      </div>
                      <span className="font-bold text-green-600">
                        {formatPrice(hotel.total_price)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setSelectedHotels((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {hotels.slice(0, 6).map((hotel) => (
                    <div
                      key={hotel.id}
                      className="p-2 border rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      onClick={() => handleAddHotel(hotel)}
                    >
                      <img
                        src={hotel.image}
                        alt=""
                        className="w-full h-16 rounded object-cover mb-2"
                      />
                      <p className="text-xs font-medium truncate">
                        {hotel.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {formatPrice(hotel.price_per_night)}/night
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {selectedActivities.map((activity, idx) => (
                    <div
                      key={activity.entry_id || idx}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <img
                        src={activity.image}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.name}</p>
                        <p className="text-xs text-slate-500">
                          {activity.date &&
                            format(new Date(activity.date), "MMM d")}
                        </p>
                      </div>
                      <span className="font-bold text-green-600">
                        {formatPrice(
                          formData.adults * activity.adult_price +
                            formData.children * activity.child_price,
                        )}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setSelectedActivities((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {activities.slice(0, 6).map((activity) => (
                    <div
                      key={activity.id}
                      className="p-2 border rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                      onClick={() => handleAddActivity(activity)}
                    >
                      <img
                        src={activity.image}
                        alt=""
                        className="w-full h-16 rounded object-cover mb-2"
                      />
                      <p className="text-xs font-medium truncate">
                        {activity.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        Adult: {formatPrice(activity.adult_price)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" /> Transportation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {selectedTransport.map((t, idx) => (
                    <div
                      key={t.entry_id}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {t.name} - {t.vehicle_type}
                        </p>
                        <p className="text-sm text-slate-500">
                          {t.dates
                            ? t.dates
                                .map((d) => format(new Date(d), "MMM d"))
                                .join(", ")
                            : ""}{" "}
                          ({t.days} days)
                        </p>
                      </div>
                      <span className="font-bold text-green-600">
                        {formatPrice(t.total_price)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setSelectedTransport((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {transports.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 border rounded-xl hover:shadow-md cursor-pointer hover:bg-green-50 transition-all"
                      onClick={() => handleAddTransport(t)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Car className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold">{t.name}</h4>
                          <p className="text-sm text-slate-500">
                            {t.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals remain same but use correct handlers */}
        <AnimatePresence>
          {showHotelModal && currentHotel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowHotelModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">{currentHotel.name}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <CalendarIcon className="w-4 h-4 mr-2" />{" "}
                            {hotelDates.check_in
                              ? format(new Date(hotelDates.check_in), "MMM d")
                              : "Select"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              hotelDates.check_in
                                ? new Date(hotelDates.check_in)
                                : undefined
                            }
                            onSelect={(d) =>
                              setHotelDates({ ...hotelDates, check_in: d })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Check-out</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <CalendarIcon className="w-4 h-4 mr-2" />{" "}
                            {hotelDates.check_out
                              ? format(new Date(hotelDates.check_out), "MMM d")
                              : "Select"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              hotelDates.check_out
                                ? new Date(hotelDates.check_out)
                                : undefined
                            }
                            onSelect={(d) =>
                              setHotelDates({ ...hotelDates, check_out: d })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Rooms</Label>
                      <Input
                        type="number"
                        min="1"
                        value={rooms}
                        onChange={(e) =>
                          setRooms(parseInt(e.target.value) || 1)
                        }
                      />
                    </div>
                    <div>
                      <Label>Extra Bed</Label>
                      <Input
                        type="number"
                        min="0"
                        value={extraBeds}
                        onChange={(e) =>
                          setExtraBeds(parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    onClick={confirmAddHotel}
                    disabled={!hotelDates.check_in || !hotelDates.check_out}
                    className="w-full"
                  >
                    Add Hotel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showActivityModal && currentActivity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowActivityModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">
                  {currentActivity.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <CalendarIcon className="w-4 h-4 mr-2" />{" "}
                          {activityDate
                            ? format(new Date(activityDate), "MMM d")
                            : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            activityDate ? new Date(activityDate) : undefined
                          }
                          onSelect={(d) => setActivityDate(d)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button
                    onClick={confirmAddActivity}
                    disabled={!activityDate}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Add Activity
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTransportModal && currentTransport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowTransportModal(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">
                  {currentTransport.name}
                </h3>
                <div className="space-y-4">
                  <Select
                    value={transportType}
                    onValueChange={setTransportType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7 Seater">7 Seater</SelectItem>
                      <SelectItem value="14 Seater">14 Seater</SelectItem>
                      <SelectItem value="22 Seater">22 Seater</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Add Dates
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar mode="single" onSelect={addTransportDate} />
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap gap-2">
                    {transportDates.map((d) => (
                      <div
                        key={d}
                        className="bg-slate-100 p-1 rounded flex items-center gap-1 text-xs"
                      >
                        {format(new Date(d), "MMM d")}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeTransportDate(d)}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={confirmAddTransport}
                    disabled={transportDates.length === 0}
                    className="w-full"
                  >
                    Confirm Transport
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
