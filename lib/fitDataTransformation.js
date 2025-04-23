// pages/api/fit/utils.ts
export const formatStepsData = (stepsData) => {
    return stepsData.map((p) => ({
      startTime: p.startTimeNanos,
      endTime: p.endTimeNanos,
      steps: p.value?.[0]?.intVal || 0
    }))
  }
  