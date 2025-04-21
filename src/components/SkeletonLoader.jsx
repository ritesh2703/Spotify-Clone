const SkeletonLoader = () => {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="bg-spotify-gray rounded-lg aspect-square"></div>
              <div className="h-4 bg-spotify-gray rounded w-3/4"></div>
              <div className="h-3 bg-spotify-gray rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default SkeletonLoader