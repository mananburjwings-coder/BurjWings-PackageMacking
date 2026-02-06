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
  User,
  Phone,
  Users,
  CheckCircle,
  Star,
  Clock,
  ArrowRight,
  FileText,
  AlignRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, addDays, differenceInDays, parseISO } from "date-fns";

const timeSlots = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Arrival",
  "Departure",
];

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

export default function TravelBooking() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("id"); // ખાતરી કરો કે અહીં 'id' જ લખ્યું છે
  const cloneId = urlParams.get("cloneId");

  console.log("Edit ID from URL:", editId); // આનાથી ખબર પડશે કે ID મળે છે કે નહીં
  const urlBranch = urlParams.get("branch");
  console.log("Edit ID from URL:", editId);
  console.log("Branch from URL:", urlBranch);
  // Check if user is logged in
  const userBranch = localStorage.getItem("userBranch");
  const userName = localStorage.getItem("userName");

  React.useEffect(() => {
    if (!userBranch) {
      window.location.href = createPageUrl("BranchSelection");
    }
  }, [userBranch]);

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [includeTravelerInfo, setIncludeTravelerInfo] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "+971",
    destination: "",
    arrival_date: "",
    departure_date: "",
    adults: 1,
    children: 0,
    services: [],
    status: "draft",
    branch: urlBranch || userBranch || "Dubai",
  });
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState([]);
  const [selectedVisas, setSelectedVisas] = useState([]);
  const [selectedSICTransports, setSelectedSICTransports] = useState([]);
  const [commission, setCommission] = useState(0);
  const [includeFixedCharges, setIncludeFixedCharges] = useState(true);
  const [additionalAmount, setAdditionalAmount] = useState(0);

  // Modal states
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [hotelDates, setHotelDates] = useState({ check_in: "", check_out: "" });
  const [extraBeds, setExtraBeds] = useState(0);

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [activityDate, setActivityDate] = useState("");
  const [activityTimeSlot, setActivityTimeSlot] = useState("Morning");
  const [activeDay, setActiveDay] = useState(0);
  const [activityAdults, setActivityAdults] = useState(1);
  const [activityChildren, setActivityChildren] = useState(0);

  const [showTransportModal, setShowTransportModal] = useState(false);
  const [currentTransport, setCurrentTransport] = useState(null);
  const [transportDates, setTransportDates] = useState([]);
  const [transportType, setTransportType] = useState("7 Seater");

  const [showVisaModal, setShowVisaModal] = useState(false);
  const [currentVisa, setCurrentVisa] = useState(null);

  // Popover states for auto-close
  const [hotelCheckInOpen, setHotelCheckInOpen] = useState(false);
  const [hotelCheckOutOpen, setHotelCheckOutOpen] = useState(false);
  const [activityDateOpen, setActivityDateOpen] = useState(false);
  const [transportDateOpen, setTransportDateOpen] = useState(false);

  // Search states for steps
  const [visaSearch, setVisaSearch] = useState("");
  const [sicSearch, setSicSearch] = useState("");
  const [hotelSearch, setHotelSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [transportSearch, setTransportSearch] = useState("");

  const [currency, setCurrency] = useState("AED");
  const [rooms, setRooms] = useState(0);
  const rateType = localStorage.getItem("userRole") || "B2C"; // Get from localStorage

  const formatPrice = (amount) => {
    if (!amount)
      return currency === "INR" ? "₹0" : currency === "USD" ? "$0" : "AED 0";
    if (currency === "INR")
      return `₹${(amount * 25.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (currency === "USD")
      return `$${(amount / 3.65).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `AED ${amount.toLocaleString()}`;
  };

  // PDF Safe Price
  const formatPricePDF = (amount) => {
    if (!amount)
      return currency === "INR"
        ? "Rs 0"
        : currency === "USD"
          ? "USD 0"
          : "AED 0";
    if (currency === "INR")
      return `Rs ${(amount * 25.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (currency === "USD")
      return `USD ${(amount / 3.65).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `AED ${amount.toLocaleString()}`;
  };

  // Fetch data from database
  const { data: packageData } = useQuery({
    queryKey: ["package", editId || cloneId],
    queryFn: () => base44.entities.TravelPackage.get(editId || cloneId),
    enabled: !!(editId || cloneId),
  });

  // TravelBooking.jsx ની અંદર
  useEffect(() => {
    if (packageData) {
      const pkg = packageData;

      // મુખ્ય ફોર્મ ડેટા
      setFormData({
        name: pkg.name || "",
        phone: pkg.phone || "",
        countryCode: pkg.countryCode || "+971",
        destination: pkg.destination || "",
        arrival_date: pkg.arrival_date || "",
        departure_date: pkg.departure_date || "",
        adults: pkg.adults || 1,
        children: pkg.children || 0,
        services: pkg.services || [],
        branch: pkg.branch || userBranch,
        status: editId ? pkg.status || "draft" : "draft",
      });

      // સિલેક્ટ કરેલી આઈટમ્સ લોડ કરો
      setSelectedHotels(pkg.selected_hotels || []);
      setSelectedActivities(pkg.selected_activities || []);
      setSelectedTransport(pkg.selected_transport || []);
      setSelectedVisas(pkg.selected_visas || []);
      setSelectedSICTransports(pkg.selected_sic_transports || []);

      // બાકીની કિંમતો
      setCurrency(pkg.currency || "AED");
      setCommission(pkg.commission || 0);
      setAdditionalAmount(pkg.additional_amount || 0);
      setIncludeFixedCharges(pkg.fixed_charges > 0);
    }
  }, [packageData, editId]);

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
  const { data: visas = [] } = useQuery({
    queryKey: ["visas"],
    queryFn: () => base44.entities.Visa.list(),
  });
  const { data: sicTransports = [] } = useQuery({
    queryKey: ["sicTransports"],
    queryFn: () => base44.entities.SICTransport.list(),
  });

  // Calculate totals
  const calculateHotelTotal = () =>
    selectedHotels.reduce((sum, h) => sum + (h.total_price || 0), 0);
  const calculateActivitiesTotal = () =>
    selectedActivities.reduce((sum, a) => {
      const adultPrice =
        rateType === "B2B"
          ? a.b2b_adult_price || a.adult_price || 0
          : a.adult_price || 0;
      const childPrice =
        rateType === "B2B"
          ? a.b2b_child_price || a.child_price || 0
          : a.child_price || 0;
      const adults =
        a.custom_adults !== undefined ? a.custom_adults : formData.adults || 0;
      const children =
        a.custom_children !== undefined
          ? a.custom_children
          : formData.children || 0;
      return sum + adults * adultPrice + children * childPrice;
    }, 0);
  const calculateTransportTotal = () =>
    selectedTransport.reduce((sum, t) => sum + (t.total_price || 0), 0);
  const calculateVisaTotal = () =>
    selectedVisas.reduce((sum, v) => {
      const adultPrice =
        rateType === "B2B"
          ? v.b2b_adult_price || v.adult_price || 0
          : v.adult_price || 0;
      const childPrice =
        rateType === "B2B"
          ? v.b2b_child_price || v.child_price || 0
          : v.child_price || 0;
      return (
        sum +
        (formData.adults || 0) * adultPrice +
        (formData.children || 0) * childPrice
      );
    }, 0);
  const calculateSICTransportTotal = () =>
    selectedSICTransports.reduce((sum, s) => {
      const adultPrice =
        rateType === "B2B"
          ? s.b2b_adult_price || s.adult_price || 0
          : s.adult_price || 0;
      const childPrice =
        rateType === "B2B"
          ? s.b2b_child_price || s.child_price || 0
          : s.child_price || 0;
      return (
        sum +
        (formData.adults || 0) * adultPrice +
        (formData.children || 0) * childPrice
      );
    }, 0);
  const fixedCharges = includeFixedCharges ? 50 : 0; // Fixed 50 AED (24*7 Travel Assistant & DMC)
  const calculateGrandTotal = () =>
    calculateHotelTotal() +
    calculateActivitiesTotal() +
    calculateTransportTotal() +
    calculateVisaTotal() +
    calculateSICTransportTotal() +
    commission +
    fixedCharges +
    (additionalAmount || 0);

  // Save package
  const saveMutation = useMutation({
  mutationFn: async (data) => {
    if (editId) {
      // અગત્યનું: editId વાપરવું
      return base44.entities.TravelPackage.update(editId, data);
    } else {
      return base44.entities.TravelPackage.create(data);
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["packages"] });
    setIsSaving(false);
    alert(editId ? "Changes Saved!" : "Package Created!");
    window.location.href = createPageUrl("Dashboard");
  },
  onError: (error) => {
    setIsSaving(false);
    alert("Error: " + error.message);
  }
});

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.destination) {
      alert("Please fill all required fields");
      return;
    }

    setIsSaving(true);

    const payload = {
      ...formData,
      username: userName,
      selected_hotels: selectedHotels,
      selected_activities: selectedActivities,
      selected_transport: selectedTransport,
      selected_visas: selectedVisas,
      selected_sic_transports: selectedSICTransports,

      // સરવાળા (Totals)
      hotel_total: calculateHotelTotal(),
      activities_total: calculateActivitiesTotal(),
      transport_total: calculateTransportTotal(),
      visa_total: calculateVisaTotal(),
      sic_transport_total: calculateSICTransportTotal(),

      commission,
      fixed_charges: fixedCharges,
      additional_amount: additionalAmount || 0,
      grand_total: calculateGrandTotal(),
      currency,
    };

    saveMutation.mutate(payload);
  };

  // Handlers
  const handleAddHotel = (hotel) => {
    setCurrentHotel(hotel);
    setHotelDates({
      check_in: formData.arrival_date || "",
      check_out: formData.departure_date || "",
    });
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
      const pricePerNight =
        rateType === "B2B"
          ? currentHotel.b2b_price_per_night || currentHotel.price_per_night
          : currentHotel.price_per_night;
      const extraBedPricePerNight =
        rateType === "B2B"
          ? currentHotel.b2b_extra_bed_price ||
            currentHotel.extra_bed_price ||
            0
          : currentHotel.extra_bed_price || 0;
      const roomPrice = nights * pricePerNight;
      const extraBedPrice = nights * extraBedPricePerNight * extraBeds;

      // Total price calculation considering rooms
      // Assumption: extra beds are per room, so total extra beds = extraBeds * rooms
      // Or maybe extraBeds is total? Let's assume per room as labeled in modal.
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
    setActivityTimeSlot("Morning");
    setActivityAdults(formData.adults || 1);
    setActivityChildren(formData.children || 0);
    setShowActivityModal(true);
  };

  const confirmAddActivity = () => {
    if (activityDate && currentActivity) {
      setSelectedActivities((prev) => [
        ...prev,
        {
          ...currentActivity,
          date: activityDate,
          time_slot: activityTimeSlot,
          custom_adults: activityAdults,
          custom_children: activityChildren,
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
      const typeKey =
        rateType === "B2B"
          ? `b2b_price_${transportType.split(" ")[0]}_seater`
          : `price_${transportType.split(" ")[0]}_seater`;
      const fallbackKey = `price_${transportType.split(" ")[0]}_seater`;
      const pricePerDay =
        currentTransport[typeKey] || currentTransport[fallbackKey] || 0;
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

  const removeTransportDate = (dateToRemove) => {
    setTransportDates((prev) => prev.filter((d) => d !== dateToRemove));
  };

  const handleAddVisa = (visa) => {
    setSelectedVisas((prev) => [...prev, { ...visa, entry_id: Date.now() }]);
  };

  const handleAddSICTransport = (sic) => {
    setSelectedSICTransports((prev) => [
      ...prev,
      { ...sic, entry_id: Date.now() },
    ]);
  };

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  // PDF Generation
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn("Image load failed, trying without CORS:", src);
        const imgNoCors = new Image();
        imgNoCors.onload = () => resolve(imgNoCors);
        imgNoCors.onerror = reject;
        imgNoCors.src = src;
      };
      img.src = src;
    });

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const jsPDF = (await import("jspdf")).jsPDF;
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210,
        pageHeight = 297,
        margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 0;

      const checkAddPage = (space) => {
        if (yPosition + space > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Branch Settings
      const isDubai = formData.branch === "Dubai";
      const companyName = isDubai
        ? "Burj Wings Tourism LLC"
        : "Go Dubai Online";
      const logoUrl = isDubai
        ? "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689f3e961bc8dd845cdffca0/e1b4644a8_WhatsApp_Image_2025-09-24_at_121734_PM-removebg-preview.png"
        : "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689f3e961bc8dd845cdffca0/fa2fc3600_WhatsAppImage2025-10-25at44624PM.jpg";

      // ======================
      // COVER PAGE (FIXED)
      // ======================

      // Background gradient
      for (let i = 0; i < 100; i++) {
        const ratio = i / 100;
        pdf.setFillColor(240 + ratio * 15, 245 + ratio * 10, 250 + ratio * 5);
        pdf.rect(
          0,
          (pageHeight / 100) * i,
          pageWidth,
          pageHeight / 100 + 1,
          "F",
        );
      }

      // Header bar
      pdf.setFillColor(30, 58, 138);
      pdf.rect(0, 0, pageWidth, 40, "F");

      // Gold accent
      pdf.setFillColor(217, 119, 6);
      pdf.rect(0, 40, pageWidth, 4, "F");

      // Logo card
      try {
        const logoImg = await loadImage(logoUrl);
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect((pageWidth - 70) / 2, 52, 70, 50, 4, 4, "F");
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(1);
        pdf.roundedRect((pageWidth - 70) / 2, 52, 70, 50, 4, 4, "S");
        pdf.addImage(logoImg, "PNG", (pageWidth - 60) / 2, 58, 60, 38);
      } catch (e) {
        console.error("Logo load failed", e);
      }

      // Company name
      // Company name (BLACK)
      pdf.setTextColor(0, 0, 0); // Black
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(companyName.toUpperCase(), pageWidth / 2, 115, {
        align: "center",
      });

      // Premium badge
      pdf.setFillColor(14, 165, 233);
      pdf.roundedRect(margin + 30, 125, contentWidth - 60, 10, 4, 4, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("PREMIUM TRAVEL PACKAGE", pageWidth / 2, 132, {
        align: "center",
      });

      // Dates box
      if (formData.arrival_date && formData.departure_date) {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin + 30, 142, contentWidth - 60, 14, 4, 4, "F");
        pdf.setDrawColor(203, 213, 225);
        pdf.roundedRect(margin + 30, 142, contentWidth - 60, 14, 4, 4, "S");

        pdf.setTextColor(30, 58, 138);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `${format(new Date(formData.arrival_date), "MMM d, yyyy")} - ${format(
            new Date(formData.departure_date),
            "MMM d, yyyy",
          )}`,
          pageWidth / 2,
          151,
          { align: "center" },
        );
      }

      // Prepared for
      if (formData.name) {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin + 25, 165, contentWidth - 50, 22, 5, 5, "F");
        pdf.setDrawColor(203, 213, 225);
        pdf.roundedRect(margin + 25, 165, contentWidth - 50, 22, 5, 5, "S");

        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.text("PREPARED FOR", pageWidth / 2, 173, { align: "center" });

        pdf.setTextColor(30, 58, 138);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(formData.name.toUpperCase(), pageWidth / 2, 183, {
          align: "center",
        });
      }

      // Destination
      // Destination
      if (formData.destination) {
        pdf.setTextColor(0, 0, 0); // BLACK
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("DESTINATION", pageWidth / 2, 205, { align: "center" });

        pdf.setTextColor(0, 0, 0); // BLACK
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text(formData.destination.toUpperCase(), pageWidth / 2, 217, {
          align: "center",
        });
      }

      // Price per person (bottom fixed)
      const grandTotal = calculateGrandTotal();
      const totalPersons =
        (formData.adults || 0) + (formData.children || 0) || 1;
      const perPersonPrice = grandTotal / totalPersons;

      pdf.setFillColor(22, 163, 74);
      pdf.roundedRect(margin + 20, 235, contentWidth - 40, 22, 6, 6, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("PRICE PER PERSON", pageWidth / 2, 243, { align: "center" });

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(formatPricePDF(perPersonPrice), pageWidth / 2, 253, {
        align: "center",
      });

      // Trip Overview - Professional layout
      pdf.addPage();
      yPosition = margin;

      // Professional header
      pdf.setFillColor(30, 58, 138);
      pdf.rect(0, yPosition, pageWidth, 22, "F");
      pdf.setFillColor(217, 119, 6);
      pdf.rect(0, yPosition + 22, pageWidth, 3, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("TRIP OVERVIEW", pageWidth / 2, yPosition + 15, {
        align: "center",
      });
      yPosition += 35;

      if (includeTravelerInfo) {
        // Professional card
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, yPosition, contentWidth, 60, 6, 6, "F");
        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, yPosition, contentWidth, 60, 6, 6, "S");

        // Header bar inside card
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(margin, yPosition, contentWidth, 16, 6, 6, "F");

        pdf.setTextColor(30, 58, 138);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("TRAVELER INFORMATION", margin + 10, yPosition + 11);

        // Content in two columns
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        const infoY = yPosition + 28;

        pdf.setFont("helvetica", "bold");
        pdf.text("Name:", margin + 10, infoY);
        pdf.setFont("helvetica", "normal");
        pdf.text(formData.name || "-", margin + 35, infoY);

        pdf.setFont("helvetica", "bold");
        pdf.text("Phone:", margin + 10, infoY + 10);
        pdf.setFont("helvetica", "normal");
        pdf.text(formData.phone || "-", margin + 35, infoY + 10);

        pdf.setFont("helvetica", "bold");
        pdf.text("Travelers:", pageWidth / 2, infoY);
        pdf.setFont("helvetica", "normal");
        pdf.text(
          `${formData.adults || 0} Adults, ${formData.children || 0} Children`,
          pageWidth / 2 + 25,
          infoY,
        );

        yPosition += 70;
      }

      // Included Services - Professional card
      if (formData.services && formData.services.length > 0) {
        const rows = Math.ceil(formData.services.length / 2);
        const boxHeight = 28 + rows * 9;

        checkAddPage(boxHeight);

        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, yPosition, contentWidth, boxHeight, 6, 6, "F");
        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, yPosition, contentWidth, boxHeight, 6, 6, "S");

        // Header bar
        pdf.setFillColor(240, 253, 244);
        pdf.roundedRect(margin, yPosition, contentWidth, 16, 6, 6, "F");

        pdf.setTextColor(22, 163, 74);
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.text("INCLUDED SERVICES", margin + 10, yPosition + 11);

        pdf.setTextColor(71, 85, 105);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        formData.services.forEach((service, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const xPos = margin + 10 + col * ((contentWidth - 20) / 2);
          const yPos = yPosition + 28 + row * 9;

          pdf.setFillColor(22, 163, 74);
          pdf.circle(xPos + 2, yPos - 2, 1.5, "F");
          pdf.setTextColor(71, 85, 105);
          pdf.text(service, xPos + 6, yPos);
        });

        yPosition += boxHeight + 10;
      }

      // Visas Section - HIDDEN IN PDF AS REQUESTED
      /*
            if (selectedVisas.length > 0) {
                checkAddPage(30);
                pdf.setFillColor(249, 115, 22); // Orange
                pdf.rect(margin, yPosition, contentWidth, 14, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(15);
                pdf.setFont('helvetica', 'bold');
                pdf.text('VISAS (' + selectedVisas.length + ')', pageWidth / 2, yPosition + 10, { align: 'center' });
                yPosition += 19;

                for (const visa of selectedVisas) {
                    const hasImage = !!visa.image;
                    const contentH = hasImage ? 50 : 25;
                    checkAddPage(contentH);

                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(margin, yPosition, contentWidth, contentH - 5, 'F');
                    pdf.setDrawColor(253, 186, 116);
                    pdf.setLineWidth(0.5);
                    pdf.rect(margin, yPosition, contentWidth, contentH - 5, 'S');

                    if (hasImage) {
                         try {
                            const img = await loadImage(visa.image);
                            pdf.addImage(img, 'JPEG', margin + 5, yPosition + 5, 45, 35);
                        } catch (e) {}
                    }

                    const textX = hasImage ? margin + 55 : margin + 10;
                    pdf.setTextColor(15, 23, 42);
                    pdf.setFontSize(13);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(visa.country, textX, yPosition + 15);

                    yPosition += contentH;
                }
            }
            */

      // Activities Summary - Professional card
      if (selectedActivities.length > 0) {
        const sortedActs = [...selectedActivities].sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        const height = 28 + sortedActs.length * 9;
        checkAddPage(height);

        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, yPosition, contentWidth, height, 6, 6, "F");
        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, yPosition, contentWidth, height, 6, 6, "S");

        // Header bar
        pdf.setFillColor(245, 243, 255);
        pdf.roundedRect(margin, yPosition, contentWidth, 16, 6, 6, "F");

        pdf.setTextColor(109, 40, 217);
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.text("PLANNED ACTIVITIES", margin + 10, yPosition + 11);

        pdf.setTextColor(71, 85, 105);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        sortedActs.forEach((act, idx) => {
          const dateStr = act.date
            ? format(new Date(act.date), "MMM d")
            : "TBD";
          const timeStr = act.time_slot ? `[${act.time_slot}]` : "";
          const yPos = yPosition + 28 + idx * 9;

          pdf.setFillColor(109, 40, 217);
          pdf.circle(margin + 12, yPos - 2, 1.5, "F");
          pdf.setTextColor(71, 85, 105);
          pdf.text(`${dateStr} ${timeStr} - ${act.name}`, margin + 16, yPos);
        });
        yPosition += height + 10;
      }

      // Hotels Section - Professional
      if (selectedHotels.length > 0) {
        pdf.addPage();
        yPosition = margin;

        // Professional header
        pdf.setFillColor(30, 58, 138);
        pdf.rect(0, yPosition, pageWidth, 22, "F");
        pdf.setFillColor(217, 119, 6);
        pdf.rect(0, yPosition + 22, pageWidth, 3, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("ACCOMMODATIONS", pageWidth / 2, yPosition + 15, {
          align: "center",
        });
        yPosition += 35;

        // Sort hotels by check-in date
        const sortedHotels = [...selectedHotels].sort(
          (a, b) => new Date(a.check_in) - new Date(b.check_in),
        );

        for (const hotel of sortedHotels) {
          checkAddPage(60);
          pdf.setFillColor(255, 255, 255);
          pdf.roundedRect(margin, yPosition, contentWidth, 55, 6, 6, "F");
          pdf.setDrawColor(203, 213, 225);
          pdf.setLineWidth(1);
          pdf.roundedRect(margin, yPosition, contentWidth, 55, 6, 6, "S");

          try {
            const img = await loadImage(hotel.image);
            pdf.setDrawColor(203, 213, 225);
            pdf.setLineWidth(0.5);
            pdf.roundedRect(margin + 5, yPosition + 5, 60, 45, 4, 4, "S");
            pdf.addImage(img, "JPEG", margin + 5, yPosition + 5, 60, 45);
          } catch (e) {
            pdf.setFillColor(248, 250, 252);
            pdf.roundedRect(margin + 5, yPosition + 5, 60, 45, 4, 4, "F");
            pdf.setTextColor(148, 163, 184);
            pdf.setFontSize(8);
            pdf.text("No Image", margin + 35, yPosition + 25, {
              align: "center",
            });
          }

          const detailsX = margin + 72;
          pdf.setTextColor(30, 58, 138);
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text(hotel.name, detailsX, yPosition + 14);

          // Star Rating
          if (hotel.rating) {
            pdf.setFontSize(11);
            pdf.setTextColor(217, 119, 6);
            let stars = "";
            for (let i = 0; i < hotel.rating; i++) stars += "*";
            pdf.text(
              `${stars} ${hotel.rating} Star Hotel`,
              detailsX,
              yPosition + 22,
            );
          }

          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(71, 85, 105);
          if (hotel.check_in && hotel.check_out) {
            pdf.text(
              `Check-in: ${format(new Date(hotel.check_in), "MMM d, yyyy")}`,
              detailsX,
              yPosition + 30,
            );
            pdf.text(
              `Check-out: ${format(new Date(hotel.check_out), "MMM d, yyyy")}`,
              detailsX,
              yPosition + 36,
            );
            pdf.setFont("helvetica", "bold");
            pdf.text(
              `Duration: ${hotel.nights} Nights`,
              detailsX,
              yPosition + 42,
            );
          }
          if (hotel.extra_beds > 0) {
            pdf.setFont("helvetica", "normal");
            pdf.text(
              `Extra Beds: ${hotel.extra_beds}`,
              detailsX,
              yPosition + 48,
            );
          }

          yPosition += 60;
        }

        // Important note - professional alert box
        checkAddPage(30);
        pdf.setFillColor(255, 251, 235);
        pdf.roundedRect(margin, yPosition, contentWidth, 26, 6, 6, "F");
        pdf.setDrawColor(217, 119, 6);
        pdf.setLineWidth(1.5);
        pdf.roundedRect(margin, yPosition, contentWidth, 26, 6, 6, "S");

        // Left accent bar
        pdf.setFillColor(217, 119, 6);
        pdf.rect(margin, yPosition, 5, 26, "F");

        pdf.setTextColor(146, 64, 14);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("IMPORTANT NOTE:", margin + 12, yPosition + 10);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const noteText =
          "Supplement charges will be added during special events like New Year, Diwali, Eid, Golf Events, Expos, etc., and will be specified separately.";
        const wrappedNote = pdf.splitTextToSize(noteText, contentWidth - 17);
        pdf.text(wrappedNote, margin + 12, yPosition + 17);
        yPosition += 36;
      }

      // Activities Section - Professional
      if (selectedActivities.length > 0) {
        pdf.addPage();
        yPosition = margin;

        // Group activities by date
        const activitiesByDate = selectedActivities.reduce((acc, act) => {
          const dateKey = act.date
            ? new Date(act.date).toDateString()
            : "Undated";
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(act);
          return acc;
        }, {});

        const sortedDates = Object.keys(activitiesByDate).sort(
          (a, b) => new Date(a) - new Date(b),
        );

        // Professional header
        pdf.setFillColor(30, 58, 138);
        pdf.rect(0, yPosition, pageWidth, 22, "F");
        pdf.setFillColor(217, 119, 6);
        pdf.rect(0, yPosition + 22, pageWidth, 3, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("DETAILED ITINERARY", pageWidth / 2, yPosition + 15, {
          align: "center",
        });
        yPosition += 35;

        for (const dateKey of sortedDates) {
          const acts = activitiesByDate[dateKey];
          // Sort by time slot
          const order = {
            Arrival: 0,
            Morning: 1,
            Afternoon: 2,
            Evening: 3,
            Night: 4,
            Departure: 5,
          };
          acts.sort(
            (a, b) => (order[a.time_slot] || 99) - (order[b.time_slot] || 99),
          );

          // Day Header - professional
          checkAddPage(15);
          pdf.setFillColor(248, 250, 252);
          pdf.roundedRect(margin, yPosition, contentWidth, 14, 5, 5, "F");
          pdf.setDrawColor(203, 213, 225);
          pdf.setLineWidth(0.5);
          pdf.roundedRect(margin, yPosition, contentWidth, 14, 5, 5, "S");

          pdf.setTextColor(30, 58, 138);
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(
            dateKey === "Undated"
              ? "Flexible Dates"
              : format(new Date(dateKey), "EEEE, MMMM d, yyyy"),
            margin + 8,
            yPosition + 10,
          );
          yPosition += 19;

          for (const activity of acts) {
            checkAddPage(50);
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(margin, yPosition, contentWidth, 45, 6, 6, "F");
            pdf.setDrawColor(203, 213, 225);
            pdf.setLineWidth(1);
            pdf.roundedRect(margin, yPosition, contentWidth, 45, 6, 6, "S");

            // Text on Left
            const textX = margin + 10;
            const imgX = pageWidth - margin - 50; // Image on Right

            // Time badge
            if (activity.time_slot) {
              const isTransport =
                activity.time_slot === "Arrival" ||
                activity.time_slot === "Departure";
              pdf.setFillColor(
                isTransport ? 254 : 239,
                isTransport ? 243 : 246,
                isTransport ? 199 : 255,
              );
              pdf.roundedRect(textX, yPosition + 6, 35, 8, 4, 4, "F");
              pdf.setTextColor(
                isTransport ? 146 : 30,
                isTransport ? 64 : 58,
                isTransport ? 14 : 138,
              );
              pdf.setFontSize(9);
              pdf.setFont("helvetica", "bold");
              pdf.text(
                activity.time_slot.toUpperCase(),
                textX + 4,
                yPosition + 11,
              );
            }

            pdf.setTextColor(30, 58, 138);
            pdf.setFontSize(13);
            pdf.setFont("helvetica", "bold");
            pdf.text(activity.name, textX, yPosition + 21);

            pdf.setTextColor(71, 85, 105);
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            const descLines = pdf.splitTextToSize(
              activity.description || "",
              88,
            );
            pdf.text(descLines, textX, yPosition + 29);

            // Image with professional border
            try {
              const img = await loadImage(activity.image);
              pdf.setDrawColor(203, 213, 225);
              pdf.setLineWidth(0.5);
              pdf.roundedRect(imgX, yPosition + 5, 45, 35, 4, 4, "S");
              pdf.addImage(img, "JPEG", imgX, yPosition + 5, 45, 35);
            } catch (e) {
              pdf.setFillColor(248, 250, 252);
              pdf.roundedRect(imgX, yPosition + 5, 45, 35, 4, 4, "F");
              pdf.setTextColor(148, 163, 184);
              pdf.setFontSize(8);
              pdf.text("No Image", imgX + 10, yPosition + 20);
            }

            yPosition += 50;
          }
          yPosition += 5; // Spacer between days
        }
      }

      // Terms & Conditions - Professional
      pdf.addPage();
      yPosition = margin;

      // Professional header
      pdf.setFillColor(30, 58, 138);
      pdf.rect(0, yPosition, pageWidth, 22, "F");
      pdf.setFillColor(217, 119, 6);
      pdf.rect(0, yPosition + 22, pageWidth, 3, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("TERMS & CONDITIONS", pageWidth / 2, yPosition + 15, {
        align: "center",
      });
      yPosition += 30;

      const terms = [
        {
          title: "1. Booking & Payment:",
          content: [
            "All bookings are subject to availability and confirmation by the tour operator. Changes are authorised to GoDubaiOnline.com without prior notice.",
            "Full names as per passports are required at booking. Name changes on flights may incur penalties.",
            "Confirmation of the package is only upon advance payment credited to bank account of GoDubaiOnline.com LLC (GoDubaiOnline.com in case of INR payments). 30% Advance Payment is to be made in case of package without flight tickets and 50% Advance Payment is to be made in case of package with flight tickets.",
            "Next payment is to be processed only upon Air Ticket / Hotel Booking confirmation is shared to customer.",
            "Failure to make payment upon agreed validity may result in change/cancellation of the offered package proposal.",
          ],
        },
        {
          title: "2. Price Changes:",
          content: [
            "Prices are subject to change due to fluctuations in airfare, taxes, or other unforeseen circumstances. You will be notified of any changes before confirmation.",
          ],
        },
        {
          title: "3. Accommodation:",
          content: [
            "We strive to secure your chosen hotel, however, substitutions of similar standard may occur due to availability.",
            "Early check-in/late check-out requests are subject to hotel availability and additional charges.",
            "At the time of booking hotel/flight tickets after credit of payment to company account, if any unavailability is observed for desired hotel/flight, refund of the credited amount will be processed after adjusting bank charges, if any.",
          ],
        },
        {
          title: "4. Activities & Attractions:",
          content: [
            "While every effort is made to ensure inclusions are operational, unforeseen closures due to maintenance, weather, or local events may occur. Alternative activities will be offered whenever possible.",
          ],
        },
        {
          title: "5. Travel Documents:",
          content: [
            "You are responsible for obtaining and carrying all necessary travel documents, i.e. a valid passport, visa, etc.",
            "We are not liable for denied entry due to missing or invalid documents.",
          ],
        },
        {
          title: "6. Cancellation Policy:",
          content: [
            "We ensure to support our customers in maximum way we can. However, refunds of the confirmed bookings such as Flight, Hotel, Excursions, Transportation or any other activity will not be processed. Only balance amount can be transferred after deducting service charges of the company. However, vouchers of the bookings can be transferred to the customer.",
            "Specific details will be provided at the time of booking.",
          ],
        },
        {
          title: "7. Refund Policy:",
          content: [
            "Refunds for unused services or canceled activities due to reasons beyond our control are subject to supplier policies and may not be fully refundable.",
          ],
        },
        {
          title: "8. Force Majeure:",
          content: [
            "We are not liable for events beyond our reasonable control, including natural disasters, political unrest, strikes, or airline cancellations. In such cases, alternative arrangements may be offered, or the tour may be canceled with a partial refund according to specific circumstances.",
            "We are not liable for any loss, injury, or damage resulting from the actions or negligence of third-party providers.",
          ],
        },
        {
          title: "9. Travel Insurance:",
          content: [
            "We strongly recommend purchasing comprehensive travel insurance to cover unforeseen circumstances.",
          ],
        },
        {
          title: "10. Governing Law:",
          content: [
            "This agreement is subject to the laws of Dubai, United Arab Emirates.",
          ],
        },
        {
          title: "11. Disclaimer:",
          content: [
            "The information provided is intended for general knowledge only and does not constitute legal advice.",
            "We as a travel agent, assisting only to make the packages and bookings as per travellers inquiry and requirements, we acts as an intermediary between travelers and third-party service providers such as airlines, hotels etc. we are not responsibles to lead the tours.",
          ],
        },
      ];

      terms.forEach((section) => {
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 64, 175);
        pdf.text(section.title, margin, yPosition);
        yPosition += 5;

        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(71, 85, 105);

        section.content.forEach((line) => {
          const wrappedLines = pdf.splitTextToSize(line, contentWidth - 5);
          wrappedLines.forEach((wLine) => {
            checkAddPage(4);
            pdf.text(wLine, margin + 3, yPosition);
            yPosition += 4;
          });
        });

        yPosition += 3;
      });

      yPosition += 10;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(71, 85, 105);
      const acknowledgment = pdf.splitTextToSize(
        "By booking this tour package, you acknowledge that you have read, understood, and agreed to these terms and conditions.",
        contentWidth,
      );
      checkAddPage(15);
      pdf.text(acknowledgment, margin, yPosition);

      // Transport Section - HIDDEN IN PDF AS REQUESTED
      /*
            if (selectedTransport.length > 0) {
                checkAddPage(30);
                pdf.setFillColor(59, 130, 246);
                pdf.rect(margin, yPosition, contentWidth, 14, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(15);
                pdf.setFont('helvetica', 'bold');
                pdf.text('TRANSPORTATION (' + selectedTransport.length + ')', pageWidth / 2, yPosition + 10, { align: 'center' });
                yPosition += 19;

                // Sort transport by first date
                const sortedTransport = [...selectedTransport].sort((a, b) => {
                    const dateA = (a.dates && a.dates.length > 0) ? new Date(a.dates[0]) : (a.from ? new Date(a.from) : new Date(0));
                    const dateB = (b.dates && b.dates.length > 0) ? new Date(b.dates[0]) : (b.from ? new Date(b.from) : new Date(0));
                    return dateA - dateB;
                });

                for (const transport of sortedTransport) {
                    const hasImage = !!transport.image;
                    const dates = transport.dates || [];
                    let dateStr = "";
                    if (dates.length > 0) {
                        dateStr = dates.map(d => format(new Date(d), 'MMM d')).join(', ');
                    }
                    
                    const minHeight = hasImage ? 50 : 25;
                    const textW = contentWidth - (hasImage ? 60 : 20);
                    const dateLines = dateStr ? pdf.splitTextToSize(dateStr, textW) : [];
                    const textHeight = 20 + (dateLines.length * 5);
                    const contentH = Math.max(minHeight, textHeight);

                    checkAddPage(contentH);
                    
                    pdf.setFillColor(248, 250, 252);
                    pdf.rect(margin, yPosition, contentWidth, contentH - 4, 'F');
                    pdf.setFillColor(59, 130, 246);
                    pdf.rect(margin, yPosition, 4, contentH - 4, 'F');

                    const textX = margin + 10;
                    
                    if (hasImage) {
                         try {
                            const img = await loadImage(transport.image);
                            pdf.addImage(img, 'JPEG', pageWidth - margin - 50, yPosition + 5, 45, 35);
                        } catch (e) {}
                    }

                    pdf.setTextColor(15, 23, 42);
                    pdf.setFontSize(12);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(`${transport.name} ${transport.vehicle_type ? `- ${transport.vehicle_type}` : ''}`, textX, yPosition + 10);

                    if (dateStr) {
                        pdf.setFont('helvetica', 'normal');
                        pdf.setFontSize(9);
                        pdf.setTextColor(71, 85, 105);
                        pdf.text(dateLines, textX, yPosition + 18);
                    } else if (transport.from && transport.to) {
                        pdf.setFont('helvetica', 'normal');
                        pdf.setFontSize(9);
                        pdf.setTextColor(71, 85, 105);
                        pdf.text(`${format(new Date(transport.from), 'MMM d')} - ${format(new Date(transport.to), 'MMM d')} (${transport.days} days)`, textX, yPosition + 18);
                    }

                    checkAddPage(contentH);
                    
                    pdf.setFillColor(248, 250, 252);
                    pdf.rect(margin, yPosition, contentWidth, contentH - 4, 'F');
                    pdf.setFillColor(59, 130, 246);
                    pdf.rect(margin, yPosition, 4, contentH - 4, 'F');

                    pdf.setTextColor(15, 23, 42);
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(`${transport.name} ${transport.vehicle_type ? `- ${transport.vehicle_type}` : ''}`, margin + 10, yPosition + 9);

                    if (dateStr) {
                        pdf.setFont('helvetica', 'normal');
                        pdf.setFontSize(9);
                        pdf.setTextColor(71, 85, 105);
                        const splitDates = pdf.splitTextToSize(dateStr, contentWidth - 20);
                        pdf.text(splitDates, margin + 10, yPosition + 15);
                    } else if (transport.from && transport.to) {
                        pdf.setFont('helvetica', 'normal');
                        pdf.setFontSize(9);
                        pdf.setTextColor(71, 85, 105);
                        pdf.text(`${format(new Date(transport.from), 'MMM d')} - ${format(new Date(transport.to), 'MMM d')} (${transport.days} days)`, margin + 10, yPosition + 15);
                    }

                    yPosition += contentH;
                }
            }
            */

      // Professional Thank You Page
      pdf.addPage();

      // Elegant gradient background
      for (let i = 0; i < 80; i++) {
        const ratio = i / 80;
        pdf.setFillColor(248 - ratio * 15, 250 - ratio * 10, 252 - ratio * 8);
        pdf.rect(0, (pageHeight / 80) * i, pageWidth, pageHeight / 80 + 1, "F");
      }

      // Top accent
      pdf.setFillColor(30, 58, 138);
      pdf.rect(0, 0, pageWidth, 30, "F");
      pdf.setFillColor(217, 119, 6);
      pdf.rect(0, 30, pageWidth, 3, "F");

      // Main card
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(
        margin + 15,
        pageHeight / 2 - 70,
        contentWidth - 30,
        120,
        12,
        12,
        "F",
      );
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(2);
      pdf.roundedRect(
        margin + 15,
        pageHeight / 2 - 70,
        contentWidth - 30,
        120,
        12,
        12,
        "S",
      );

      // Top accent bar
      pdf.setFillColor(217, 119, 6);
      pdf.roundedRect(
        margin + 15,
        pageHeight / 2 - 70,
        contentWidth - 30,
        8,
        12,
        12,
        "F",
      );

      pdf.setFontSize(36);
      pdf.setTextColor(30, 58, 138);
      pdf.setFont("helvetica", "bold");
      pdf.text("THANK YOU", pageWidth / 2, pageHeight / 2 - 20, {
        align: "center",
      });

      pdf.setFontSize(15);
      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "We appreciate your business and hope",
        pageWidth / 2,
        pageHeight / 2 + 5,
        { align: "center" },
      );
      pdf.text(
        "you have a wonderful journey.",
        pageWidth / 2,
        pageHeight / 2 + 18,
        { align: "center" },
      );

      // Decorative line
      pdf.setDrawColor(217, 119, 6);
      pdf.setLineWidth(1.5);
      pdf.line(
        pageWidth / 2 - 50,
        pageHeight / 2 + 30,
        pageWidth / 2 + 50,
        pageHeight / 2 + 30,
      );

      pdf.setFontSize(13);
      pdf.setTextColor(30, 58, 138);
      pdf.setFont("helvetica", "bold");
      pdf.text("Safe Travels!", pageWidth / 2, pageHeight / 2 + 43, {
        align: "center",
      });

      // Company footer
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont("helvetica", "normal");
      pdf.text(companyName, pageWidth / 2, pageHeight - 25, {
        align: "center",
      });
      pdf.setFontSize(8);
      pdf.text("Professional Travel Services", pageWidth / 2, pageHeight - 18, {
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

  const steps = [
    { num: 1, title: "Traveler Info", icon: User },
    { num: 2, title: "Visas", icon: FileText },
    { num: 3, title: "Hotels", icon: Hotel },
    { num: 4, title: "Activities", icon: MapPin },
    { num: 5, title: "SIC Transport", icon: Bus },
    { num: 6, title: "Transport", icon: Car },
    { num: 7, title: "Review", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Create Travel Package</h1>
            <p className="text-blue-100">Build your perfect journey</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-4 py-2 rounded text-white font-medium">
              {rateType === "B2B" ? "🏢 B2B Rates" : "👤 B2C Rates"}
            </div>
            <Button
              onClick={() =>
                setCurrency((prev) =>
                  prev === "AED" ? "INR" : prev === "INR" ? "USD" : "AED",
                )
              }
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              {currency === "AED"
                ? "Switch to INR (₹)"
                : currency === "INR"
                  ? "Switch to USD ($)"
                  : "Switch to AED"}
            </Button>
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="secondary" className="gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              onClick={() => {
                localStorage.clear();
                window.location.href = createPageUrl("BranchSelection");
              }}
              variant="secondary"
              className="gap-2"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm py-4 px-6 sticky top-0 z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex justify-between min-w-[600px]">
          {steps.map((step) => (
            <button
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                currentStep === step.num
                  ? "bg-blue-600 text-white"
                  : currentStep > step.num
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              <step.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-4 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-slate-800">
                      <User className="w-5 h-5 text-blue-600" />
                      Traveler Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Branch:</span>{" "}
                        {formData.branch} •{" "}
                        <span className="font-medium">User:</span> {userName}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">
                          Full Name
                        </Label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter name"
                          className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">
                          Phone Number
                        </Label>
                        <div className="flex gap-2">
                          <Select
                            value={formData.countryCode}
                            onValueChange={(v) =>
                              setFormData({ ...formData, countryCode: v })
                            }
                          >
                            <SelectTrigger className="w-32 h-11 border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+971">🇦🇪 +971</SelectItem>
                              <SelectItem value="+91">🇮🇳 +91</SelectItem>
                              <SelectItem value="+1">🇺🇸 +1</SelectItem>
                              <SelectItem value="+44">🇬🇧 +44</SelectItem>
                              <SelectItem value="+61">🇦🇺 +61</SelectItem>
                              <SelectItem value="+966">🇸🇦 +966</SelectItem>
                              <SelectItem value="+974">🇶🇦 +974</SelectItem>
                              <SelectItem value="+965">🇰🇼 +965</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Enter phone"
                            className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">
                        Destination
                      </Label>
                      <Select
                        value={formData.destination}
                        onValueChange={(v) =>
                          setFormData({ ...formData, destination: v })
                        }
                      >
                        <SelectTrigger className="h-11 border-slate-200">
                          <SelectValue placeholder="Select destination" />
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2 relative overflow-visible">
                        <Label className="text-slate-700 font-medium">
                          Arrival
                        </Label>
                        <Popover modal={false}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start h-11 border-slate-200 font-normal"
                            >
                              <CalendarIcon className="w-4 h-4 mr-2 text-slate-500" />
                              {formData.arrival_date
                                ? format(
                                    new Date(formData.arrival_date),
                                    "MMM d",
                                  )
                                : "Select"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="bottom"
                            align="start"
                            sideOffset={8}
                            className="w-auto p-0 z-[99999]"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                formData.arrival_date
                                  ? new Date(formData.arrival_date)
                                  : undefined
                              }
                              onSelect={(d) => {
                                const arrivalISO = d ? d.toISOString() : "";

                                setFormData((prev) => {
                                  let departureISO = prev.departure_date;

                                  if (arrivalISO) {
                                    const arrivalDate = new Date(arrivalISO);

                                    // if departure empty OR departure < arrival => set departure = arrival + 1 day
                                    if (
                                      !departureISO ||
                                      new Date(departureISO) < arrivalDate
                                    ) {
                                      departureISO = addDays(
                                        arrivalDate,
                                        1,
                                      ).toISOString();
                                    }
                                  } else {
                                    departureISO = "";
                                  }

                                  return {
                                    ...prev,
                                    arrival_date: arrivalISO,
                                    departure_date: departureISO,
                                  };
                                });
                              }}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2 relative overflow-visible">
                        <Label className="text-slate-700 font-medium">
                          Departure
                        </Label>
                        <Popover modal={false}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start h-11 border-slate-200 font-normal"
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.departure_date
                                ? format(
                                    new Date(formData.departure_date),
                                    "MMM d",
                                  )
                                : "Select"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="bottom"
                            align="start"
                            sideOffset={8}
                            className="w-auto p-0 z-[99999]"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                formData.departure_date
                                  ? new Date(formData.departure_date)
                                  : undefined
                              }
                              onSelect={(d) =>
                                setFormData({
                                  ...formData,
                                  departure_date: d ? d.toISOString() : "",
                                })
                              }
                              disabled={(date) => {
                                const today = new Date(
                                  new Date().setHours(0, 0, 0, 0),
                                );
                                if (date < today) return true;

                                if (formData.arrival_date) {
                                  return date < new Date(formData.arrival_date);
                                }
                                return false;
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">
                          Adults
                        </Label>
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
                          className="h-11 border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">
                          Children
                        </Label>
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
                          className="h-11 border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-700 font-medium">
                        Services
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {services.map((s) => (
                          <div
                            key={s}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                              formData.services.includes(s)
                                ? "bg-white border-blue-500 shadow-sm"
                                : "bg-white border-slate-200"
                            }`}
                            onClick={() => toggleService(s)}
                          >
                            <Checkbox
                              checked={formData.services.includes(s)}
                              onCheckedChange={() => toggleService(s)}
                              className="data-[state=checked]:bg-blue-600 border-slate-300"
                            />
                            <span className="text-sm text-slate-700">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Visas */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" /> Select
                      Visas
                    </CardTitle>
                    <Input
                      placeholder="Search visas..."
                      value={visaSearch}
                      onChange={(e) => setVisaSearch(e.target.value)}
                      className="w-48 md:w-64"
                    />
                  </CardHeader>
                  <CardContent>
                    {selectedVisas.length > 0 && (
                      <div className="mb-6 space-y-3">
                        {selectedVisas.map((v, idx) => (
                          <div
                            key={v.entry_id}
                            className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{v.country}</p>
                            </div>
                            <span className="font-bold text-orange-600">
                              {formatPrice(
                                formData.adults * v.adult_price +
                                  formData.children * v.child_price,
                              )}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setSelectedVisas((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                )
                              }
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {visas
                        .filter((v) =>
                          v.country
                            .toLowerCase()
                            .includes(visaSearch.toLowerCase()),
                        )
                        .sort((a, b) => a.country.localeCompare(b.country))
                        .map((visa) => (
                          <div
                            key={visa.id}
                            className="border rounded-xl p-4 hover:shadow-md cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-all"
                            onClick={() => handleAddVisa(visa)}
                          >
                            <h4 className="font-bold">{visa.country}</h4>
                            <div className="flex gap-4 text-sm text-slate-600 mt-2">
                              <span>
                                Adult:{" "}
                                {formatPrice(
                                  rateType === "B2B"
                                    ? visa.b2b_adult_price || visa.adult_price
                                    : visa.adult_price,
                                )}
                              </span>
                              <span>
                                Child:{" "}
                                {formatPrice(
                                  rateType === "B2B"
                                    ? visa.b2b_child_price || visa.child_price
                                    : visa.child_price,
                                )}
                              </span>
                            </div>
                            {rateType === "B2B" && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1 inline-block">
                                B2B Rate
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Hotels */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Hotel className="w-5 h-5 text-blue-600" /> Select Hotels
                    </CardTitle>
                    <Input
                      placeholder="Search hotels..."
                      value={hotelSearch}
                      onChange={(e) => setHotelSearch(e.target.value)}
                      className="w-48 md:w-64"
                    />
                  </CardHeader>
                  <CardContent>
                    {selectedHotels.length > 0 && (
                      <div className="mb-6 space-y-3">
                        {selectedHotels.map((h, idx) => (
                          <div
                            key={h.entry_id}
                            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl"
                          >
                            <img
                              src={h.image}
                              className="w-16 h-12 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{h.name}</p>
                              <p className="text-sm text-slate-500">
                                {h.check_in &&
                                  format(new Date(h.check_in), "MMM d")}{" "}
                                -{" "}
                                {h.check_out &&
                                  format(new Date(h.check_out), "MMM d")}{" "}
                                • {h.nights} nights • {h.rooms} Room(s)
                              </p>
                            </div>
                            <span className="font-bold text-blue-600">
                              {formatPrice(h.total_price)}
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
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {hotels
                        .filter(
                          (h) =>
                            h.name
                              .toLowerCase()
                              .includes(hotelSearch.toLowerCase()) ||
                            h.location
                              ?.toLowerCase()
                              .includes(hotelSearch.toLowerCase()),
                        )
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((hotel) => (
                          <div
                            key={hotel.id}
                            className="border rounded-xl overflow-hidden hover:shadow-lg cursor-pointer"
                            onClick={() => handleAddHotel(hotel)}
                          >
                            <div className="relative h-32">
                              <img
                                src={hotel.image}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold">{hotel.name}</h4>
                              <p className="text-sm text-slate-500">
                                {hotel.location}
                              </p>
                              <p className="text-xs font-bold text-green-600 mt-1">
                                {formatPrice(
                                  rateType === "B2B"
                                    ? hotel.b2b_price_per_night ||
                                        hotel.price_per_night
                                    : hotel.price_per_night,
                                )}
                                /night
                              </p>
                              {rateType === "B2B" && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  B2B Rate
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Activities */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" /> Select
                      Activities
                    </CardTitle>
                    <Input
                      placeholder="Search activities..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="w-48 md:w-64"
                    />
                  </CardHeader>
                  <CardContent>
                    {selectedActivities.length > 0 && (
                      <div className="mb-6 space-y-3">
                        {selectedActivities.map((a, idx) => (
                          <div
                            key={a.entry_id}
                            className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl"
                          >
                            <img
                              src={a.image}
                              className="w-16 h-12 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{a.name}</p>
                              <p className="text-sm text-slate-500">
                                {a.date && format(new Date(a.date), "MMM d")} •{" "}
                                {a.custom_adults || formData.adults} Adults,{" "}
                                {a.custom_children || formData.children}{" "}
                                Children
                              </p>
                            </div>
                            <span className="font-bold text-purple-600">
                              {formatPrice(
                                (a.custom_adults || formData.adults) *
                                  a.adult_price +
                                  (a.custom_children || formData.children) *
                                    a.child_price,
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
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {activities
                        .filter(
                          (a) =>
                            a.name
                              .toLowerCase()
                              .includes(activitySearch.toLowerCase()) ||
                            a.description
                              ?.toLowerCase()
                              .includes(activitySearch.toLowerCase()),
                        )
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((activity) => (
                          <div
                            key={activity.id}
                            className="border rounded-xl overflow-hidden hover:shadow-lg cursor-pointer"
                            onClick={() => handleAddActivity(activity)}
                          >
                            <div className="relative h-32">
                              <img
                                src={activity.image}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold">{activity.name}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                {activity.description}
                              </p>
                              <div className="flex gap-2 mt-2 text-xs font-medium">
                                <span className="text-blue-600">
                                  Adult:{" "}
                                  {formatPrice(
                                    rateType === "B2B"
                                      ? activity.b2b_adult_price ||
                                          activity.adult_price
                                      : activity.adult_price,
                                  )}
                                </span>
                                <span className="text-purple-600">
                                  Child:{" "}
                                  {formatPrice(
                                    rateType === "B2B"
                                      ? activity.b2b_child_price ||
                                          activity.child_price
                                      : activity.child_price,
                                  )}
                                </span>
                              </div>
                              {rateType === "B2B" && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1 inline-block">
                                  B2B Rate
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 5: SIC Transport */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bus className="w-5 h-5 text-teal-600" /> Select SIC
                      Transport
                    </CardTitle>
                    <Input
                      placeholder="Search places..."
                      value={sicSearch}
                      onChange={(e) => setSicSearch(e.target.value)}
                      className="w-48 md:w-64"
                    />
                  </CardHeader>
                  <CardContent>
                    {selectedSICTransports.length > 0 && (
                      <div className="mb-6 space-y-3">
                        {selectedSICTransports.map((s, idx) => {
                          const adultPrice =
                            rateType === "B2B"
                              ? s.b2b_adult_price || s.adult_price
                              : s.adult_price;
                          const childPrice =
                            rateType === "B2B"
                              ? s.b2b_child_price || s.child_price
                              : s.child_price;
                          const total =
                            formData.adults * adultPrice +
                            formData.children * childPrice;
                          return (
                            <div
                              key={s.entry_id}
                              className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl"
                            >
                              {s.image && (
                                <img
                                  src={s.image}
                                  className="w-16 h-12 rounded object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{s.place_name}</p>
                                <p className="text-sm text-slate-500">
                                  {formData.adults} Adults ×{" "}
                                  {formatPrice(adultPrice)} +{" "}
                                  {formData.children} Children ×{" "}
                                  {formatPrice(childPrice)}
                                </p>
                              </div>
                              <span className="font-bold text-teal-600">
                                {formatPrice(total)}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  setSelectedSICTransports((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  )
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {sicTransports
                        .filter(
                          (s) =>
                            s.place_name
                              .toLowerCase()
                              .includes(sicSearch.toLowerCase()) ||
                            s.description
                              ?.toLowerCase()
                              .includes(sicSearch.toLowerCase()),
                        )
                        .sort((a, b) =>
                          a.place_name.localeCompare(b.place_name),
                        )
                        .map((sic) => (
                          <div
                            key={sic.id}
                            className="border rounded-xl overflow-hidden hover:shadow-lg cursor-pointer"
                            onClick={() => handleAddSICTransport(sic)}
                          >
                            {sic.image && (
                              <div className="relative h-32">
                                <img
                                  src={sic.image}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <h4 className="font-bold">{sic.place_name}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                {sic.description}
                              </p>
                              <div className="flex gap-2 mt-2 text-xs font-medium">
                                <span className="text-blue-600">
                                  Adult:{" "}
                                  {formatPrice(
                                    rateType === "B2B"
                                      ? sic.b2b_adult_price || sic.adult_price
                                      : sic.adult_price,
                                  )}
                                </span>
                                <span className="text-teal-600">
                                  Child:{" "}
                                  {formatPrice(
                                    rateType === "B2B"
                                      ? sic.b2b_child_price || sic.child_price
                                      : sic.child_price,
                                  )}
                                </span>
                              </div>
                              {rateType === "B2B" && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1 inline-block">
                                  B2B Rate
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 6: Transport */}
            {currentStep === 6 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-green-600" /> Select
                      Transportation
                    </CardTitle>
                    <Input
                      placeholder="Search transport..."
                      value={transportSearch}
                      onChange={(e) => setTransportSearch(e.target.value)}
                      className="w-48 md:w-64"
                    />
                  </CardHeader>
                  <CardContent>
                    {selectedTransport.length > 0 && (
                      <div className="mb-6 space-y-3">
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
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {transports
                        .filter((t) =>
                          t.name
                            .toLowerCase()
                            .includes(transportSearch.toLowerCase()),
                        )
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((t) => (
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
                              <div className="ml-auto text-xs font-bold text-green-600">
                                Click to select
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 7: Review */}
            {currentStep === 7 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" /> Review
                      & Confirm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {formData.name}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {formData.phone}
                      </p>
                      <p>
                        <span className="font-medium">Destination:</span>{" "}
                        {formData.destination}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {formData.arrival_date &&
                          format(new Date(formData.arrival_date), "MMM d")}{" "}
                        -{" "}
                        {formData.departure_date &&
                          format(new Date(formData.departure_date), "MMM d")}
                      </p>
                    </div>

                    {selectedVisas.length > 0 && (
                      <div className="border rounded-xl p-4">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" /> Visas
                        </h4>
                        {selectedVisas.map((v) => (
                          <p
                            key={v.entry_id}
                            className="text-sm flex justify-between"
                          >
                            <span>{v.country}</span>{" "}
                            <span>
                              {formatPrice(
                                formData.adults * v.adult_price +
                                  formData.children * v.child_price,
                              )}
                            </span>
                          </p>
                        ))}
                      </div>
                    )}

                    {selectedSICTransports.length > 0 && (
                      <div className="border rounded-xl p-4">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Bus className="w-4 h-4 text-teal-600" /> SIC
                          Transport
                        </h4>
                        {selectedSICTransports.map((s) => {
                          const adultPrice =
                            rateType === "B2B"
                              ? s.b2b_adult_price || s.adult_price
                              : s.adult_price;
                          const childPrice =
                            rateType === "B2B"
                              ? s.b2b_child_price || s.child_price
                              : s.child_price;
                          const total =
                            formData.adults * adultPrice +
                            formData.children * childPrice;
                          return (
                            <p
                              key={s.entry_id}
                              className="text-sm flex justify-between"
                            >
                              <span>
                                {s.place_name} ({formData.adults}A,{" "}
                                {formData.children}C)
                              </span>{" "}
                              <span>{formatPrice(total)}</span>
                            </p>
                          );
                        })}
                      </div>
                    )}

                    {selectedHotels.length > 0 && (
                      <div className="border rounded-xl p-4">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Hotel className="w-4 h-4 text-blue-600" /> Hotels
                        </h4>
                        {selectedHotels.map((h) => (
                          <p
                            key={h.entry_id}
                            className="text-sm flex justify-between"
                          >
                            <span>
                              {h.name} ({h.nights} nights, {h.rooms} rooms)
                            </span>{" "}
                            <span>{formatPrice(h.total_price)}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    {selectedActivities.length > 0 && (
                      <div className="border rounded-xl p-4">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-600" />{" "}
                          Activities
                        </h4>
                        {selectedActivities.map((a) => (
                          <p
                            key={a.entry_id}
                            className="text-sm flex justify-between"
                          >
                            <span>
                              {a.name} ({a.custom_adults || formData.adults}A,{" "}
                              {a.custom_children || formData.children}C)
                            </span>{" "}
                            <span>
                              {formatPrice(
                                (a.custom_adults || formData.adults) *
                                  a.adult_price +
                                  (a.custom_children || formData.children) *
                                    a.child_price,
                              )}
                            </span>
                          </p>
                        ))}
                      </div>
                    )}

                    {selectedTransport.length > 0 && (
                      <div className="border rounded-xl p-4">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Car className="w-4 h-4 text-green-600" /> Transport
                        </h4>
                        {selectedTransport.map((t) => (
                          <p
                            key={t.entry_id}
                            className="text-sm flex justify-between"
                          >
                            <span>
                              {t.name} ({t.days} days)
                            </span>{" "}
                            <span>{formatPrice(t.total_price)}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="border rounded-xl p-4 bg-slate-50">
                      <h4 className="font-bold mb-3 text-slate-900">
                        Additional Charges
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <Checkbox
                            id="fixed-charges"
                            checked={includeFixedCharges}
                            onCheckedChange={setIncludeFixedCharges}
                            className="data-[state=checked]:bg-blue-600 border-slate-300"
                          />
                          <div className="flex-1 flex justify-between items-center">
                            <Label
                              htmlFor="fixed-charges"
                              className="text-sm font-medium cursor-pointer"
                            >
                              24*7 Travel Assistant & DMC Charge
                            </Label>
                            <span className="font-bold text-sm">AED 50</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Commission (AED)
                          </Label>
                          <Input
                            type="number"
                            value={commission}
                            onChange={(e) =>
                              setCommission(parseFloat(e.target.value) || 0)
                            }
                            placeholder="Enter commission in AED"
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Additional Amount (AED)
                          </Label>
                          <Input
                            type="number"
                            value={additionalAmount}
                            onChange={(e) =>
                              setAdditionalAmount(
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            placeholder="Enter additional amount in AED"
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < 7 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pdf-info"
                      checked={includeTravelerInfo}
                      onCheckedChange={setIncludeTravelerInfo}
                    />
                    <Label htmlFor="pdf-info" className="text-sm">
                      Include Info in PDF
                    </Label>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}{" "}
                      {editId ? "Save Changes" : "Save Package"}
                    </Button>
                    <Button
                      onClick={generatePDF}
                      disabled={isGeneratingPDF}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isGeneratingPDF ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}{" "}
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle>Package Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-slate-300">
                    <span>Visas ({selectedVisas.length})</span>
                    <span className="font-bold text-white">
                      {formatPrice(calculateVisaTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>SIC Transport ({selectedSICTransports.length})</span>
                    <span className="font-bold text-white">
                      {formatPrice(calculateSICTransportTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Hotels ({selectedHotels.length})</span>
                    <span className="font-bold text-white">
                      {formatPrice(calculateHotelTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Activities ({selectedActivities.length})</span>
                    <span className="font-bold text-white">
                      {formatPrice(calculateActivitiesTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Transport ({selectedTransport.length})</span>
                    <span className="font-bold text-white">
                      {formatPrice(calculateTransportTotal())}
                    </span>
                  </div>
                  <div className="border-t border-slate-600 pt-3 space-y-2">
                    {includeFixedCharges && (
                      <div className="flex justify-between text-slate-300 text-sm">
                        <span>24*7 Travel Assistant & DMC</span>
                        <span className="font-bold text-white">AED 50</span>
                      </div>
                    )}
                    {commission > 0 && (
                      <div className="flex justify-between text-slate-300 text-sm">
                        <span>Commission</span>
                        <span className="font-bold text-white">
                          AED {commission}
                        </span>
                      </div>
                    )}
                    {additionalAmount > 0 && (
                      <div className="flex justify-between text-slate-300 text-sm">
                        <span>Additional Amount</span>
                        <span className="font-bold text-white">
                          AED {additionalAmount}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-600 pt-4 flex justify-between">
                    <span className="text-lg font-bold">TOTAL</span>
                    <span className="text-2xl font-bold text-green-400">
                      {formatPrice(calculateGrandTotal())}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">{currentHotel.name}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Check-in</Label>
                    <Popover
                      modal={false}
                      open={hotelCheckInOpen}
                      onOpenChange={setHotelCheckInOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {hotelDates.check_in
                            ? format(new Date(hotelDates.check_in), "MMM d")
                            : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="start"
                        sideOffset={8}
                        className="w-auto p-0 z-[99999]"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            hotelDates.check_in
                              ? new Date(hotelDates.check_in)
                              : undefined
                          }
                          onSelect={(d) => {
                            setHotelDates({
                              ...hotelDates,
                              check_in: d ? d.toISOString() : "",
                            });
                            setHotelCheckInOpen(false);
                          }}
                          disabled={(date) =>
                            !formData.arrival_date ||
                            !formData.departure_date ||
                            date < new Date(formData.arrival_date) ||
                            date > new Date(formData.departure_date)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <Popover
                      modal={false}
                      open={hotelCheckOutOpen}
                      onOpenChange={setHotelCheckOutOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {hotelDates.check_out
                            ? format(new Date(hotelDates.check_out), "MMM d")
                            : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="start"
                        sideOffset={8}
                        className="w-auto p-0 z-[99999]"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            hotelDates.check_out
                              ? new Date(hotelDates.check_out)
                              : undefined
                          }
                          onSelect={(d) => {
                            setHotelDates({
                              ...hotelDates,
                              check_out: d ? d.toISOString() : "",
                            });
                            setHotelCheckOutOpen(false);
                          }}
                          disabled={(date) => {
                            if (
                              !formData.arrival_date ||
                              !formData.departure_date
                            )
                              return true;

                            const arrival = new Date(formData.arrival_date);
                            const departure = new Date(formData.departure_date);

                            // must be >= check-in + 1 day
                            const checkIn = hotelDates.check_in
                              ? new Date(hotelDates.check_in)
                              : arrival;
                            const minCheckout = addDays(checkIn, 1);

                            return date < minCheckout || date > departure;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Number of Rooms</Label>
                    <Input
                      type="number"
                      min="0"
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label>
                      Extra Beds/Room (
                      {formatPrice(currentHotel.extra_bed_price || 0)})
                    </Label>
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
                <Button onClick={confirmAddHotel} className="w-full">
                  Confirm
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
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">
                Add {currentActivity.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Popover
                    modal={false}
                    open={activityDateOpen}
                    onOpenChange={setActivityDateOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-300"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {activityDate
                          ? format(new Date(activityDate), "EEEE, MMM d, yyyy")
                          : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      align="start"
                      sideOffset={8}
                      className="w-auto p-0 z-[99999]"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          activityDate ? new Date(activityDate) : undefined
                        }
                        onSelect={(d) => {
                          setActivityDate(d ? d.toISOString() : "");
                          setActivityDateOpen(false);
                        }}
                        disabled={(date) => {
                          if (
                            !formData.arrival_date ||
                            !formData.departure_date
                          )
                            return true;
                          return (
                            date < new Date(formData.arrival_date) ||
                            date > new Date(formData.departure_date)
                          );
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Time Slot / Session</Label>
                  <Select
                    value={activityTimeSlot}
                    onValueChange={setActivityTimeSlot}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
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
                      min="0"
                      value={activityAdults}
                      onChange={(e) =>
                        setActivityAdults(parseInt(e.target.value) || 0)
                      }
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label>Children</Label>
                    <Input
                      type="number"
                      min="0"
                      value={activityChildren}
                      onChange={(e) =>
                        setActivityChildren(parseInt(e.target.value) || 0)
                      }
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Adults ({activityAdults})</span>
                    <span>
                      {formatPrice(
                        activityAdults * currentActivity.adult_price,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Children ({activityChildren})</span>
                    <span>
                      {formatPrice(
                        activityChildren * currentActivity.child_price,
                      )}
                    </span>
                  </div>
                  <div className="border-t border-purple-200 pt-2 flex justify-between font-bold text-purple-800">
                    <span>Total Cost</span>
                    <span>
                      {formatPrice(
                        activityAdults * currentActivity.adult_price +
                          activityChildren * currentActivity.child_price,
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowActivityModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmAddActivity}
                    disabled={!activityDate}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Add to Itinerary
                  </Button>
                </div>
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
                {currentTransport.name} Selection
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Vehicle Type</Label>
                  <Select
                    value={transportType}
                    onValueChange={setTransportType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7 Seater">
                        7 Seater (
                        {formatPrice(
                          rateType === "B2B"
                            ? currentTransport.b2b_price_7_seater ||
                                currentTransport.price_7_seater ||
                                0
                            : currentTransport.price_7_seater || 0,
                        )}
                        )
                      </SelectItem>
                      <SelectItem value="14 Seater">
                        14 Seater (
                        {formatPrice(
                          rateType === "B2B"
                            ? currentTransport.b2b_price_14_seater ||
                                currentTransport.price_14_seater ||
                                0
                            : currentTransport.price_14_seater || 0,
                        )}
                        )
                      </SelectItem>
                      <SelectItem value="22 Seater">
                        22 Seater (
                        {formatPrice(
                          rateType === "B2B"
                            ? currentTransport.b2b_price_22_seater ||
                                currentTransport.price_22_seater ||
                                0
                            : currentTransport.price_22_seater || 0,
                        )}
                        )
                      </SelectItem>
                      <SelectItem value="35 Seater">
                        35 Seater (
                        {formatPrice(
                          rateType === "B2B"
                            ? currentTransport.b2b_price_35_seater ||
                                currentTransport.price_35_seater ||
                                0
                            : currentTransport.price_35_seater || 0,
                        )}
                        )
                      </SelectItem>
                      <SelectItem value="50 Seater">
                        50 Seater (
                        {formatPrice(
                          rateType === "B2B"
                            ? currentTransport.b2b_price_50_seater ||
                                currentTransport.price_50_seater ||
                                0
                            : currentTransport.price_50_seater || 0,
                        )}
                        )
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select Dates</Label>
                  <div className="flex gap-2 mb-2">
                    <Popover
                      modal={false}
                      open={transportDateOpen}
                      onOpenChange={setTransportDateOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <CalendarIcon className="w-4 h-4 mr-2" /> Add Date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="start"
                        sideOffset={8}
                        className="w-auto p-0 z-[99999]"
                      >
                        <Calendar
                          mode="single"
                          onSelect={(d) => {
                            addTransportDate(d ? d.toISOString() : "");
                            setTransportDateOpen(false);
                          }}
                          disabled={(date) =>
                            !formData.arrival_date ||
                            !formData.departure_date ||
                            date < new Date(formData.arrival_date) ||
                            date > new Date(formData.departure_date)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
                    {transportDates.length === 0 && (
                      <span className="text-sm text-slate-500">
                        No dates selected
                      </span>
                    )}
                    {transportDates.map((date, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-sm"
                      >
                        {format(new Date(date), "MMM d")}
                        <button
                          onClick={() => removeTransportDate(date)}
                          className="text-slate-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-center font-bold text-green-800">
                    Total:{" "}
                    {formatPrice(
                      (currentTransport[
                        `price_${transportType.split(" ")[0]}_seater`
                      ] || 0) * transportDates.length,
                    )}
                  </p>
                </div>

                <Button
                  onClick={confirmAddTransport}
                  disabled={transportDates.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
