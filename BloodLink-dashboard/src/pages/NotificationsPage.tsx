
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, Mail, UserRound } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const notifications = [
  {
    id: 1,
    title: "New Donation Request",
    description: "Urgent request for O+ blood type",
    time: "2 hours ago",
    icon: Bell,
    read: false,
  },
  {
    id: 2,
    title: "Donation Appointment",
    description: "Your scheduled donation is tomorrow",
    time: "5 hours ago",
    icon: Calendar,
    read: true,
  },
  {
    id: 3,
    title: "Profile Update",
    description: "Your profile information was updated",
    time: "1 day ago",
    icon: UserRound,
    read: true,
  },
  {
    id: 4,
    title: "System Update",
    description: "New features have been added to the platform",
    time: "2 days ago",
    icon: Mail,
    read: true,
  },
];

const NotificationsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Notifications</h1>
        <p className="text-muted-foreground">Manage your notifications and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
              <CardContent className="flex items-start space-x-4 pt-6">
                <div className={`p-2 rounded-full ${notification.read ? 'bg-secondary' : 'bg-bloodlink-50'}`}>
                  <notification.icon className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-bloodlink-500'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="emails">Email Notifications</Label>
              <Switch id="emails" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="push">Push Notifications</Label>
              <Switch id="push" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="requests">Donation Requests</Label>
              <Switch id="requests" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="reminders">Appointment Reminders</Label>
              <Switch id="reminders" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotificationsPage

