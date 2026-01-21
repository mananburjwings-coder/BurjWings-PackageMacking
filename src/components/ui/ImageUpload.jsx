import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";

export default function ImageUpload({ value, onChange, className }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await base44.integrations.Core.UploadFile({ file });
            if (result && result.file_url) {
                onChange(result.file_url);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex gap-4 items-center">
                {value ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                )}
                <div className="flex-1">
                    <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="cursor-pointer file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-full file:px-4 file:py-1 file:mr-4 hover:file:bg-blue-100 transition-all"
                    />
                    {uploading && <p className="text-xs text-blue-600 mt-1 flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Uploading...</p>}
                </div>
            </div>
        </div>
    );
}