
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import UserTable from '@/components/users/UserTable';
import SearchFilter from '@/components/users/SearchFilter';
import { getUsers, searchUsers, User } from '@/services/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // If search is cleared, go back to filtered by status
      handleFilterChange(activeTab);
      return;
    }

    try {
      const results = await searchUsers(query);
      setFilteredUsers(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleFilterChange = async (status: string) => {
    setActiveTab(status);
    setLoading(true);
    
    try {
      let filtered: User[];
      
      if (status === 'all') {
        filtered = await getUsers();
      } else {
        filtered = await getUsers(status as 'pending' | 'verified' | 'rejected');
      }
      
      setFilteredUsers(filtered);
    } catch (error) {
      console.error('Filter failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Counters for each status
  const pendingCount = users.filter(user => user.status === 'pending').length;
  const verifiedCount = users.filter(user => user.status === 'verified').length;
  const rejectedCount = users.filter(user => user.status === 'rejected').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage user verification requests and track verification status.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div onClick={() => navigate('/admin/pending')} className="bg-white p-6 rounded-lg border border-yellow-200 shadow-sm cursor-pointer hover:bg-yellow-50 transition-colors">
            <h3 className="font-medium text-yellow-700">Pending</h3>
            <p className="text-3xl font-bold text-yellow-800">{pendingCount}</p>
          </div>
          <div onClick={() => navigate('/admin/verified')} className="bg-white p-6 rounded-lg border border-green-200 shadow-sm cursor-pointer hover:bg-green-50 transition-colors">
            <h3 className="font-medium text-green-700">Verified</h3>
            <p className="text-3xl font-bold text-green-800">{verifiedCount}</p>
          </div>
          <div onClick={() => navigate('/admin/rejected')} className="bg-white p-6 rounded-lg border border-red-200 shadow-sm cursor-pointer hover:bg-red-50 transition-colors">
            <h3 className="font-medium text-red-700">Rejected</h3>
            <p className="text-3xl font-bold text-red-800">{rejectedCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Verifications</h2>
          <SearchFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />
          
          <Tabs defaultValue="all" className="mb-4" onValueChange={handleFilterChange}>
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Loading users...</p>
            </div>
          ) : (
            <UserTable users={filteredUsers} onStatusUpdate={fetchUsers} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
