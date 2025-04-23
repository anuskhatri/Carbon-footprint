'use client'

import { useEffect, useState } from 'react'

export const useGoogleFitData = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchFitData = async () => {
      try {
        const res = await fetch('/api/chat-bot')
        const result = await res.json()
        
        // Ensure that each step has a valid number of steps and filter out invalid data
        const totalSteps = result.steps
          .filter(s => s.steps !== undefined && !isNaN(s.steps) && s.steps >= 0) // Make sure steps are valid
          .reduce((sum, s) => sum + s.steps, 0)

        // Get activities with valid activityType
        const activities = result.steps.filter(s => s.activityType !== undefined)

        setData({
          totalSteps,
          activities,
          carbonSaved: result.ollamaResponse?.carbonSaved || 0,
          insight: result.ollamaResponse?.insight || ''
        })
      } catch (err) {
        console.error('Failed to fetch Google Fit data:', err)
        setData(null)
      }
    }

    fetchFitData()
  }, [])
  
  return data
}
