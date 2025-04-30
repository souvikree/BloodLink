
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { BloodUnit } from "@/data/dashboardData";

interface BloodUnitCardProps {
  title: string;
  bloodUnits: BloodUnit[];
  className?: string;
}

export const BloodUnitCard: React.FC<BloodUnitCardProps> = ({ title, bloodUnits, className }) => {
  const total = bloodUnits.reduce((sum, unit) => sum + unit.count, 0);

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="h-[180px] w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bloodUnits}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {bloodUnits.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} units`, `Type ${name}`]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {bloodUnits.map((unit) => (
              <div 
                key={unit.type}
                className="flex items-center justify-between bg-secondary rounded-lg p-2 w-24"
              >
                <span className="font-medium text-sm">{unit.type}</span>
                <span className="font-semibold text-sm">{unit.count}</span>
              </div>
            ))}
            <div className="flex items-center justify-between bg-bloodlink-50 rounded-lg p-2 w-24">
              <span className="font-medium text-sm">Total</span>
              <span className="font-semibold text-sm">{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
