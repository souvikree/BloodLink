
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Donor, bloodTypeColors } from "@/data/dashboardData";
import { formatDistanceToNow } from "date-fns";

interface RecentDonorsCardProps {
  title: string;
  donors: Donor[];
  className?: string;
}

export const RecentDonorsCard: React.FC<RecentDonorsCardProps> = ({ title, donors, className }) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {donors.map((donor) => (
            <div 
              key={donor.id}
              className="flex items-center p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-bloodlink-50 border border-bloodlink-100 flex items-center justify-center text-bloodlink-700 font-medium">
                {donor.name.charAt(0)}
              </div>
              
              <div className="ml-3 flex-1 overflow-hidden">
                <h3 className="font-medium text-foreground truncate">{donor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(donor.donationDate), { addSuffix: true })}
                </p>
              </div>
              
              <div 
                className="flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${bloodTypeColors[donor.bloodType]}20`,
                  color: bloodTypeColors[donor.bloodType]
                }}
              >
                {donor.bloodType}
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-6 text-sm font-medium text-bloodlink-600 hover:text-bloodlink-700 transition-colors">
          View all donors
        </button>
      </CardContent>
    </Card>
  );
};
