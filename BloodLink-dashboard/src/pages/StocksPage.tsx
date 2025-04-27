
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { StockTable } from "../components/stocks/StockTable";
import { BulkUploadModal } from "../components/stocks/BulkUploadModal";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DownloadCloud, Filter, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

// Mock data for blood stocks
const mockStockData = [
  {
    id: 1,
    bloodGroup: "A+",
    availableUnits: 25,
    nearestExpiry: new Date(2023, 6, 15),
    details: [
      { unitId: "A-001", quantity: 5, collectionDate: new Date(2023, 5, 1), expiryDate: new Date(2023, 6, 15), status: 'Available' as const },
      { unitId: "A-002", quantity: 10, collectionDate: new Date(2023, 5, 5), expiryDate: new Date(2023, 6, 20), status: 'Available' as const },
      { unitId: "A-003", quantity: 10, collectionDate: new Date(2023, 5, 10), expiryDate: new Date(2023, 6, 25), status: 'Reserved' as const },
    ]
  },
  {
    id: 2,
    bloodGroup: "B-",
    availableUnits: 12,
    nearestExpiry: new Date(2023, 6, 20),
    details: [
      { unitId: "B-001", quantity: 6, collectionDate: new Date(2023, 5, 3), expiryDate: new Date(2023, 6, 20), status: 'Available' as const },
      { unitId: "B-002", quantity: 6, collectionDate: new Date(2023, 5, 7), expiryDate: new Date(2023, 6, 22), status: 'Available' as const },
    ]
  },
  {
    id: 3,
    bloodGroup: "O+",
    availableUnits: 35,
    nearestExpiry: new Date(2023, 7, 1),
    details: [
      { unitId: "O-001", quantity: 15, collectionDate: new Date(2023, 5, 15), expiryDate: new Date(2023, 7, 1), status: 'Available' as const },
      { unitId: "O-002", quantity: 10, collectionDate: new Date(2023, 5, 16), expiryDate: new Date(2023, 7, 5), status: 'Available' as const },
      { unitId: "O-003", quantity: 10, collectionDate: new Date(2023, 5, 20), expiryDate: new Date(2023, 7, 10), status: 'Reserved' as const },
    ]
  },
  {
    id: 4,
    bloodGroup: "AB+",
    availableUnits: 8,
    nearestExpiry: new Date(2023, 6, 25),
    details: [
      { unitId: "AB-001", quantity: 8, collectionDate: new Date(2023, 5, 10), expiryDate: new Date(2023, 6, 25), status: 'Available' as const },
    ]
  },
  {
    id: 5,
    bloodGroup: "A-",
    availableUnits: 14,
    nearestExpiry: new Date(2023, 7, 5),
    details: [
      { unitId: "A-004", quantity: 7, collectionDate: new Date(2023, 5, 20), expiryDate: new Date(2023, 7, 5), status: 'Available' as const },
      { unitId: "A-005", quantity: 7, collectionDate: new Date(2023, 5, 21), expiryDate: new Date(2023, 7, 10), status: 'Available' as const },
    ]
  }
];

const bloodTypes = ["All Types", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const locations = ["All Locations", "Central Hospital", "Memorial Clinic", "Regional Blood Bank"];

const StocksPage: React.FC = () => {
  const [expandedStocks, setExpandedStocks] = useState<{ [key: number]: boolean }>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [filterType, setFilterType] = useState("All Types");
  const [filterLocation, setFilterLocation] = useState("All Locations");
  
  // Apply stock data with expanded state
  const stocks = mockStockData.map(stock => ({
    ...stock,
    expanded: !!expandedStocks[stock.id]
  }));
  
  const filteredStocks = stocks.filter(stock => 
    (filterType === "All Types" || stock.bloodGroup === filterType)
  );
  
  const handleToggleExpand = (id: number) => {
    setExpandedStocks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Blood Stock Inventory</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsBulkUploadOpen(true)}
            className="bg-white border border-bloodlink-200 text-bloodlink-600 hover:bg-bloodlink-50"
          >
            <DownloadCloud className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-bloodlink-600 hover:bg-bloodlink-700"
          >
            <Plus className="mr-2 h-4 w-4" /> 
            Add Stock
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select onValueChange={setFilterType} defaultValue={filterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Blood Type" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={setFilterLocation} defaultValue={filterLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <StockTable 
          stocks={filteredStocks} 
          onToggleExpand={handleToggleExpand} 
        />
      </div>
      
      {/* Add Stock Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Blood Stock</DialogTitle>
            <DialogDescription>
              Enter the details of the new blood stock.
            </DialogDescription>
          </DialogHeader>
          
          <form className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blood-type">Blood Type</Label>
                <Select defaultValue="A+">
                  <SelectTrigger id="blood-type">
                    <SelectValue placeholder="Select Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.filter(t => t !== "All Types").map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Input id="units" type="number" placeholder="Number of units" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="donor-id">Donor ID (optional)</Label>
              <Input id="donor-id" placeholder="Enter donor ID" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input id="expiry-date" type="date" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Select defaultValue="Central Hospital">
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.filter(loc => loc !== "All Locations").map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button 
                type="button" 
                onClick={() => {
                  toast.success("Blood stock added successfully!");
                  setIsAddModalOpen(false);
                }}
                className="bg-bloodlink-600 hover:bg-bloodlink-700"
              >
                Add Stock
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Upload Modal */}
      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
      />
    </div>
  );
};

export default StocksPage;