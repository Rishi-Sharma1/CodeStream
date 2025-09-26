import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useLocation } from 'wouter';
export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { setUser } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { user } = await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        setUser(user);
        toast({
          title: "Success!",
          description: "User registered successfully",
        });
        navigate('/dashboard');
      } else {
        const { user } = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        setUser(user);
        toast({
          title: "Welcome back!",
          description: "Logged in successfully",
        });
        navigate('/dashboard');
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="auth-modal">
      <div className="bg-github-surface border border-github-border rounded-lg p-6 w-96 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-github-text">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-github-text-secondary hover:text-github-text"
            data-testid="button-close-auth-modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-4">
              <Label htmlFor="username" className="block text-sm font-medium mb-2 text-github-text">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
                data-testid="input-username"
              />
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium mb-2 text-github-text">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
              data-testid="input-email"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password" className="block text-sm font-medium mb-2 text-github-text">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary pr-10"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-github-text-secondary hover:text-github-text"
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="mb-6">
              <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-github-text">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
                data-testid="input-confirm-password"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-github-primary hover:bg-blue-600 text-white mb-4"
            data-testid="button-submit-auth"
          >
            {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-github-text-secondary">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="ml-1 text-github-primary hover:underline"
              data-testid="button-toggle-auth-mode"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}