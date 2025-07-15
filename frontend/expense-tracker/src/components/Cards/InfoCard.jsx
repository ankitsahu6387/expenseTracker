import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full max-w-full overflow-hidden">
      <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl shrink-0`}>
        {icon}
      </div>
      <div className="text-center sm:text-left overflow-hidden">
        <h6 className="text-sm text-gray-500 mb-1 whitespace-nowrap">{label}</h6>
        <span className="text-[22px] font-medium break-words truncate block max-w-full">
          ${value}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
