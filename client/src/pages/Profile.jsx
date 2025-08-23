import { useState } from 'react';
import { ArrowLeft, User, Mail, Save, Edit3, Calendar } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authService } from '../services/authService';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password change if attempted
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "New passwords do not match",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        if (!formData.currentPassword) {
          toast({
            title: "Error", 
            description: "Current password is required to change password",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // For now, just update the user context since we don't have update endpoints
      // In a real app, you'd call an API to update user information
      const updatedUser = {
        ...user,
        username: formData.username,
        email: formData.email
      };
      
      setUser(updatedUser);
      setIsEditing(false);
      
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-github-bg text-github-text">
      {/* Header */}
      <header className="bg-github-surface border-b border-github-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="bg-github-bg hover:bg-gray-700 border-github-border text-github-text"
                data-testid="button-back"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Editor
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">User Profile</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-github-surface border border-github-border rounded-lg p-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-github-primary rounded-full flex items-center justify-center text-2xl text-white">
                {user?.username ? user.username.slice(0, 2).toUpperCase() : <User size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-github-text">{user?.username}</h2>
                <p className="text-github-text-secondary">{user?.email}</p>
              </div>
            </div>
            
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-github-primary hover:bg-blue-600 text-white"
                data-testid="button-edit-profile"
              >
                <Edit3 size={16} className="mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                
                <div>
                  <Label htmlFor="username" className="block text-sm font-medium mb-2 text-github-text">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
                    data-testid="input-profile-username"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium mb-2 text-github-text">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
                    data-testid="input-profile-email"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2 text-github-text">
                    <Calendar size={16} className="inline mr-2" />
                    Member Since
                  </Label>
                  <p className="text-github-text-secondary bg-github-bg border border-github-border rounded-md px-3 py-2">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Security */}
              {isEditing && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <p className="text-sm text-github-text-secondary mb-4">
                    Leave password fields empty if you don't want to change your password.
                  </p>

                  <div>
                    <Label htmlFor="currentPassword" className="block text-sm font-medium mb-2 text-github-text">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
                      data-testid="input-current-password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-github-text">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
                      data-testid="input-new-password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-github-text">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
                      data-testid="input-confirm-password"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-github-border">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="bg-github-surface hover:bg-gray-700 border-github-border text-github-text"
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-github-primary hover:bg-blue-600 text-white"
                  data-testid="button-save-profile"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}