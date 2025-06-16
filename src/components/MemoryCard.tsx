import React from 'react';
import { Link } from 'react-router-dom';
import { Memory } from '../types';
import { Play, FileText, Music, Image } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => {
  const getMediaIcon = () => {
    switch (memory.mediaType) {
      case 'video':
        return <Play className="w-8 h-8 text-white" />;
      case 'audio':
        return <Music className="w-8 h-8 text-white" />;
      case 'text':
        return <FileText className="w-8 h-8 text-white" />;
      case 'photo':
        return <Image className="w-8 h-8 text-white" />;
      default:
        return <Image className="w-8 h-8 text-white" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const hasValidMediaUrl = memory.mediaUrl && memory.mediaUrl.trim() !== '';

  return (
    <Link
      to={`/memory/${memory.id}`}
      className="block group"
    >
      <div className="aspect-square bg-gray-700 rounded-xl overflow-hidden relative transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
        {memory.mediaType === 'photo' && hasValidMediaUrl ? (
          <img
            src={memory.mediaUrl}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // Fallback to gradient background if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.classList.add('bg-gradient-to-br', 'from-[#382f29]', 'to-[#181411]');
                const iconContainer = document.createElement('div');
                iconContainer.className = 'absolute inset-0 flex items-center justify-center';
                iconContainer.innerHTML = '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                parent.appendChild(iconContainer);
              }
            }}
          />
        ) : memory.mediaType === 'video' && hasValidMediaUrl ? (
          <div className="relative w-full h-full">
            <img
              src={memory.mediaUrl}
              alt={memory.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback for video thumbnail
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('bg-gradient-to-br', 'from-[#382f29]', 'to-[#181411]');
                }
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-80" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#382f29] to-[#181411] flex items-center justify-center">
            {getMediaIcon()}
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
          <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{memory.title}</h3>
            <p className="text-sm text-gray-300">{formatDate(memory.createdAt)}</p>
            {memory.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{memory.description}</p>
            )}
          </div>
        </div>

        {/* Media type indicator */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
          {memory.mediaType === 'video' && <Play className="w-4 h-4 text-white" />}
          {memory.mediaType === 'audio' && <Music className="w-4 h-4 text-white" />}
          {memory.mediaType === 'text' && <FileText className="w-4 h-4 text-white" />}
          {memory.mediaType === 'photo' && <Image className="w-4 h-4 text-white" />}
        </div>
      </div>
    </Link>
  );
};

export default MemoryCard;