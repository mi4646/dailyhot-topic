// src/components/SkeletonLoader.jsx
// 骨架屏加载器

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full animate-pulse"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
              <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="h-5 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>

          <div className="space-y-3">
            {[...Array(5)].map((__, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 ${
                    i < 3 ? "bg-red-300" : "bg-gray-300"
                  } dark:bg-gray-600 rounded-full flex-shrink-0`}
                ></div>
                <div className="flex-grow h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-6 w-16 bg-blue-300 dark:bg-blue-700 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
