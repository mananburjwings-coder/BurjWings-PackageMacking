import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function PDFGenerator({ 
    formData, 
    selectedHotels, 
    selectedActivities, 
    selectedTransport,
    hotelTotal,
    activitiesTotal,
    transportTotal,
    grandTotal
}) {
    const [isGenerating, setIsGenerating] = useState(false);

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
        setIsGenerating(true);
        
        try {
            const jsPDF = (await import('jspdf')).jsPDF;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);
            let yPosition = 0;

            const checkAddPage = (requiredSpace) => {
                if (yPosition + requiredSpace > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                    return true;
                }
                return false;
            };

            // ==================== COVER PAGE ====================
            const gradientSteps = 50;
            for (let i = 0; i < gradientSteps; i++) {
                const ratio = i / gradientSteps;
                const r = Math.round(15 + (30 - 15) * ratio);
                const g = Math.round(23 + (64 - 23) * ratio);
                const b = Math.round(42 + (175 - 42) * ratio);
                pdf.setFillColor(r, g, b);
                pdf.rect(0, (pageHeight / gradientSteps) * i, pageWidth, pageHeight / gradientSteps + 1, 'F');
            }

            // Main title
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(48);
            pdf.setFont('helvetica', 'bold');
            pdf.text('YOUR JOURNEY', pageWidth / 2, 70, { align: 'center' });
            
            pdf.setFontSize(42);
            pdf.text('BEGINS HERE', pageWidth / 2, 90, { align: 'center' });

            // Subtitle
            pdf.setFillColor(6, 182, 212);
            pdf.rect(pageWidth / 2 - 50, 105, 100, 20, 'F');
            pdf.setFontSize(16);
            pdf.text('PREMIUM TRAVEL PACKAGE', pageWidth / 2, 117, { align: 'center' });

            // Traveler name
            if (formData.name) {
                pdf.setFillColor(255, 255, 255);
                pdf.rect(margin + 20, 140, contentWidth - 40, 35, 'F');
                
                pdf.setDrawColor(6, 182, 212);
                pdf.setLineWidth(1);
                pdf.rect(margin + 20, 140, contentWidth - 40, 35, 'S');
                
                pdf.setTextColor(30, 64, 175);
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                pdf.text('PREPARED FOR', pageWidth / 2, 152, { align: 'center' });
                
                pdf.setFontSize(22);
                pdf.setFont('helvetica', 'bold');
                pdf.text(formData.name.toUpperCase(), pageWidth / 2, 165, { align: 'center' });
            }

            // Destination
            if (formData.destination) {
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(28);
                pdf.setFont('helvetica', 'bold');
                pdf.text('DESTINATION', pageWidth / 2, 200, { align: 'center' });
                
                pdf.setFontSize(32);
                pdf.setTextColor(6, 182, 212);
                pdf.text(formData.destination.toUpperCase(), pageWidth / 2, 220, { align: 'center' });
            }

            // GRAND TOTAL - Prominent display on cover
            pdf.setFillColor(22, 163, 74);
            pdf.rect(margin + 10, 240, contentWidth - 20, 30, 'F');
            
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            pdf.text('PACKAGE TOTAL', pageWidth / 2, 252, { align: 'center' });
            
            pdf.setFontSize(28);
            pdf.setFont('helvetica', 'bold');
            pdf.text('$' + grandTotal.toLocaleString(), pageWidth / 2, 265, { align: 'center' });

            // Footer
            pdf.setTextColor(203, 213, 225);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.text('Generated on ' + format(new Date(), 'MMMM d, yyyy'), pageWidth / 2, pageHeight - 10, { align: 'center' });

            // ==================== PAGE 2: TRIP OVERVIEW ====================
            pdf.addPage();
            yPosition = margin;

            pdf.setFillColor(30, 64, 175);
            pdf.rect(0, yPosition, pageWidth, 15, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text('TRIP OVERVIEW', pageWidth / 2, yPosition + 10, { align: 'center' });
            yPosition += 25;

            // Traveler Information
            pdf.setFillColor(248, 250, 252);
            pdf.rect(margin, yPosition, contentWidth, 55, 'F');
            pdf.setFillColor(6, 182, 212);
            pdf.rect(margin, yPosition, 4, 55, 'F');
            
            pdf.setTextColor(30, 64, 175);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('TRAVELER DETAILS', margin + 10, yPosition + 10);
            
            pdf.setFontSize(10);
            pdf.setTextColor(71, 85, 105);
            
            const infoStartY = yPosition + 20;
            const col1X = margin + 10;
            const col2X = margin + 95;
            
            pdf.setFont('helvetica', 'bold');
            pdf.text('Full Name:', col1X, infoStartY);
            pdf.setFont('helvetica', 'normal');
            pdf.text(formData.name || 'Not specified', col1X + 25, infoStartY);
            
            pdf.setFont('helvetica', 'bold');
            pdf.text('Phone:', col1X, infoStartY + 9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(formData.phone || 'Not specified', col1X + 25, infoStartY + 9);
            
            pdf.setFont('helvetica', 'bold');
            pdf.text('Destination:', col1X, infoStartY + 18);
            pdf.setFont('helvetica', 'normal');
            pdf.text(formData.destination || 'Not specified', col1X + 25, infoStartY + 18);
            
            pdf.setFont('helvetica', 'bold');
            pdf.text('Adults:', col2X, infoStartY);
            pdf.setFont('helvetica', 'normal');
            pdf.text((formData.adults || 0).toString(), col2X + 20, infoStartY);
            
            pdf.setFont('helvetica', 'bold');
            pdf.text('Children:', col2X, infoStartY + 9);
            pdf.setFont('helvetica', 'normal');
            pdf.text((formData.children || 0).toString(), col2X + 20, infoStartY + 9);
            
            if (formData.arrival_date && formData.departure_date) {
                const nights = Math.ceil(
                    (new Date(formData.departure_date) - new Date(formData.arrival_date)) / (1000 * 60 * 60 * 24)
                );
                pdf.setFont('helvetica', 'bold');
                pdf.text('Duration:', col2X, infoStartY + 18);
                pdf.setFont('helvetica', 'normal');
                pdf.text(nights + ' Nights', col2X + 20, infoStartY + 18);
            }
            
            yPosition += 65;

            // ==================== SERVICES ====================
            if (formData.services && formData.services.length > 0) {
                checkAddPage(50);
                
                pdf.setFillColor(6, 182, 212);
                pdf.rect(margin, yPosition, contentWidth, 12, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.text('INCLUDED SERVICES', margin + 5, yPosition + 8);
                yPosition += 17;
                
                const servicesPerRow = 3;
                const cardWidth = (contentWidth - 8) / servicesPerRow;
                const cardHeight = 18;
                const cardSpacing = 4;
                
                formData.services.forEach((service, index) => {
                    const col = index % servicesPerRow;
                    const row = Math.floor(index / servicesPerRow);
                    
                    if (col === 0 && row > 0) {
                        yPosition += cardHeight + cardSpacing;
                        checkAddPage(cardHeight + cardSpacing);
                    }
                    
                    const xPos = margin + (col * (cardWidth + cardSpacing));
                    const yPos = yPosition;
                    
                    pdf.setFillColor(236, 253, 245);
                    pdf.rect(xPos, yPos, cardWidth, cardHeight, 'F');
                    pdf.setFillColor(220, 252, 231);
                    pdf.rect(xPos, yPos, cardWidth, 5, 'F');
                    pdf.setDrawColor(167, 243, 208);
                    pdf.setLineWidth(0.5);
                    pdf.rect(xPos, yPos, cardWidth, cardHeight, 'S');
                    
                    pdf.setFillColor(22, 163, 74);
                    pdf.circle(xPos + 6, yPos + 9, 3, 'F');
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text('v', xPos + 5, yPos + 10.5);
                    
                    pdf.setTextColor(4, 120, 87);
                    pdf.setFontSize(8.5);
                    const lines = pdf.splitTextToSize(service.toString(), cardWidth - 16);
                    pdf.text(lines, xPos + 12, yPos + 10);
                });
                
                const totalRows = Math.ceil(formData.services.length / servicesPerRow);
                yPosition += (totalRows * (cardHeight + cardSpacing)) + 10;
            }

            // ==================== HOTELS ====================
            if (selectedHotels.length > 0) {
                checkAddPage(30);
                
                pdf.setFillColor(30, 64, 175);
                pdf.rect(margin, yPosition, contentWidth, 14, 'F');
                pdf.setFillColor(234, 179, 8);
                pdf.rect(margin, yPosition, contentWidth, 3, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(15);
                pdf.setFont('helvetica', 'bold');
                pdf.text('LUXURY ACCOMMODATIONS (' + selectedHotels.length + ')', pageWidth / 2, yPosition + 10, { align: 'center' });
                yPosition += 19;
                
                for (const hotel of selectedHotels) {
                    checkAddPage(65);
                    
                    const cardStartY = yPosition;
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(margin, cardStartY, contentWidth, 55, 'F');
                    pdf.setDrawColor(234, 179, 8);
                    pdf.setLineWidth(1.5);
                    pdf.rect(margin, cardStartY, contentWidth, 55, 'S');
                    
                    try {
                        const hotelImg = await loadImage(hotel.image);
                        pdf.addImage(hotelImg, 'JPEG', margin + 5, cardStartY + 5, 50, 45);
                        pdf.setDrawColor(234, 179, 8);
                        pdf.setLineWidth(1);
                        pdf.rect(margin + 5, cardStartY + 5, 50, 45, 'S');
                    } catch (error) {
                        pdf.setFillColor(226, 232, 240);
                        pdf.rect(margin + 5, cardStartY + 5, 50, 45, 'F');
                    }
                    
                    const detailsX = margin + 62;
                    pdf.setTextColor(15, 23, 42);
                    pdf.setFontSize(13);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(hotel.name, detailsX, cardStartY + 12);
                    
                    pdf.setTextColor(234, 179, 8);
                    pdf.setFontSize(12);
                    let starsText = '';
                    for (let i = 0; i < (hotel.rating || 5); i++) starsText += '*';
                    pdf.text(starsText, detailsX, cardStartY + 20);
                    
                    pdf.setTextColor(71, 85, 105);
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text('Location: ' + hotel.location, detailsX, cardStartY + 28);
                    
                    if (hotel.check_in && hotel.check_out) {
                        const checkInDate = format(new Date(hotel.check_in), 'MMM d, yyyy');
                        const checkOutDate = format(new Date(hotel.check_out), 'MMM d, yyyy');
                        pdf.text('Check-in: ' + checkInDate + '  |  Check-out: ' + checkOutDate, detailsX, cardStartY + 36);
                        pdf.setFont('helvetica', 'bold');
                        pdf.setTextColor(6, 182, 212);
                        pdf.text(hotel.nights + ' Night' + (hotel.nights > 1 ? 's' : '') + ' Stay', detailsX, cardStartY + 44);
                    }
                    
                    yPosition += 62;
                }
            }

            // ==================== ACTIVITIES ====================
            if (selectedActivities.length > 0) {
                checkAddPage(30);
                
                pdf.setFillColor(139, 92, 246);
                pdf.rect(margin, yPosition, contentWidth, 14, 'F');
                pdf.setFillColor(196, 181, 253);
                pdf.rect(margin, yPosition, contentWidth, 3, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(15);
                pdf.setFont('helvetica', 'bold');
                pdf.text('EXCITING EXPERIENCES (' + selectedActivities.length + ')', pageWidth / 2, yPosition + 10, { align: 'center' });
                yPosition += 19;
                
                for (let i = 0; i < selectedActivities.length; i++) {
                    const activity = selectedActivities[i];
                    checkAddPage(55);
                    
                    const activityCardY = yPosition;
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(margin, activityCardY, contentWidth, 48, 'F');
                    pdf.setFillColor(233, 213, 255);
                    pdf.rect(margin, activityCardY, contentWidth, 5, 'F');
                    pdf.setDrawColor(196, 181, 253);
                    pdf.setLineWidth(0.8);
                    pdf.rect(margin, activityCardY, contentWidth, 48, 'S');
                    
                    try {
                        const activityImg = await loadImage(activity.image);
                        pdf.addImage(activityImg, 'JPEG', margin + 5, activityCardY + 5, 50, 38);
                        pdf.setDrawColor(196, 181, 253);
                        pdf.setLineWidth(1);
                        pdf.rect(margin + 5, activityCardY + 5, 50, 38, 'S');
                    } catch (error) {
                        pdf.setFillColor(226, 232, 240);
                        pdf.rect(margin + 5, activityCardY + 5, 50, 38, 'F');
                    }
                    
                    const activityDetailX = margin + 62;
                    
                    pdf.setFillColor(139, 92, 246);
                    pdf.circle(activityDetailX - 5, activityCardY + 12, 4, 'F');
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text((i + 1).toString(), activityDetailX - 5, activityCardY + 14, { align: 'center' });
                    
                    pdf.setTextColor(15, 23, 42);
                    pdf.setFontSize(12);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(activity.name, activityDetailX + 2, activityCardY + 14);
                    
                    pdf.setTextColor(71, 85, 105);
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text('Duration: ' + activity.duration + '  |  ' + activity.groupSize, activityDetailX + 2, activityCardY + 24);
                    
                    // Show pricing structure
                    pdf.text('Adult Rate: $' + activity.adult_price + '  |  Child Rate: $' + activity.child_price, activityDetailX + 2, activityCardY + 32);
                    
                    pdf.setFillColor(22, 163, 74);
                    pdf.rect(activityDetailX + 2, activityCardY + 36, 35, 8, 'F');
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text('INCLUDED', activityDetailX + 19.5, activityCardY + 41, { align: 'center' });
                    
                    yPosition += 54;
                }
            }

            // ==================== TRANSPORTATION ====================
            if (selectedTransport.length > 0) {
                checkAddPage(30);
                
                pdf.setFillColor(59, 130, 246);
                pdf.rect(margin, yPosition, contentWidth, 14, 'F');
                pdf.setFillColor(147, 197, 253);
                pdf.rect(margin, yPosition, contentWidth, 3, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(15);
                pdf.setFont('helvetica', 'bold');
                pdf.text('TRANSPORTATION (' + selectedTransport.length + ')', pageWidth / 2, yPosition + 10, { align: 'center' });
                yPosition += 19;
                
                selectedTransport.forEach((transport, index) => {
                    checkAddPage(20);
                    
                    pdf.setFillColor(248, 250, 252);
                    pdf.rect(margin, yPosition, contentWidth, 16, 'F');
                    pdf.setFillColor(59, 130, 246);
                    pdf.rect(margin, yPosition, 4, 16, 'F');
                    pdf.setDrawColor(226, 232, 240);
                    pdf.setLineWidth(0.5);
                    pdf.rect(margin, yPosition, contentWidth, 16, 'S');
                    
                    pdf.setTextColor(15, 23, 42);
                    pdf.setFontSize(11);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(transport.name, margin + 10, yPosition + 10);
                    
                    pdf.setTextColor(71, 85, 105);
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text(transport.description, margin + 10, yPosition + 14);
                    
                    yPosition += 20;
                });
            }

            // ==================== PACKAGE TOTAL ====================
            checkAddPage(60);
            
            pdf.setFillColor(15, 23, 42);
            pdf.rect(margin, yPosition, contentWidth, 50, 'F');
            
            pdf.setFillColor(22, 163, 74);
            pdf.rect(margin, yPosition, contentWidth, 5, 'F');
            
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('PACKAGE SUMMARY', pageWidth / 2, yPosition + 15, { align: 'center' });
            
            pdf.setDrawColor(255, 255, 255);
            pdf.setLineWidth(0.5);
            pdf.line(margin + 30, yPosition + 20, pageWidth - margin - 30, yPosition + 20);
            
            pdf.setFontSize(28);
            pdf.setTextColor(22, 163, 74);
            pdf.text('TOTAL: $' + grandTotal.toLocaleString(), pageWidth / 2, yPosition + 38, { align: 'center' });
            
            yPosition += 60;

            // ==================== CLOSING ====================
            checkAddPage(50);
            
            pdf.setFillColor(248, 250, 252);
            pdf.rect(margin, yPosition, contentWidth, 40, 'F');
            pdf.setFillColor(6, 182, 212);
            pdf.rect(margin, yPosition, contentWidth, 3, 'F');
            pdf.setDrawColor(6, 182, 212);
            pdf.setLineWidth(0.5);
            pdf.rect(margin, yPosition, contentWidth, 40, 'S');
            
            pdf.setTextColor(30, 64, 175);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text('THANK YOU!', pageWidth / 2, yPosition + 15, { align: 'center' });
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(71, 85, 105);
            pdf.text('We look forward to making your journey unforgettable.', pageWidth / 2, yPosition + 26, { align: 'center' });
            pdf.text('Safe travels and create beautiful memories!', pageWidth / 2, yPosition + 34, { align: 'center' });

            // Save PDF
            const fileName = 'Travel-Package-' + (formData.name?.replace(/\s+/g, '-') || 'Summary') + '-' + format(new Date(), 'yyyy-MM-dd') + '.pdf';
            pdf.save(fileName);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const isDataComplete = formData.name && formData.phone && formData.destination;

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="py-20 bg-gradient-to-b from-slate-50 to-slate-100"
        >
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Your Journey
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Awaits You
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Download your personalized travel package
                    </p>
                </motion.div>

                {/* Price Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-white rounded-3xl shadow-2xl p-8 border border-slate-100"
                >
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Package Pricing</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600">Hotels ({selectedHotels.length})</span>
                            <span className="font-bold text-slate-900">${hotelTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600">Activities ({selectedActivities.length})</span>
                            <span className="font-bold text-slate-900">${activitiesTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600">Transportation ({selectedTransport.length})</span>
                            <span className="font-bold text-slate-900">${transportTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 bg-green-50 rounded-xl px-4 mt-4">
                            <span className="text-xl font-bold text-slate-900">GRAND TOTAL</span>
                            <span className="text-2xl font-bold text-green-600">${grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                >
                    <Button
                        onClick={generatePDF}
                        disabled={!isDataComplete || isGenerating}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-12 py-6 text-lg font-semibold rounded-2xl shadow-xl shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                Creating Your Package...
                            </>
                        ) : (
                            <>
                                <Download className="w-6 h-6 mr-3" />
                                Download Premium Package
                            </>
                        )}
                    </Button>
                </motion.div>

                {!isDataComplete && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 text-amber-600 bg-amber-50 rounded-xl p-4 inline-block border border-amber-200"
                    >
                        <FileText className="w-5 h-5 inline mr-2" />
                        Please fill in your name, phone, and destination
                    </motion.p>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-sm text-slate-500"
                >
                    <p>PDF shows only the total package price - individual pricing not displayed</p>
                </motion.div>
            </div>
        </motion.section>
    );
}