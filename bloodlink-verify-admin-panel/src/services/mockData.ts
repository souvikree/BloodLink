
export interface User {
  id: string;
  name: string;
  licenseId: string;
  email: string;
  phone: string;
  address: string;
  licenseFile: string;
  status: 'pending' | 'verified' | 'rejected';
  registrationDate: Date;
}

// Mock file types for license
const FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Mock license files (in a real app these would be actual URLs to stored files)
const LICENSE_FILES = [
  'https://placehold.co/600x400?text=Medical+License',
  'https://placehold.co/600x400?text=Doctor+ID',
  'https://placehold.co/600x400/png?text=PDF+License+Document'
];

// Generate random data
const generateMockUsers = (count: number): User[] => {
  const statuses: ('pending' | 'verified' | 'rejected')[] = ['pending', 'verified', 'rejected'];
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Add more pending users for demo purposes
    const actualStatus = i < count * 0.6 ? 'pending' : status;

    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    users.push({
      id: `USR${10000 + i}`,
      name: `Dr. ${['John Smith', 'Sarah Johnson', 'Michael Wong', 'Emma Garcia', 'David Kim'][Math.floor(Math.random() * 5)]}`,
      licenseId: `ML${100000 + Math.floor(Math.random() * 900000)}`,
      email: `doctor${i}@hospital.org`,
      phone: `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      address: `${Math.floor(100 + Math.random() * 9900)} ${['Main St.', 'Broadway Ave.', 'Park Rd.', 'Lake Dr.', 'Hospital Blvd.'][Math.floor(Math.random() * 5)]}, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]}, ${['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)]} ${Math.floor(10000 + Math.random() * 90000)}`,
      licenseFile: LICENSE_FILES[Math.floor(Math.random() * LICENSE_FILES.length)],
      status: actualStatus,
      registrationDate: date,
    });
  }
  
  return users;
};

// Initial mock data
let mockUsers = generateMockUsers(20);

// Sort by registration date (newest first)
mockUsers.sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime());

// API simulation for getting users
export const getUsers = (status?: 'pending' | 'verified' | 'rejected'): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredUsers = status 
        ? mockUsers.filter(user => user.status === status)
        : mockUsers;
      resolve(filteredUsers);
    }, 300); // Add artificial delay to simulate API call
  });
};

// API simulation for searching users
export const searchUsers = (query: string): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredUsers = mockUsers.filter(user => 
        user.email.toLowerCase().includes(query.toLowerCase()) || 
        user.licenseId.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredUsers);
    }, 300);
  });
};

// API simulation for updating user status
export const updateUserStatus = (userId: string, newStatus: 'pending' | 'verified' | 'rejected'): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        reject(new Error('User not found'));
        return;
      }
      
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        status: newStatus,
      };
      
      resolve(mockUsers[userIndex]);
    }, 500);
  });
};

// API simulation for deleting a user
export const deleteUser = (userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        reject(new Error('User not found'));
        return;
      }
      
      mockUsers = mockUsers.filter(user => user.id !== userId);
      resolve();
    }, 500);
  });
};
