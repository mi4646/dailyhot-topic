// src/components/DetailSkeleton.jsx
// 详情页骨架屏

const DetailSkeleton = () => {
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

export default DetailSkeleton
