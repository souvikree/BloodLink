
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Search, Plus, UserRound, FileText, Building } from "lucide-react";

// Mock data for receivers
const mockReceivers = [
  {
    id: 1,
    name: "Sarah Johnson",
    bloodGroup: "A+",
    hospital: "Memorial Hospital",
    contactEmail: "sarah.j@example.com",
    contactPhone: "555-123-4567",
    lastRequest: "June 10, 2023",
    requestStatus: "Fulfilled"
  },
  {
    id: 2,
    name: "David Lee",
    bloodGroup: "O-",
    hospital: "City Medical Center",
    contactEmail: "david.l@example.com",
    contactPhone: "555-234-5678",
    lastRequest: "May 28, 2023",
    requestStatus: "Pending"
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    bloodGroup: "B+",
    hospital: "General Hospital",
    contactEmail: "maria.r@example.com",
    contactPhone: "555-345-6789",
    lastRequest: "June 5, 2023",
    requestStatus: "Fulfilled"
  },
  {
    id: 4,
    name: "James Wilson",
    bloodGroup: "AB-",
    hospital: "Central Clinic",
    contactEmail: "james.w@example.com",
    contactPhone: "555-456-7890",
    lastRequest: "June 15, 2023",
    requestStatus: "Pending"
  },
  {
    id: 5,
    name: "Emily Davis",
    bloodGroup: "A-",
    hospital: "St. Mary's Hospital",
    contactEmail: "emily.d@example.com",
    contactPhone: "555-567-8901",
    lastRequest: "June 2, 2023",
    requestStatus: "Fulfilled"
  },
  {
    id: 6,
    name: "Michael Brown",
    bloodGroup: "O+",
    hospital: "Regional Medical Center",
    contactEmail: "michael.b@example.com",
    contactPhone: "555-678-9012",
    lastRequest: "May 20, 2023",
    requestStatus: "Cancelled"
  }
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const ReceiverPage: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  
  const filteredReceivers = mockReceivers.filter(receiver => 
    (filterBloodGroup === "All" || receiver.bloodGroup === filterBloodGroup) &&
    (searchTerm === "" || 
      receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receiver.hospital.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const requestStatusColor = (status: string) => {
    switch (status) {
      case "Fulfilled": return "bg-green-100 text-green-800 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Blood Receivers</h1>
        <Button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="bg-bloodlink-600 hover:bg-bloodlink-700"
        >
          <Plus className="mr-1 h-4 w-4" /> Register New Receiver
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search by name or hospital"
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Select onValueChange={setFilterBloodGroup} defaultValue={filterBloodGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Blood Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Blood Groups</SelectItem>
              {bloodGroups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md overflow-hidden">
            <button 
              onClick={() => setViewMode("cards")} 
              className={`px-3 text-sm ${viewMode === "cards" ? 
                "bg-bloodlink-50 text-bloodlink-600" : "hover:bg-muted"}`}
            >
              Cards
            </button>
            <button 
              onClick={() => setViewMode("table")} 
              className={`px-3 text-sm ${viewMode === "table" ? 
                "bg-bloodlink-50 text-bloodlink-600" : "hover:bg-muted"}`}
            >
              Table
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceivers.map((receiver) => (
            <Card key={receiver.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-muted/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-bloodlink-100 flex items-center justify-center">
                      <UserRound className="h-5 w-5 text-bloodlink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{receiver.name}</h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Badge variant="outline">{receiver.bloodGroup}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{receiver.hospital}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Last Request</div>
                      <div className="flex gap-2 items-center">
                        {receiver.lastRequest}
                        <Badge variant="outline" className={`${requestStatusColor(receiver.requestStatus)}`}>
                          {receiver.requestStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{receiver.contactEmail}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{receiver.contactPhone}</span>
                  </div>
                </div>
                
                <div className="border-t p-3 bg-muted/30 flex justify-between">
                  <Button variant="ghost" size="sm">View History</Button>
                  <Button variant="outline" size="sm" className="text-bloodlink-600">Contact</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Last Request</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceivers.map((receiver) => (
                <TableRow key={receiver.id}>
                  <TableCell className="font-medium">{receiver.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{receiver.bloodGroup}</Badge>
                  </TableCell>
                  <TableCell>{receiver.hospital}</TableCell>
                  <TableCell>{receiver.lastRequest}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${requestStatusColor(receiver.requestStatus)}`}>
                      {receiver.requestStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <a href={`mailto:${receiver.contactEmail}`} className="text-muted-foreground hover:text-foreground">
                        <Mail className="h-4 w-4" />
                      </a>
                      <a href={`tel:${receiver.contactPhone}`} className="text-muted-foreground hover:text-foreground">
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View History</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <RegisterReceiverModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </div>
  );
};

interface RegisterReceiverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterReceiverModal: React.FC<RegisterReceiverModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Receiver</DialogTitle>
          <DialogDescription>
            Enter the details of the new blood receiver.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="first-name" className="text-sm font-medium">First Name</label>
              <Input id="first-name" placeholder="First name" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="last-name" className="text-sm font-medium">Last Name</label>
              <Input id="last-name" placeholder="Last name" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="blood-group" className="text-sm font-medium">Blood Group</label>
              <Select>
                <SelectTrigger id="blood-group">
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="hospital" className="text-sm font-medium">Hospital / Facility</label>
              <Input id="hospital" placeholder="Hospital name" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" type="email" placeholder="Email address" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <Input id="phone" placeholder="Phone number" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Address</label>
            <Input id="address" placeholder="Full address" />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-bloodlink-600 hover:bg-bloodlink-700">Register</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiverPage;
