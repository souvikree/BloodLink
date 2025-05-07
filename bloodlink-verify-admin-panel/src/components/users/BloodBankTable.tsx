import React, { useState } from 'react';
import { Check, X, Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import LicenseModal from './LicenseModal';

interface BloodBank {
  _id: string;
  name: string;
  licenseId: string;
  licenseDocumentUrl: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
  isApproved: boolean | null;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface BloodBankTableProps {
  users: BloodBank[];
  onStatusUpdate: () => void;
  updateBloodBankStatus: (id: string, status: 'approve' | 'reject') => Promise<void>;
  deleteBloodBank: (id: string) => Promise<void>;
}

const BloodBankTable: React.FC<BloodBankTableProps> = ({
  users, onStatusUpdate, updateBloodBankStatus, deleteBloodBank,
}) => {
  const [selectedUser, setSelectedUser] = useState<BloodBank | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<BloodBank | null>(null);

  const getStatus = (user: BloodBank) => {
    if (user.isApproved === true) return 'verified';
    if (user.isApproved === false) return 'rejected';
    return 'pending';
  };

  const handleViewLicense = (user: BloodBank) => {
    setSelectedUser(user);
    setIsLicenseModalOpen(true);
  };

  const handleVerify = async (user: BloodBank) => {
    try {
      await updateBloodBankStatus(user._id, 'approve');
      toast.success(`${user.name} has been verified`);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to verify blood bank');
    }
  };

  const handleReject = async (user: BloodBank) => {
    try {
      await updateBloodBankStatus(user._id, 'reject');
      toast.success(`${user.name} has been rejected`);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to reject blood bank');
    }
  };

  const handleOpenDeleteDialog = (user: BloodBank) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteBloodBank(userToDelete._id);
      toast.success(`${userToDelete.name} has been deleted`);
      setIsDeleteDialogOpen(false);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to delete blood bank');
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>License ID</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead className="hidden xl:table-cell">Address</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => {
                if (!user) return null; // Skip rendering if user is undefined
                const status = getStatus(user);
                return (
                  <TableRow key={user._id || 'unknown'}>
                    <TableCell>{user._id ? user._id.slice(-6) : 'N/A'}</TableCell>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.licenseId || 'N/A'}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.email || 'N/A'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{user.contactNumber || 'N/A'}</TableCell>
                    <TableCell className="hidden xl:table-cell max-w-xs truncate">{user.address || 'N/A'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLicense(user)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {status !== 'verified' && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleVerify(user)}
                            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {status !== 'rejected' && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleReject(user)}
                            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(user)}
                          className="bg-gray-50 hover:bg-gray-100 border-gray-200"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No blood banks found
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
            <AlertDialogTitle>Delete Blood Bank</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>{userToDelete?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
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

export default BloodBankTable;