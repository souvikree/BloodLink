
import React from "react";
import { cn } from "@/lib/utils";

interface WelcomeHeaderProps {
  className?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ className }) => {
  const currentHour = new Date().getHours();
  let greeting = "Welcome";
  
  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return (
    <div className={cn("animate-enter", className)}>
      <h1 className="text-2xl font-semibold text-foreground">
        {greeting}, <span className="text-bloodlink-600">John</span>
      </h1>
      <p className="text-muted-foreground mt-1">
        BloodLink Dashboard • Central Blood Bank
      </p>
    </div>
  );
};
