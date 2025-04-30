
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodUnit {
  type: BloodType;
  count: number;
  color: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodType: BloodType;
  donationDate: string;
  status: 'completed' | 'pending' | 'rejected';
}

export interface DonationStatistic {
  month: string;
  donations: number;
}

export const bloodTypeColors: Record<BloodType, string> = {
  'A+': '#e53e3e',
  'A-': '#f56565',
  'B+': '#dd6b20',
  'B-': '#ed8936',
  'AB+': '#805ad5',
  'AB-': '#9f7aea',
  'O+': '#38a169',
  'O-': '#48bb78',
};

export const requestedBloodUnits: BloodUnit[] = [
  { type: 'O+', count: 5, color: bloodTypeColors['O+'] },
  { type: 'O-', count: 4, color: bloodTypeColors['O-'] },
  { type: 'A+', count: 1, color: bloodTypeColors['A+'] },
];

export const receivedBloodUnits: BloodUnit[] = [
  { type: 'O+', count: 5, color: bloodTypeColors['O+'] },
  { type: 'O-', count: 4, color: bloodTypeColors['O-'] },
  { type: 'A+', count: 1, color: bloodTypeColors['A+'] },
];

export const unitStatus = [
  { type: 'A+', percentage: 25 },
  { type: 'O+', percentage: 35 },
  { type: 'AB-', percentage: 15 },
  { type: 'O-', percentage: 25 },
];

export const donationStatistics: DonationStatistic[] = [
  { month: 'Jan', donations: 450 },
  { month: 'Feb', donations: 480 },
  { month: 'Mar', donations: 350 },
  { month: 'Apr', donations: 400 },
  { month: 'May', donations: 380 },
  { month: 'Jun', donations: 420 },
];

export const recentDonors: Donor[] = [
  {
    id: '1',
    name: 'Messi',
    bloodType: 'O+',
    donationDate: '2023-05-15T09:00:00Z',
    status: 'completed',
  },
  {
    id: '2',
    name: 'Ronaldo',
    bloodType: 'A+',
    donationDate: '2023-05-14T14:30:00Z',
    status: 'completed',
  },
  {
    id: '3',
    name: 'Emma Thompson',
    bloodType: 'B-',
    donationDate: '2023-05-13T11:15:00Z',
    status: 'completed',
  },
  {
    id: '4',
    name: 'Michael Chen',
    bloodType: 'AB+',
    donationDate: '2023-05-12T10:45:00Z',
    status: 'completed',
  },
  {
    id: '5',
    name: 'Sophia Rodriguez',
    bloodType: 'O-',
    donationDate: '2023-05-11T13:20:00Z',
    status: 'completed',
  }
];

export const bloodInventory = {
  total: 120,
  available: 85,
  reserved: 35,
};
