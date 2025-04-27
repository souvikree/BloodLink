
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { DownloadCloud, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface BulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleDownloadSample = () => {
        toast.info("Sample Excel template downloaded");
        // In a real application, this would initiate a file download
    };

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

    const handleUpload = () => {
        if (!file) return;

        setIsLoading(true);

        // Simulate upload process
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Bulk stock uploaded successfully!");
            onClose();
            setFile(null);
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Bulk Upload Stock</DialogTitle>
                    <DialogDescription>
                        Upload multiple blood stock records at once using an Excel spreadsheet
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Button
                        variant="outline"
                        onClick={handleDownloadSample}
                        className="mb-4 w-full justify-center border-dashed"
                    >
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        Download Sample Excel Template
                    </Button>

                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? "border-bloodlink-400 bg-bloodlink-50" : "border-muted"
                            } ${file ? "border-green-500 bg-green-50/50" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("bulk-file")?.click()}
                    >
                        <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                            <UploadCloud className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <h3 className="text-sm font-medium">
                            {file ? file.name : "Upload your Excel sheet"}
                        </h3>

                        <p className="text-xs text-muted-foreground mt-1">
                            {file
                                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                                : "Drag and drop or click to browse"
                            }
                        </p>

                        <input
                            id="bulk-file"
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleUpload}
                        className="bg-bloodlink-600 hover:bg-bloodlink-700"
                        disabled={!file || isLoading}
                    >
                        {isLoading ? "Uploading..." : "Upload Records"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};