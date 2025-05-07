import { useEffect, useState } from "react";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/utils/api";
import { toast } from "sonner";

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    licenseDocumentUrl: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/bloodbanks/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;

        setFormData({
          name: data.name || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
          address: data.address || "",
          licenseDocumentUrl: data.licenseDocumentUrl || "",
        });

        setProfile(data);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/api/bloodbanks/profile", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>License Document</Label>
              {formData.licenseDocumentUrl ? (
                <img
                  src={formData.licenseDocumentUrl}
                  alt="License"
                  className="h-32 w-auto rounded border cursor-pointer"
                  onClick={() => window.open(formData.licenseDocumentUrl, "_blank")}
                />
              ) : (
                <div className="text-sm text-muted-foreground">No license uploaded</div>
              )}
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Phone</Label>
                <Input id="contactNumber" value={formData.contactNumber} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={handleChange} />
              </div>
            </div>

            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                disabled
                value={`Lat: ${profile.location?.coordinates[1]}, Lng: ${profile.location?.coordinates[0]}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Input disabled value={profile.isApproved ? "Approved" : "Pending Approval"} />
            </div>
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
