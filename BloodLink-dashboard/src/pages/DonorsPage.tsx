
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Plus, 
  Mail, 
  Phone, 
  UserPlus, 
  Filter, 
  SortDesc, 
  SortAsc 
} from "lucide-react";
import { format, parseISO } from "date-fns";

// Mock data for donors
const mockDonors = [
  {
    id: 1,
    name: "John Smith",
    bloodType: "O+",
    lastDonation: "2023-06-01",
    location: "New York, NY",
    contact: "555-123-4567",
    email: "john.s@example.com",
    donationsCount: 5,
    profileImage: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Emma Johnson",
    bloodType: "A-",
    lastDonation: "2023-05-15",
    location: "Boston, MA",
    contact: "555-234-5678",
    email: "emma.j@example.com",
    donationsCount: 3,
    profileImage: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Michael Brown",
    bloodType: "B+",
    lastDonation: "2023-06-10",
    location: "Chicago, IL",
    contact: "555-345-6789",
    email: "michael.b@example.com",
    donationsCount: 8,
    profileImage: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Sophia Williams",
    bloodType: "AB+",
    lastDonation: "2023-05-22",
    location: "Los Angeles, CA",
    contact: "555-456-7890",
    email: "sophia.w@example.com",
    donationsCount: 2,
    profileImage: "/placeholder.svg"
  },
  {
    id: 5,
    name: "James Miller",
    bloodType: "O-",
    lastDonation: "2023-06-05",
    location: "Houston, TX",
    contact: "555-567-8901",
    email: "james.m@example.com",
    donationsCount: 6,
    profileImage: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Olivia Davis",
    bloodType: "A+",
    lastDonation: "2023-05-30",
    location: "Miami, FL",
    contact: "555-678-9012",
    email: "olivia.d@example.com",
    donationsCount: 4,
    profileImage: "/placeholder.svg"
  },
  {
    id: 7,
    name: "William Garcia",
    bloodType: "B-",
    lastDonation: "2023-06-15",
    location: "Seattle, WA",
    contact: "555-789-0123",
    email: "william.g@example.com",
    donationsCount: 1,
    profileImage: "/placeholder.svg"
  },
  {
    id: 8,
    name: "Ava Rodriguez",
    bloodType: "AB-",
    lastDonation: "2023-06-08",
    location: "Denver, CO",
    contact: "555-890-1234",
    email: "ava.r@example.com",
    donationsCount: 7,
    profileImage: "/placeholder.svg"
  }
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorsPage: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<typeof mockDonors[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "lastDonation" | "donationsCount">("lastDonation");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const handleInvite = (donor: typeof mockDonors[0]) => {
    setSelectedDonor(donor);
    setIsInviteModalOpen(true);
  };
  
  const filteredDonors = mockDonors
    .filter(donor => 
      (filterBloodType === "All" || donor.bloodType === filterBloodType) &&
      (searchTerm === "" || 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === "lastDonation") {
        return sortOrder === "asc" 
          ? new Date(a.lastDonation).getTime() - new Date(b.lastDonation).getTime()
          : new Date(b.lastDonation).getTime() - new Date(a.lastDonation).getTime();
      } else {
        return sortOrder === "asc" 
          ? a.donationsCount - b.donationsCount
          : b.donationsCount - a.donationsCount;
      }
    });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Blood Donors</h1>
        <Button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="bg-bloodlink-600 hover:bg-bloodlink-700 whitespace-nowrap"
        >
          <Plus className="mr-1 h-4 w-4" /> Register New Donor
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search by name or location"
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 min-w-[230px]">
            <Filter size={16} className="text-muted-foreground" />
            <Select onValueChange={setFilterBloodType} defaultValue={filterBloodType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Blood Types</SelectItem>
                {bloodGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 min-w-[180px]">
            {sortOrder === "asc" ? (
              <SortAsc size={16} className="text-muted-foreground" />
            ) : (
              <SortDesc size={16} className="text-muted-foreground" />
            )}
            <Select 
              onValueChange={(value: "name" | "lastDonation" | "donationsCount") => setSortBy(value)} 
              defaultValue={sortBy}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="lastDonation">Last Donation</SelectItem>
                <SelectItem value="donationsCount">Donation Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="w-10 h-10"
          >
            {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDonors.map((donor) => (
          <Card key={donor.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img 
                      src={donor.profileImage} 
                      alt={donor.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-bloodlink-100"
                    />
                    <Badge className="absolute -bottom-1 -right-1 bg-bloodlink-600">{donor.bloodType}</Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-medium leading-tight">{donor.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{donor.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Last donation: </span>
                      <span>{format(parseISO(donor.lastDonation), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-muted/50 h-5 px-2">
                      {donor.donationsCount} donations
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between border-t p-3 bg-muted/30">
                <div className="flex gap-3">
                  <a href={`mailto:${donor.email}`} className="text-muted-foreground hover:text-foreground">
                    <Mail className="h-4 w-4" />
                  </a>
                  <a href={`tel:${donor.contact}`} className="text-muted-foreground hover:text-foreground">
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-bloodlink-600"
                  onClick={() => handleInvite(donor)}
                >
                  <UserPlus className="h-4 w-4 mr-1" /> Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* No results state */}
      {filteredDonors.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No donors found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
      
      <RegisterDonorModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
      <InviteDonorModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        donor={selectedDonor} 
      />
    </div>
  );
};

interface RegisterDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterDonorModal: React.FC<RegisterDonorModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Donor</DialogTitle>
          <DialogDescription>
            Enter the details of the new blood donor.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="First name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Last name" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blood-type">Blood Type</Label>
              <Select>
                <SelectTrigger id="blood-type">
                  <SelectValue placeholder="Select Blood Type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email address" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Phone number" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Full address" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last-donation">Last Donation Date (if any)</Label>
            <Input id="last-donation" type="date" />
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

interface InviteDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: typeof mockDonors[0] | null;
}

const InviteDonorModal: React.FC<InviteDonorModalProps> = ({ isOpen, onClose, donor }) => {
  const [messageType, setMessageType] = useState<"email" | "sms">("email");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };
  
  if (!donor) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite {donor.name} to Donate</DialogTitle>
          <DialogDescription>
            Send a donation invitation for the upcoming blood drive.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex border rounded-md overflow-hidden mb-4">
            <button 
              type="button"
              onClick={() => setMessageType("email")}
              className={`flex-1 py-2 text-sm font-medium ${
                messageType === "email" 
                  ? "bg-bloodlink-50 text-bloodlink-600" 
                  : "hover:bg-muted"
              }`}
            >
              Email
            </button>
            <button 
              type="button"
              onClick={() => setMessageType("sms")}
              className={`flex-1 py-2 text-sm font-medium ${
                messageType === "sms" 
                  ? "bg-bloodlink-50 text-bloodlink-600" 
                  : "hover:bg-muted"
              }`}
            >
              SMS
            </button>
          </div>
          
          {messageType === "email" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input id="recipient" value={donor.email} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  defaultValue="Invitation to Upcoming Blood Donation Drive" 
                />
              </div>
            </>
          )}
          
          {messageType === "sms" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Recipient</Label>
              <Input id="phone" value={donor.contact} readOnly />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea 
              id="message"
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={`Dear ${donor.name},\n\nWe're organizing a blood donation drive on June 14th, World Blood Donor Day, and we would be honored if you could participate.\n\nYour blood type (${donor.bloodType}) is currently in high demand.\n\nThank you for your consideration.`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Suggested Donation Date</Label>
            <Input id="date" type="date" defaultValue="2023-06-14" />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-bloodlink-600 hover:bg-bloodlink-700">Send Invitation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonorsPage;
