
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import UserTable from '@/components/users/UserTable';
import SearchFilter from '@/components/users/SearchFilter';
import { getUsers, searchUsers, User } from '@/services/mockData';

const PendingUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers('pending');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      const results = await searchUsers(query);
      setUsers(results.filter(user => user.status === 'pending'));
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleFilterChange = async (status: string) => {
    // For this specific view, we only show pending users
    if (status !== 'pending' && status !== 'all') return;
    
    fetchUsers();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Verifications</h1>
          <p className="text-muted-foreground">
            Review and process pending user verification requests.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <SearchFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />
          
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Loading pending users...</p>
            </div>
          ) : (
            <UserTable users={users} onStatusUpdate={fetchUsers} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PendingUsers;
