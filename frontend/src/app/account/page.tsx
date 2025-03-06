'use client';

import BackToHome from '@/components/ui/BackToHome';
import Spinner from '@/components/ui/Spinner';
import { useCurrentUser } from '@/hooks/useUser';

export default function AccountPage() {
  const { user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <BackToHome error={error.message} />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">Account Settings</h1>
        
        {user && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-500">Username:</span>
                <span className="text-gray-600">{user.username}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-500">User ID:</span>
                <span className="text-sm text-gray-600">{user._id}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-500">Role:</span>
                <span className="text-gray-600">{user.isAdmin ? 'Administrator' : 'User'}</span>
              </div>
            </div>
          </div>
        )}
        
        <BackToHome />
      </div>
    </div>
  );
} 