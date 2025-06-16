import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { isSignInWithEmailLink, signInWithEmailLink, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getInvitationByEmail, updateInvitationStatus, addUserToVault } from '../services/firestore';
import { Star, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const AcceptInvite: React.FC = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'invalid'>('processing');
  const [message, setMessage] = useState('Processing your invitation...');

  useEffect(() => {
    const processInvitation = async () => {
      try {
        // Check if the current URL is a Firebase email sign-in link
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          setStatus('invalid');
          setMessage('Invalid invitation link. Please check your email for the correct link.');
          return;
        }

        // Get the email from localStorage
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // If email is not in localStorage, prompt user to enter it
          email = window.prompt('Please provide your email for confirmation');
          if (!email) {
            setStatus('error');
            setMessage('Email is required to complete the invitation process.');
            return;
          }
        }

        setMessage('Verifying your email and signing you in...');
        showInfo('Processing Invitation', 'Verifying your email with Firebase...');

        // Sign in with the email link
        const result = await signInWithEmailLink(auth, email, window.location.href);
        const user = result.user;

        setMessage('Looking up your invitation details...');

        // Get the invitation details - updated to match new function signature
        const invitation = await getInvitationByEmail(email);
        
        if (!invitation) {
          setStatus('error');
          setMessage('No pending invitation found for this email address.');
          showError('Invitation Not Found', 'No pending invitation found for your email.');
          return;
        }

        setMessage('Setting up your account...');

        // Update user profile if needed (for new users)
        if (!user.displayName) {
          const displayName = email.split('@')[0];
          await updateProfile(user, {
            displayName: displayName
          });
          showInfo('Account Setup', 'Setting up your profile...');
        }

        setMessage('Adding you to the family vault...');

        // Add user to vault with the assigned role - updated parameter order
        await addUserToVault(
          user.uid,
          email,
          user.displayName || email.split('@')[0],
          invitation.role,
          invitation.vaultId
        );

        // Mark invitation as accepted
        await updateInvitationStatus(invitation.id, 'accepted');

        // Clean up localStorage
        window.localStorage.removeItem('emailForSignIn');

        setStatus('success');
        setMessage(`Welcome to the family vault! You've been added as ${invitation.role}.`);
        
        showSuccess(
          'Welcome to Legacy!', 
          `You've successfully joined the family vault as ${invitation.role}. Redirecting to dashboard...`
        );

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);

      } catch (error: any) {
        console.error('Error processing invitation:', error);
        setStatus('error');
        
        if (error?.code === 'auth/invalid-action-code') {
          setMessage('This invitation link has expired or is invalid. Please request a new invitation.');
          showError('Invalid Link', 'This invitation link has expired. Please request a new invitation.');
        } else if (error?.code === 'auth/invalid-email') {
          setMessage('Invalid email address. Please check your email and try again.');
          showError('Invalid Email', 'Please check your email address and try again.');
        } else {
          setMessage('Failed to process invitation. Please try again or contact support.');
          showError('Processing Failed', 'Failed to process your invitation. Please try again.');
        }
      } finally {
        setProcessing(false);
      }
    };

    // Only process if user is not already authenticated or if we're handling an email link
    if (!currentUser || isSignInWithEmailLink(auth, window.location.href)) {
      processInvitation();
    } else {
      // User is already signed in and this isn't an email link
      setStatus('invalid');
      setMessage('You are already signed in. Invalid invitation link.');
      setProcessing(false);
    }
  }, [currentUser, navigate, showSuccess, showError, showInfo]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <div className="w-12 h-12 border-4 border-[#e9883e] border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-400" />;
      case 'error':
      case 'invalid':
        return <AlertCircle className="w-12 h-12 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-[#e9883e]';
      case 'success':
        return 'text-green-400';
      case 'error':
      case 'invalid':
        return 'text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#181411] text-white flex items-center justify-center px-4">
      <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-lg border border-[rgba(83,70,60,0.7)] rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Star className="w-8 h-8 text-[#e9883e]" />
          <h1 className="text-2xl font-bold font-serif">Legacy</h1>
        </div>

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>

        {/* Status Message */}
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-2 ${getStatusColor()}`}>
            {status === 'processing' && 'Processing Invitation'}
            {status === 'success' && 'Welcome to the Family!'}
            {status === 'error' && 'Invitation Error'}
            {status === 'invalid' && 'Invalid Invitation'}
          </h2>
          <p className="text-[#b8a99d] text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Additional Actions */}
        {status === 'error' || status === 'invalid' ? (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#e9883e] text-[#181411] font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Back to Home
            </button>
          </div>
        ) : status === 'success' ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <div className="flex items-center gap-3 justify-center">
              <Mail className="w-5 h-5 text-green-400" />
              <p className="text-green-200 text-sm">
                Redirecting to your family vault...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
            <div className="flex items-center gap-3 justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
              <p className="text-blue-200 text-sm">
                Securely processing with Firebase...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite;