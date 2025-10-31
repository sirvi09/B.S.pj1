import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import BlurCircle from './BlurCircle';
import { dummyTrailers } from '../assets/assets';
import { PlayCircleIcon } from 'lucide-react';

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="px-6 md:px-16 lg:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>

      <div className="relative mt-6">
        <BlurCircle top="100px" right="-100px" />

        {!isPlaying ? (
          <div
            className="relative mx-auto max-w-full rounded-xl overflow-hidden cursor-pointer"
            style={{ width: '960px', height: '540px' }}
            onClick={() => setIsPlaying(true)}
          >
            <img
              src={currentTrailer.image}
              alt={currentTrailer.title || 'Trailer thumbnail'}
              className="w-full h-full object-cover rounded-xl"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-16 h-16 md:w-20 md:h-20 text-white transform -translate-x-1/2 -translate-y-1/2 opacity-90 hover:opacity-100"
            />
          </div>
        ) : (
          <ReactPlayer
            url={currentTrailer.videoUrl}
            controls={true}
            playing={true}
            muted={false}
            onPause={() => setIsPlaying(false)} 
            className="mx-auto max-w-full rounded-xl overflow-hidden"
            width="960px"
            height="540px"
          />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mt-8 max-w-5xl mx-auto">
        {dummyTrailers.map((trailer, index) => (
          <div
            key={trailer.id || index}
            onClick={() => {
              setCurrentTrailer(trailer);
              setIsPlaying(false);
            }}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 ${
              currentTrailer.id === trailer.id ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <img
              src={trailer.image}
              alt={trailer.title || 'Trailer thumbnail'}
              className="w-full h-40 object-cover brightness-75 hover:brightness-100 transition-all"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-10 h-10 md:w-12 md:h-12 text-white transform -translate-x-1/2 -translate-y-1/2 opacity-90 hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
