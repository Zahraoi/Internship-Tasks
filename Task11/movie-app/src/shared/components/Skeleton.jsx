import React from 'react'

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseStyles = 'shimmer rounded'
  
  const variants = {
    rect: '',
    circle: 'rounded-full',
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    thumbnail: 'aspect-[2/3] rounded-lg',
    card: 'aspect-[2/3] rounded-lg',
  }

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} />
  )
}

export const MovieCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <Skeleton variant="card" className="w-full" />
      <div className="mt-2 space-y-2">
        <Skeleton variant="title" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  )
}

export const MovieDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative h-[500px]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="max-w-7xl mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton variant="thumbnail" className="w-64 h-96 flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton variant="title" className="w-3/4 h-12" />
            <Skeleton variant="text" className="w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" className="w-full" />
              <Skeleton variant="text" className="w-full" />
              <Skeleton variant="text" className="w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const GridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default Skeleton
