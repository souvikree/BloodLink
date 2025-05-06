import React, { useState, useEffect } from "react";
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
import { DownloadCloud, Filter, Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";  // Import your api utility here (Axios instance)

const bloodTypes = ["All Types", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface Stock {
  id: number;
  bloodGroup: string;
  quantity: number;
  donorId?: string;
  expiryDate: string;
  createdAt: string;
  // Add other properties as needed
}

const StocksPage: React.FC = () => {
  const [expandedStocks, setExpandedStocks] = useState<{ [key: number]: boolean }>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [filterType, setFilterType] = useState("All Types");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [newBloodType, setNewBloodType] = useState("A+");
  const [units, setUnits] = useState("");
  const [donorId, setDonorId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  
  // Stock data state
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  

  // Fetch stocks data on component mount
  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/bloodbanks/inventory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setStocks(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
      toast.error("Failed to load blood inventory data.");
    } finally {
      setIsLoading(false);
    }
  };

  

  const filteredStocks = stocks.filter(stock => 
    filterType === "All Types" || stock.bloodGroup === filterType
  );

  const handleToggleExpand = (id: number) => {
    setExpandedStocks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetForm = () => {
    setNewBloodType("A+");
    setUnits("");
    setDonorId("");
    setExpiryDate("");
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newBloodType || !units || !expiryDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/bloodbanks/inventory/add", {
        bloodGroup: newBloodType,
        quantity: parseInt(units),
        expiryDate,
        donorId: donorId || null,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
    
      if (response.status !== 200) throw new Error(`Failed to add stock, status: ${response.status}`);
    
      toast.success("Blood stock added successfully!");
      setIsAddModalOpen(false);
      resetForm();
      
      // Refresh the stocks data
      fetchStocks();
    } catch (err: any) {
      console.error(err);
      // Display more detailed error if available
      if (err.response && err.response.data) {
        toast.error(`Error: ${err.response.data.message || err.response.data.error}`);
      } else {
        toast.error("Something went wrong while adding stock.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">Loading inventory data...</div>
        ) : (
          <StockTable 
            stocks={filteredStocks} 
            onToggleExpand={handleToggleExpand} 
            expandedStocks={expandedStocks}
          />
        )}
      </div>

      {/* Add Stock Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => {
        setIsAddModalOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Blood Stock</DialogTitle>
            <DialogDescription>
              Enter the details of the new blood stock.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4 pt-4"
            onSubmit={handleAddStock}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select value={newBloodType} onValueChange={setNewBloodType}>
                  <SelectTrigger id="bloodType">
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
                <Input 
                  id="units" 
                  name="units" 
                  type="number" 
                  placeholder="Number of units" 
                  value={units} 
                  onChange={(e) => setUnits(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="donorId">Donor ID (optional)</Label>
              <Input 
                id="donorId" 
                name="donorId" 
                placeholder="Enter donor ID" 
                value={donorId} 
                onChange={(e) => setDonorId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input 
                id="expiryDate" 
                name="expiryDate" 
                type="date" 
                value={expiryDate} 
                onChange={(e) => setExpiryDate(e.target.value)}
                required 
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-bloodlink-600 hover:bg-bloodlink-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Stock'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
        // onUploadSuccess={fetchStocks}
      />
    </div>
  );
};

export default StocksPage;