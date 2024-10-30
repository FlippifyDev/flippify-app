import React from "react";



// Utility function to format timestamp into a readable format
const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const dealTime = new Date(timestamp);
    
    const diffMs = now.getTime() - dealTime.getTime(); // Difference in milliseconds
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Difference in days
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Difference in hours
    const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Difference in minutes
    
    // If the deal was found today, display hours/minutes ago
    if (diffDays === 0) {
      if (diffHours > 0) {
        return `Posted ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMinutes > 0) {
        return `Posted ${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
      } else {
        return 'Posted Just Now';
      }
    }
  
    return `Posted ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};


interface NewsCardProps {
  title: string;
  sub_title: string;
  link?: string;
  description: string;
  image: string;
  date: Date;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  sub_title,
  link,
  description,
  image,
  date,
}) => {
  return (
    <div className="max-w-screen-xl mx-auto sm:px-5 md:px-10 lg:px-16">
      <div className="rounded overflow-hidden flex flex-col max-w-xl mx-auto">
        {link ? (
          <a href={link} className="block">
            <img className="w-full" src={image} alt={title} />
            <div className="relative -mt-16 px-10 pt-5 pb-16 bg-white m-10 shadow-md">
              <p className="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2">
                {title}
              </p>
              <p className="text-gray-500 text-sm">{sub_title}</p>
              <p className="mt-5 text-gray-600 text-xs">{description}</p>
              <div className="absolute bottom-2 right-2 mt-2">
                <p className="text-gray-400 text-xs">{formatTimestamp(date)}</p>
              </div>
            </div>
          </a>
        ) : (
          <div className="block">
            <img className="w-full" src={image} alt={title} />
            <div className="relative -mt-16 px-10 pt-5 pb-16 bg-white m-10 shadow-md">
              <p className="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2">
                {title}
              </p>
              <p className="text-gray-500 text-sm">{sub_title}</p>
              <p className="mt-5 text-gray-600 text-xs">{description}</p>
              <div className="absolute bottom-2 right-2 mt-2">
                <p className="text-gray-400 text-xs">{formatTimestamp(date)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
