'use client'

import { useGoogleFitData } from '@/lib/hooks/useGoogleFit'
import { useState, useEffect } from 'react'
import { EmissionSummaryCard } from '@/components/EmissionSummaryCard'
import { FitStatsCard } from '@/components/FitStatsCard'
import { Chatbot } from '@/components/Chatbox'

export default function ChatbotPage() {
  const fitData = useGoogleFitData()
  console.log(fitData);
  
  if (!fitData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        Loading...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-4 min-h-screen p-4 bg-gray-100">

      {/* Left – Google Fit Stats */}
      <div className="col-span-12 md:col-span-3">
        <FitStatsCard
          steps={fitData.totalSteps}
          calories={fitData.calories || 0}
          carbonSaved={fitData.carbonSaved}
          insights={fitData.insight}
        />
      </div>

      {/* Center – Chatbot */}
      <div className="col-span-12 md:col-span-6 flex flex-col justify-between rounded-xl shadow-lg p-4 bg-white border">
        <Chatbot initialInsight={fitData.insight} />
      </div>

      {/* Right – Emission Summary (Static/Mock) */}
      <div className="col-span-12 md:col-span-3">
        <EmissionSummaryCard
          data={{
            totalEmission: 2.4,
            travelEmission: 1.2,
            energyEmission: 0.8,
            foodEmission: 0.4
          }}
        />
      </div>
    </div>
  )
}
