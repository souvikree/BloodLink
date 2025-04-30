
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

// Mock data for blood requests
const mockRequests = [
  { 
    id: "REQ-001", 
    bloodGroup: "A+", 
    quantity: 3, 
    status: "Pending", 
    requester: "Memorial Hospital", 
    date: new Date(2023, 5, 15),
    patientName: "John Doe",
    urgency: "High",
    contactPerson: "Dr. Smith",
    contactNumber: "555-123-4567"
  },
  { 
    id: "REQ-002", 
    bloodGroup: "O-", 
    quantity: 2, 
    status: "Accepted", 
    requester: "City Clinic", 
    date: new Date(2023, 5, 14),
    patientName: "Jane Wilson",
    urgency: "Medium",
    contactPerson: "Dr. Johnson",
    contactNumber: "555-987-6543"
  },
  { 
    id: "REQ-003", 
    bloodGroup: "B+", 
    quantity: 1, 
    status: "Rejected", 
    requester: "General Hospital", 
    date: new Date(2023, 5, 13),
    patientName: "Robert Brown",
    urgency: "Low",
    contactPerson: "Dr. Williams",
    contactNumber: "555-456-7890"
  },
  { 
    id: "REQ-004", 
    bloodGroup: "AB+", 
    quantity: 4, 
    status: "Pending", 
    requester: "Regional Medical Center", 
    date: new Date(2023, 5, 12),
    patientName: "Emily Davis",
    urgency: "Critical",
    contactPerson: "Dr. Miller",
    contactNumber: "555-789-0123"
  },
  { 
    id: "REQ-005", 
    bloodGroup: "A-", 
    quantity: 2, 
    status: "Accepted", 
    requester: "Memorial Hospital", 
    date: new Date(2023, 5, 11),
    patientName: "Michael Taylor",
    urgency: "High",
    contactPerson: "Dr. Anderson",
    contactNumber: "555-234-5678"
  },
];

const RequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [detailsRequest, setDetailsRequest] = useState<typeof mockRequests[0] | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const filteredRequests = mockRequests.filter(request => 
    activeTab === "All" || request.status === activeTab
  );
  
  const handleViewDetails = (request: typeof mockRequests[0]) => {
    setDetailsRequest(request);
    setIsDetailsModalOpen(true);
  };
  
  const statusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Accepted": return "bg-green-100 text-green-800 border-green-200";
      case "Rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "";
    }
  };
  
  const urgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Blood Requests</h1>
      
      <div className="flex mb-6 border-b overflow-x-auto">
        {["All", "Pending", "Accepted", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm transition-colors relative
              ${activeTab === tab 
                ? "text-bloodlink-600 border-b-2 border-bloodlink-600" 
                : "text-muted-foreground hover:text-foreground"}`
            }
          >
            {tab}
            {tab === "Pending" && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-bloodlink-600"></span>
            )}
          </button>
        ))}
      </div>
      
      {/* For larger screens - Table view */}
      <div className="hidden md:block rounded-lg border shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.bloodGroup}</TableCell>
                <TableCell>{request.quantity} units</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusColor(request.status)}`}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>{request.requester}</TableCell>
                <TableCell>{format(request.date, "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewDetails(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {request.status === "Pending" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* For mobile screens - Card view */}
      <div className="md:hidden space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{request.id}</span>
                  <Badge variant="outline" className={`${statusColor(request.status)}`}>
                    {request.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Type</p>
                    <p className="font-medium">{request.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{request.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requester</p>
                    <p className="font-medium">{request.requester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(request.date, "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t p-2 bg-muted/50 flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewDetails(request)}
                >
                  <Eye className="h-4 w-4 mr-1" /> Details
                </Button>
                
                {request.status === "Pending" && (
                  <>
                    <Button variant="ghost" size="sm" className="text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Request Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Details - {detailsRequest?.id}</DialogTitle>
          </DialogHeader>
          
          {detailsRequest && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <Badge variant="outline" className={`${statusColor(detailsRequest.status)}`}>
                  {detailsRequest.status}
                </Badge>
                <Badge variant="outline" className={`${urgencyColor(detailsRequest.urgency)}`}>
                  {detailsRequest.urgency} Urgency
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-muted-foreground">Blood Group</h4>
                  <p className="font-medium">{detailsRequest.bloodGroup}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Quantity</h4>
                  <p className="font-medium">{detailsRequest.quantity} units</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Requester</h4>
                  <p className="font-medium">{detailsRequest.requester}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Date</h4>
                  <p className="font-medium">{format(detailsRequest.date, "PPP")}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Patient Name</h4>
                  <p className="font-medium">{detailsRequest.patientName}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Contact Person</h4>
                  <p className="font-medium">{detailsRequest.contactPerson}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Contact Number</h4>
                  <p className="font-medium">{detailsRequest.contactNumber}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            {detailsRequest?.status === "Pending" && (
              <>
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" /> Accept
                </Button>
              </>
            )}
            {detailsRequest?.status !== "Pending" && (
              <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsPage;
