import { useState } from 'react';
import { Code2, Users, MessageCircle, Download, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from '../components/AuthModal';

export default function Landing() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <div className="min-h-screen bg-github-bg text-github-text">
      {/* Header */}
      <header className="bg-github-surface border-b border-github-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code2 size={32} className="text-github-primary" />
            <h1 className="text-2xl font-bold">CodeCollab</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => openAuthModal('login')}
              variant="outline"
              className="bg-github-bg hover:bg-gray-700 border-github-border text-github-text"
              data-testid="button-login"
            >
              Sign In
            </Button>
            <Button
              onClick={() => openAuthModal('register')}
              className="bg-github-primary hover:bg-blue-600 text-white"
              data-testid="button-register"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Real-time Collaborative
            <span className="text-github-primary"> Code Editor</span>
          </h1>
          <p className="text-xl text-github-text-secondary mb-8 max-w-2xl mx-auto">
            Code together in real-time with your team. Share ideas, build projects, 
            and communicate seamlessly in our collaborative development environment.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => openAuthModal('register')}
              className="bg-github-primary hover:bg-blue-600 text-white text-lg px-8 py-3"
              data-testid="button-hero-start"
            >
              Start Coding Now
            </Button>
            <Button
              variant="outline"
              className="bg-github-surface hover:bg-gray-700 border-github-border text-github-text text-lg px-8 py-3"
              data-testid="button-hero-learn"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-github-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why CodeCollab?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-github-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code2 size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Code Editing</h3>
              <p className="text-github-text-secondary">
                Edit code together in real-time with syntax highlighting and auto-suggestions
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-github-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-github-text-secondary">
                Invite team members to your coding room and work together seamlessly
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-github-warning w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Built-in Chat</h3>
              <p className="text-github-text-secondary">
                Communicate with your team without leaving the editor
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-github-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save & Export</h3>
              <p className="text-github-text-secondary">
                Download your projects and save your work with version control
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Coding?</h2>
          <p className="text-xl text-github-text-secondary mb-8">
            Join thousands of developers already using CodeCollab for their projects.
          </p>
          <Button
            onClick={() => openAuthModal('register')}
            className="bg-github-primary hover:bg-blue-600 text-white text-lg px-8 py-3"
            data-testid="button-cta-register"
          >
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-github-surface border-t border-github-border px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Code2 size={24} className="text-github-primary" />
            <span className="text-lg font-semibold">CodeCollab</span>
          </div>
          <p className="text-github-text-secondary">
            Built for developers, by developers. Code better, together.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={closeAuthModal} 
        initialMode={authModal.mode} 
      />
    </div>
  );
}