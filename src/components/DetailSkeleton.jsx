// src/components/DetailSkeleton.jsx
// 详情页骨架屏

const DetailSkeleton = () => {
  return (
    <div className="space-y-4 mb-6">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex flex-col animate-pulse"
        >
          <div className="flex items-center mb-2">
            <span
              className={`font-extrabold text-2xl mr-4 w-8 text-center ${
                index < 3 ? "text-red-500" : "text-gray-400"
              } bg-gray-300 dark:bg-gray-600 h-8 w-8 rounded-full`}
            ></span>
            <div className="flex-grow h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <span className="ml-4 text-lg text-gray-400 dark:text-gray-600 bg-gray-300 dark:bg-gray-600 h-6 w-16 rounded"></span>
          </div>
          <div className="text-gray-400 dark:text-gray-600 text-base ml-12 mt-2 h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default DetailSkeleton;
