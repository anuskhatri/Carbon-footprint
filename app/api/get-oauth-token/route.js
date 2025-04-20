import { google } from 'googleapis';
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {activityTypeMap} from '@/lib/googleFit'

export async function GET() {
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokens = await client.users.getUserOauthAccessToken(userId, "google");
    const accessToken = tokens.data[0].token;

    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });

    const fitness = google.fitness({ version: 'v1', auth: authClient });

    const endTime = Date.now() * 1_000_000;
    const startTime = endTime - (24 * 60 * 60 * 1000 * 1_000_000);
    const datasetId = `${startTime}-${endTime}`;

    const sources = {
      steps: 'derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas',
      distance: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
      calories: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
      activities: 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments'
    };

    const fetchDataset = async (dataSourceId) => {
      const result = await fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId,
        datasetId
      });
      return result.data.point || [];
    };

    const [stepPoints, distancePoints, caloriePoints, activityPoints] = await Promise.all([
      fetchDataset(sources.steps),
      fetchDataset(sources.distance),
      fetchDataset(sources.calories),
      fetchDataset(sources.activities)
    ]);

    const formatted = {
      steps: stepPoints.map(p => ({
        startTime: p.startTimeNanos,
        endTime: p.endTimeNanos,
        steps: p.value?.[0]?.intVal || 0
      })),
      distance: distancePoints.map(p => ({
        startTime: p.startTimeNanos,
        endTime: p.endTimeNanos,
        meters: p.value?.[0]?.fpVal || 0
      })),
      calories: caloriePoints.map(p => ({
        startTime: p.startTimeNanos,
        endTime: p.endTimeNanos,
        kcal: p.value?.[0]?.fpVal || 0
      })),
      activities: activityPoints.map(p => ({
        startTime: p.startTimeNanos,
        endTime: p.endTimeNanos,
        activityType: activityTypeMap[p.value?.[0]?.intVal || 4] || "Unknown"
      }))
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Google Fit read error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
