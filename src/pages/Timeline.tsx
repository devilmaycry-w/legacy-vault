import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Memory } from '../types';
import { getMemories } from '../services/firestore';
import { Play, FileText, Music, Image, Calendar, User } from 'lucide-react';

interface TimelineSection {
  year: number;
  memories: Memory[];
}

const Timeline: React.FC = () => {
  const { currentUser } = useAuth();
  const [timelineSections, setTimelineSections] = useState<TimelineSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimelineMemories = async () => {
      try {
        setLoading(true);
        
        if (!currentUser) {
          console.error('No authenticated user found');
          return;
        }

        // Get real memories from Firestore
        const memories = await getMemories(currentUser);
        
        if (memories.length === 0) {
          setTimelineSections([]);
          return;
        }

        // Group memories by year
        const grouped = memories.reduce((acc, memory) => {
          const year = memory.createdAt.getFullYear();
          
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(memory);
          return acc;
        }, {} as Record<number, Memory[]>);

        const sections: TimelineSection[] = Object.entries(grouped)
          .map(([year, memories]) => ({
            year: parseInt(year),
            memories: memories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          }))
          .sort((a, b) => b.year - a.year); // Most recent first

        setTimelineSections(sections);
      } catch (error) {
        console.error('Error loading timeline memories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimelineMemories();
  }, [currentUser]);

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      default:
        return <Image className="w-5 h-5" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181411] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#e9883e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#b8a99d]">Loading your family timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181411] text-white relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-[#181411] pointer-events-none" />
      
      <div className="relative z-10 px-4 sm:px-6 md:px-10 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-2">Beyond Time, Beyond Limits</h1>
          <p className="text-[#b8a99d] text-base sm:text-lg">Journey through our shared memories</p>
        </div>

        {timelineSections.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-[#e9883e] mx-auto mb-4 opacity-50" />
            <p className="text-[#b8a99d] mb-6 text-lg">No memories in your timeline yet.</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-[#e9883e] text-[#181411] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Add Your First Memory
            </Link>
          </div>
        ) : (
          /* Timeline Container */
          <div className="relative max-w-6xl mx-auto">
            {/* Cosmic Timeline Spine */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-[#e9883e] to-transparent hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/30 via-blue-500/30 to-purple-500/30 blur-sm animate-pulse" />
              <div className="absolute inset-0 bg-[#e9883e] shadow-[0_0_20px_#e9883e,0_0_40px_#e9883e,0_0_60px_#e9883e] animate-pulse" />
            </div>

            {/* Mobile Timeline Spine */}
            <div className="absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-[#e9883e] to-transparent md:hidden">
              <div className="absolute inset-0 bg-[#e9883e] shadow-[0_0_10px_#e9883e,0_0_20px_#e9883e] animate-pulse" />
            </div>

            <div className="space-y-16 sm:space-y-20">
              {timelineSections.map((section, sectionIndex) => (
                <section key={section.year} className="relative">
                  {/* Year Badge */}
                  <div className="flex justify-center mb-12 relative z-20">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg border border-purple-400/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-md opacity-50 animate-pulse" />
                      <span className="relative text-lg sm:text-xl font-bold">{section.year}</span>
                    </div>
                  </div>

                  {/* Memories */}
                  <div className="space-y-12 md:space-y-16">
                    {section.memories.map((memory, memoryIndex) => {
                      const isLeft = memoryIndex % 2 === 0;
                      
                      return (
                        <div
                          key={memory.id}
                          className={`
                            relative
                            ${isLeft 
                              ? 'md:pr-8 md:text-right md:flex md:justify-end' 
                              : 'md:pl-8 md:text-left md:flex md:justify-start'
                            }
                            pl-16 md:pl-0
                          `}
                        >
                          {/* Timeline Dot */}
                          <div className={`
                            absolute w-4 h-4 bg-[#e9883e] rounded-full border-4 border-[#181411] z-20
                            ${isLeft 
                              ? 'left-6 md:left-auto md:right-0 md:transform md:translate-x-1/2' 
                              : 'left-6 md:left-0 md:transform md:-translate-x-1/2'
                            }
                            top-8
                          `}>
                            <div className="absolute inset-0 bg-[#e9883e] rounded-full animate-ping opacity-75" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-sm opacity-60" />
                          </div>

                          {/* Memory Card */}
                          <Link
                            to={`/memory/${memory.id}`}
                            className={`
                              block w-full max-w-md bg-gradient-to-br from-gray-900/80 to-gray-800/80 
                              backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-xl 
                              transition-all duration-300 hover:scale-105 group relative z-10
                              hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(233,136,62,0.3)]
                              hover:border-[#e9883e]/50
                            `}
                          >
                            {/* Cosmic Glow Effect on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Date Badge */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2 text-[#e9883e] text-sm font-medium">
                                <Calendar className="w-4 h-4" />
                                {formatDate(memory.createdAt)}
                              </div>
                              <div className="flex items-center gap-1 text-[#b8a99d] text-xs">
                                {getMediaIcon(memory.mediaType)}
                                <span className="capitalize">{memory.mediaType}</span>
                              </div>
                            </div>

                            {/* Memory Preview */}
                            <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden mb-4 relative">
                              {memory.mediaType === 'photo' && memory.mediaUrl ? (
                                <img
                                  src={memory.mediaUrl}
                                  alt={memory.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.classList.add('bg-gradient-to-br', 'from-[#382f29]', 'to-[#181411]', 'flex', 'items-center', 'justify-center');
                                      const iconContainer = document.createElement('div');
                                      iconContainer.className = 'text-white text-2xl';
                                      iconContainer.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                      parent.appendChild(iconContainer);
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#382f29] to-[#181411] flex items-center justify-center">
                                  <div className="text-white text-2xl">
                                    {getMediaIcon(memory.mediaType)}
                                  </div>
                                </div>
                              )}
                              
                              {/* Overlay for non-photo types */}
                              {memory.mediaType !== 'photo' && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="text-white text-2xl">
                                    {getMediaIcon(memory.mediaType)}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Memory Details */}
                            <div className="relative z-10">
                              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#e9883e] transition-colors">
                                {memory.title}
                              </h3>
                              {memory.description && (
                                <p className="text-[#b8a99d] text-sm mb-3 line-clamp-2">
                                  {memory.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between text-xs text-[#b8a99d]">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{memory.uploaderName}</span>
                                </div>
                                <span>{formatFullDate(memory.createdAt)}</span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-[#382f29] mt-16">
        <p className="text-sm text-[#b8a99d]">© 2024 Legacy. Every moment tells a story.</p>
      </footer>
    </div>
  );
};

export default Timeline;
