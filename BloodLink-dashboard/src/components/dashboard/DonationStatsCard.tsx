
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DonationStatistic } from "@/data/dashboardData";

interface DonationStatsCardProps {
  title: string;
  statistics: DonationStatistic[];
  className?: string;
}

export const DonationStatsCard: React.FC<DonationStatsCardProps> = ({ title, statistics, className }) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <div className="h-80 w-full px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statistics}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                formatter={(value) => [`${value} units`, 'Donations']}
              />
              <Bar 
                dataKey="donations" 
                fill="url(#colorGradient)" 
                radius={[4, 4, 0, 0]} 
                barSize={50} 
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
