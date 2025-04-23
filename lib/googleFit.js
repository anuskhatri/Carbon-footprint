import { clerkClient } from "@clerk/nextjs/server"
import { activityTypeMap } from "./googleFitMap"
import { google } from "googleapis"

export const fetchGoogleFitData = async (userId) => {
  // Fetch OAuth token for Google Fit access
  const client = await clerkClient()
  const tokens = await client.users.getUserOauthAccessToken(userId, 'google')
  const accessToken = tokens.data[0].token

  const authClient = new google.auth.OAuth2()
  authClient.setCredentials({ access_token: accessToken })

  const fitness = google.fitness({ version: 'v1', auth: authClient })
  
  const endTime = Date.now() * 1_000_000
  const startTime = endTime - 24 * 60 * 60 * 1000 * 1_000_000
  const datasetId = `${startTime}-${endTime}`

  const sources = {
    steps: 'derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas',
    distance: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
    calories: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
    activities: 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments'
  }

  const fetchDataset = async (dataSourceId) => {
    const result = await fitness.users.dataSources.datasets.get({
      userId: 'me',
      dataSourceId,
      datasetId
    })
    
    return result.data.point || []
  }

  const [stepPoints, distancePoints, caloriePoints, activityPoints] = await Promise.all([
    fetchDataset(sources.steps),
    fetchDataset(sources.distance),
    fetchDataset(sources.calories),
    fetchDataset(sources.activities)
  ])
  
  return {
    steps: stepPoints.map((p) => ({
      startTime: p.startTimeNanos,
      endTime: p.endTimeNanos,
      steps: p.value?.[0]?.intVal || 0
    })),
    distance: distancePoints.map((p) => ({
      startTime: p.startTimeNanos,
      endTime: p.endTimeNanos,
      meters: p.value?.[0]?.fpVal || 0
    })),
    calories: caloriePoints.map((p) => ({
      startTime: p.startTimeNanos,
      endTime: p.endTimeNanos,
      kcal: p.value?.[0]?.fpVal || 0
    })),
    activities: activityPoints.map((p) => {
      // Log the structure to understand the data better
      const activityType = activityTypeMap[p.value?.[0]?.intVal || 4] || 'Unknown';
      return {
        startTime: p.startTimeNanos,
        endTime: p.endTimeNanos,
        activityType
      };
    })    
  }
}
