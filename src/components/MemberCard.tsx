import React from 'react';
import { VaultMember } from '../types';

interface MemberCardProps {
  member: VaultMember;
  onRoleChange?: (memberId: string, newRole: 'owner' | 'editor' | 'viewer') => void;
  canEditRoles?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onRoleChange, canEditRoles = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-[#e9883e] border-[#e9883e]';
      case 'editor':
        return 'text-blue-400 border-blue-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-sm border border-[#382f29] rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div className="relative">
          {member.avatar && member.avatar !== '/api/placeholder/64/64' ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#e9883e] object-cover"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#e9883e] bg-[#e9883e] flex items-center justify-center text-[#181411] font-bold text-sm sm:text-lg">
              {getInitials(member.name)}
            </div>
          )}
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#181411] ${getStatusColor(member.status)}`}></span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-white truncate">{member.name}</h3>
          <p className="text-xs sm:text-sm text-[#b8a99d] truncate">{member.email}</p>
          <div className="flex items-center mt-1">
            <p className="text-xs text-[#b8a99d] capitalize">{member.status}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-[#b8a99d] mb-1">Role</label>
        {canEditRoles ? (
          <select
            value={member.role}
            onChange={(e) => onRoleChange?.(member.id, e.target.value as 'owner' | 'editor' | 'viewer')}
            className="w-full bg-[#2c2520] border border-[#382f29] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e9883e] focus:ring-1 focus:ring-[#e9883e]"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="owner">Owner</option>
          </select>
        ) : (
          <span className={`inline-block px-3 py-1 border rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
            {member.role}
          </span>
        )}
      </div>

      <button className="w-full text-center text-sm font-medium py-2 rounded-lg border border-[#e9883e] text-[#e9883e] hover:bg-[#e9883e] hover:text-[#181411] transition-colors">
        {member.status === 'pending' ? 'Resend Invite' : 'Manage Access'}
      </button>
    </div>
  );
};

export default MemberCard;