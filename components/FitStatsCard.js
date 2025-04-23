import { Card, CardContent } from "@/components/ui/card"

export const FitStatsCard = ({
  steps,
  calories,
  carbonSaved,
  insights
}) => (
  <>
    <Card className="p-4">
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Google Fit Summary</h3>
        <p>🚶 Steps: {steps}</p>
        <p>🌱 Carbon Saved: {Number(carbonSaved || 0).toFixed(3)} kg CO₂</p>
      </CardContent>
    </Card>
    <Card className="p-4">
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Personal Summary</h3>
        <p>{insights}</p>
      </CardContent>
    </Card>

  </>

)
