
import React from 'react';
import { Check, X, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/services/mockData';

interface LicenseModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  onReject: () => void;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onVerify, 
  onReject 
}) => {
  const isImage = !user.licenseFile.includes('pdf');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>License Document - {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 mb-6">
          <div className="flex flex-col space-y-2 text-sm mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">License ID:</div>
              <div>{user.licenseId}</div>
              
              <div className="font-medium">Email:</div>
              <div>{user.email}</div>
              
              <div className="font-medium">Phone:</div>
              <div>{user.phone}</div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            {isImage ? (
              <img 
                src={user.licenseFile} 
                alt="License Document" 
                className="w-full object-contain max-h-[50vh]" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-200 p-8 rounded-lg mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <path d="M14 2v6h6"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">PDF Document Preview</p>
                <p className="text-gray-500 text-sm mt-1">
                  PDF preview is not available. Please download the file to view it.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open(user.licenseFile, '_blank')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
              onClick={onReject}
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={onVerify}
            >
              <Check className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseModal;
