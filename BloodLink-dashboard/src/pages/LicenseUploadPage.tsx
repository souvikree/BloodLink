
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";

const LicenseUploadPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
    
        setIsLoading(true);
    
        const formData = new FormData();
        formData.append("license", file);
    
        const token = localStorage.getItem("token"); // Replace with correct key
    
        try {
            const response = await api.post("/api/bloodbanks/upload-license", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
    
            toast.success("Your License ID has been submitted successfully! Verification will be completed within 2-3 hours.");
    
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error: any) {
            console.error("Upload failed:", error.response?.data || error.message);
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Upload License ID</CardTitle>
                    <CardDescription>
                        We need to verify your license before you can use our services
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-bloodlink-400 bg-bloodlink-50" : "border-muted"
                            } ${file ? "border-bloodlink-500 bg-bloodlink-50/50" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("license-file")?.click()}
                    >
                        <div className="mx-auto w-12 h-12 rounded-full bg-bloodlink-100 flex items-center justify-center mb-4">
                            <UploadCloud className="h-6 w-6 text-bloodlink-600" />
                        </div>

                        <h3 className="text-lg font-medium mb-2">
                            {file ? file.name : "Upload a clear image of your License ID"}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-4">
                            {file
                                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                                : "Drag and drop your file here, or click to browse"
                            }
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Supports: JPG, PNG, PDF (Max size: 5MB)
                        </p>

                        <input
                            id="license-file"
                            type="file"
                            accept="image/jpeg,image/png,application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button
                        onClick={handleUpload}
                        className="w-full bg-bloodlink-600 hover:bg-bloodlink-700"
                        disabled={!file || isLoading}
                    >
                        {isLoading ? "Uploading..." : "Upload License ID"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        This document will be used for verification purposes only
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LicenseUploadPage;