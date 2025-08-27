// src/components/Skeleton.jsx

// 来源卡片骨架屏
const CardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(10)].map((_, idx) => (
        <div key={idx} className="flex items-center space-x-3">
          <span className="inline-block w-6 text-center font-bold text-gray-300 dark:text-gray-600">
            {idx + 1}.
          </span>
          <div className="flex-grow h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="ml-3 w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  )
}

// 详情页骨架屏
const DetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-32 flex-shrink-0">
        <div className="w-full h-48 md:h-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="p-6 flex-grow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
            <div className="ml-12 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="flex space-x-2">
                <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
)

export { CardSkeleton, DetailSkeleton }
