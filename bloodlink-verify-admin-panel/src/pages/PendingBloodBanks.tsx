// pages/admin/pendingbloodbanks.tsx

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import BloodBankTable from '@/components/users/BloodBankTable';
import api from '@/utils/api';
import { toast } from 'sonner';

export interface BloodBank {
  _id: string;
  name: string;
  licenseId: string;
  licenseDocumentUrl: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  isApproved: boolean;
  [key: string]: any;
}

// ✅ Auth headers helper
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     throw new Error('No token found in local storage');
//   }
//   console.log(token);
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// ✅ Fetch pending blood banks
// ❌ REMOVE getAuthHeaders() from here
const getPendingBloodBanks = async (): Promise<BloodBank[]> => {
  const res = await api.get('/api/admin/pending-bloodbanks');
  return res.data;
};

const updateBloodBankStatus = async (
  id: string,
  status: 'approve' | 'reject'
): Promise<void> => {
  try {
    await api.put(`/api/admin/${status}-bloodbank/${id}`);
    toast.success(`Blood bank ${status === 'approve' ? 'verified' : 'reject'} successfully`);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || `Failed to ${status} blood bank`);
    throw error;
  }
};

const deleteBloodBank = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/admin/delete-bloodbank/${id}`);
    toast.success('Blood bank deleted successfully');
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to delete blood bank');
    throw error;
  }
};

// ✅ Main component
const PendingBloodBanks = () => {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingBloodBanks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPendingBloodBanks();
      setBloodBanks(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch pending blood banks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBloodBanks();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Blood Banks</h1>
          <p className="text-muted-foreground">
            Review and approve newly registered blood banks.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          {loading ? (
            <div className="py-20 text-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Loading pending blood banks...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <BloodBankTable
              users={bloodBanks}
              onStatusUpdate={fetchPendingBloodBanks}
              updateBloodBankStatus={updateBloodBankStatus}
              deleteBloodBank={deleteBloodBank}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PendingBloodBanks;
