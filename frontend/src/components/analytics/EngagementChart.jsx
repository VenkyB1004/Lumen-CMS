import React, { useState } from 'react';
import { TrendingUp, BarChart2, Eye, Sparkles } from 'lucide-react';

const EngagementChart = ({ data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-stone-400">
        No readership history available.
      </div>
    );
  }

  // Safely extract numeric views for each item
  const parsedData = data.map((d) => {
    const rawViews = d.views ?? d.monthlyViews ?? 0;
    const views = typeof rawViews === 'number' ? rawViews : Number(rawViews) || 0;
    const rawRate = d.engagementRate ?? 0;
    const engagementRate = typeof rawRate === 'number' ? rawRate : parseFloat(rawRate) || 0;
    return {
      ...d,
      views,
      engagementRate,
    };
  });

  const maxViews = Math.max(...parsedData.map((d) => d.views), 100);

  return (
    <div className="space-y-4">
      {/* Header Legend & Interactive Tooltip */}
      <div className="flex items-center justify-between text-xs text-stone-600 min-h-[28px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#1A382B]" />
            <span className="font-medium">Monthly Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium">Engagement Rate (%)</span>
          </div>
        </div>

        {hoveredIndex !== null && parsedData[hoveredIndex] && (
          <div className="bg-stone-900 text-white px-2.5 py-1 rounded-lg text-[11px] font-mono shadow-md">
            {parsedData[hoveredIndex].month}: {parsedData[hoveredIndex].views.toLocaleString()} views • {parsedData[hoveredIndex].engagementRate}% eng.
          </div>
        )}
      </div>

      {/* SVG Bar & Curve Container */}
      <div className="relative h-56 w-full pt-4 pb-8">
        {/* Background Grid Lines */}
        <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-stone-300 w-full" />
          <div className="border-b border-stone-300 w-full" />
          <div className="border-b border-stone-300 w-full" />
        </div>

        {/* Bars Container */}
        <div className="relative h-full flex items-end justify-between gap-2 sm:gap-4 px-3">
          {parsedData.map((item, idx) => {
            // Calculate proportional height, clamped between 8% and 94%
            const rawHeight = (item.views / maxViews) * 100;
            const heightPercent = item.views > 0 
              ? Math.min(94, Math.max(14, Math.round(rawHeight)))
              : 8;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.month || item.key || idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Full-Height Column Slot */}
                <div className="w-full max-w-[42px] h-full flex items-end justify-center relative">
                  {/* Background Track */}
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-stone-50 rounded-t-lg pointer-events-none" />

                  {/* Filled Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg relative z-10 transition-all duration-300 ${
                      isHovered
                        ? 'bg-emerald-700 shadow-md scale-y-105'
                        : 'bg-[#1A382B] group-hover:bg-[#254F3D]'
                    }`}
                  >
                    {/* Engagement Indicator Pip */}
                    <div
                      style={{ bottom: '100%' }}
                      className="absolute left-1/2 -translate-x-1/2 mb-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-xs pointer-events-none z-20"
                      title={`Engagement: ${item.engagementRate}%`}
                    />
                  </div>
                </div>

                {/* X-axis Month Label */}
                <span
                  className={`text-[11px] font-mono mt-2 transition-colors ${
                    isHovered ? 'text-stone-900 font-bold' : 'text-stone-500'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EngagementChart;