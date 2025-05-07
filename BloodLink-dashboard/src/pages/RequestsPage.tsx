import React, { useState, useEffect } from "react";
import api from "../utils/api"; // Import the API utility
import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

type RequestType = {
  _id: string;
  bloodType: string;
  quantity: number;
  status: string; // Changed to string to handle capitalized status values
  prescriptionUrl: string;
  requestedAt: string;
};

const RequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsRequest, setDetailsRequest] = useState<RequestType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getAuthToken = () => {
    // Get token from localStorage or wherever you store it
    return localStorage.getItem('token');
  };

  const fetchRequests = async () => {
    try {
      // Get the auth token
      const token = getAuthToken();
      
      // Using API utility with authorization header
      const res = await api.get("/api/bloodbanks/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Process the response data to match our component's needs
      const formattedRequests = res.data.map(order => {
        // Make sure we handle potential null or undefined values
        const status = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending";
        return {
          _id: order._id,
          bloodType: order.bloodType || "",
          quantity: order.quantity || 0,
          status: status,
          prescriptionUrl: order.prescriptionUrl || "",
          requestedAt: order.requestedAt || new Date().toISOString()
        };
      });
      
      setRequests(formattedRequests);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      // Get the auth token
      const token = getAuthToken();
      
      // Using API utility with PUT method and authorization header
      await api.put(`/api/bloodbanks/orders/${id}`, 
        { status }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: status.charAt(0).toUpperCase() + status.slice(1) } : req
        )
      );

      if (detailsRequest?._id === id) {
        setDetailsRequest({
          ...detailsRequest,
          status: status.charAt(0).toUpperCase() + status.slice(1)
        });
      }
    } catch (error) {
      console.error(`Failed to ${status} request:`, error);
    }
  };

  const filteredRequests = requests.filter(
    (request) => activeTab === "All" || request.status.toLowerCase() === activeTab.toLowerCase()
  );

  const handleViewDetails = (request: RequestType) => {
    setDetailsRequest(request);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const statusColor = (status: string) => {
    if (!status) return "";
    
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "delivered": return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Blood Requests</h1>

      <div className="flex mb-6 border-b overflow-x-auto">
        {["All", "Pending", "Accepted", "Rejected", "Delivered", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm transition-colors relative
              ${activeTab === tab
                ? "text-bloodlink-600 border-b-2 border-bloodlink-600"
                : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table view */}
      <div className="hidden md:block rounded-lg border shadow overflow-hidden">
        {isLoading ? (
          <p className="p-4">Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="p-4">No requests found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell className="font-medium">{request._id.slice(-5)}</TableCell>
                  <TableCell>{request.bloodType}</TableCell>
                  <TableCell>{request.quantity} units</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      try {
                        if (!request.requestedAt) return "N/A";
                        return format(new Date(request.requestedAt), "MMM dd, yyyy");
                      } catch (error) {
                        return "Invalid date";
                      }
                    })()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(request)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === "Pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="text-green-600" onClick={() => updateRequestStatus(request._id, "accepted")}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => updateRequestStatus(request._id, "rejected")}>
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
        )}
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <p className="p-4">Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="p-4">No requests found.</p>
        ) : filteredRequests.map((request) => (
          <Card key={request._id}>
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{request._id.slice(-5)}</span>
                  <Badge variant="outline" className={statusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Type</p>
                    <p className="font-medium">{request.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{request.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {(() => {
                        try {
                          return format(new Date(request.requestedAt), "MMM dd, yyyy");
                        } catch (error) {
                          return "Invalid date";
                        }
                      })()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t p-2 bg-muted/50 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(request)}>
                  <Eye className="h-4 w-4 mr-1" /> Details
                </Button>
                {request.status === "Pending" && (
                  <>
                    <Button variant="ghost" size="sm" className="text-green-600" onClick={() => updateRequestStatus(request._id, "accepted")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => updateRequestStatus(request._id, "rejected")}>
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details - {detailsRequest?._id?.slice(-5)}</DialogTitle>
          </DialogHeader>
          {detailsRequest && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <Badge variant="outline" className={statusColor(detailsRequest.status)}>
                  {detailsRequest.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-muted-foreground">Blood Type</h4>
                  <p className="font-medium">{detailsRequest.bloodType}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Quantity</h4>
                  <p className="font-medium">{detailsRequest.quantity} units</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Date</h4>
                  <p className="font-medium">
                    {(() => {
                      try {
                        return format(new Date(detailsRequest.requestedAt), "PPP");
                      } catch (error) {
                        return "Invalid date";
                      }
                    })()}
                  </p>
                </div>
              </div>
              
              {detailsRequest.prescriptionUrl && (
                <div className="mt-4">
                  <h4 className="text-sm text-muted-foreground mb-2">Prescription</h4>
                  <div className="mt-1 border rounded-md overflow-hidden">
                    <img 
                      src={detailsRequest.prescriptionUrl} 
                      alt="Prescription" 
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <a 
                      href={detailsRequest.prescriptionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Full Image
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {detailsRequest?.status === "Pending" && (
              <>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  onClick={() => updateRequestStatus(detailsRequest._id, "rejected")}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateRequestStatus(detailsRequest._id, "accepted")}
                >
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