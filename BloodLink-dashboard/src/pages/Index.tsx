
import React from "react";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { BloodUnitCard } from "@/components/dashboard/BloodUnitCard";
import { UnitStatusCard } from "@/components/dashboard/UnitStatusCard";
import { DonationStatsCard } from "@/components/dashboard/DonationStatsCard";
import { RecentDonorsCard } from "@/components/dashboard/RecentDonorsCard";
import {
  requestedBloodUnits,
  receivedBloodUnits,
  unitStatus,
  donationStatistics,
  recentDonors
} from "@/data/dashboardData";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <WelcomeHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BloodUnitCard
          title="Requested"
          bloodUnits={requestedBloodUnits}
          className="animate-enter-delay-1"
        />
        <BloodUnitCard
          title="Received"
          bloodUnits={receivedBloodUnits}
          className="animate-enter-delay-1"
        />
        <UnitStatusCard
          title="Unit Status"
          unitStatus={unitStatus}
          className="animate-enter-delay-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DonationStatsCard
          title="Donation Statistics"
          statistics={donationStatistics}
          className="lg:col-span-2 animate-enter-delay-2"
        />
        <RecentDonorsCard
          title="Recent Donors"
          donors={recentDonors}
          className="animate-enter-delay-2"
        />
      </div>
    </div>
  );
};

export default Dashboard;
