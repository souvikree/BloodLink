
import React, { useState } from 'react';
import { Check, X, Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User, updateUserStatus, deleteUser } from '@/services/mockData';
import { toast } from 'sonner';
import LicenseModal from './LicenseModal';

interface UserTableProps {
  users: User[];
  onStatusUpdate: () => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onStatusUpdate }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeSince = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h ago`;
    }
    return `${diffHours}h ago`;
  };

  const handleViewLicense = (user: User) => {
    setSelectedUser(user);
    setIsLicenseModalOpen(true);
  };

  const handleVerify = async (user: User) => {
    try {
      await updateUserStatus(user.id, 'verified');
      toast.success(`${user.name} has been verified`);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to verify user');
      console.error(error);
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      toast.success(`${userToDelete.name} has been deleted`);
      setIsDeleteDialogOpen(false);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    }
  };

  const handleReject = async (user: User) => {
    try {
      await updateUserStatus(user.id, 'rejected');
      toast.success(`${user.name} has been rejected`);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to reject user');
      console.error(error);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>License ID</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead className="hidden xl:table-cell">Address</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.licenseId}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{user.phone}</TableCell>
                  <TableCell className="hidden xl:table-cell max-w-xs truncate">{user.address}</TableCell>
                  <TableCell className="hidden sm:table-cell whitespace-nowrap">
                    <div>{formatDate(user.registrationDate)}</div>
                    <div className="text-xs text-muted-foreground">{getTimeSince(user.registrationDate)}</div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewLicense(user)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block 
                      ${user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${user.status === 'verified' ? 'bg-green-100 text-green-800' : ''}
                      ${user.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.status !== 'verified' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                          onClick={() => handleVerify(user)}
                          title="Verify"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status !== 'rejected' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                          onClick={() => handleReject(user)}
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-gray-50 hover:bg-gray-100 border-gray-200"
                        onClick={() => handleOpenDeleteDialog(user)}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <LicenseModal
          user={selectedUser}
          isOpen={isLicenseModalOpen}
          onClose={() => setIsLicenseModalOpen(false)}
          onVerify={() => {
            handleVerify(selectedUser);
            setIsLicenseModalOpen(false);
          }}
          onReject={() => {
            handleReject(selectedUser);
            setIsLicenseModalOpen(false);
          }}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user {userToDelete?.name} and remove all of their data from the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-bloodlink hover:bg-bloodlink-dark"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTable;
