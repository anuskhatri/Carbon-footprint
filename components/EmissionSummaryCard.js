import { Card, CardContent } from "@/components/ui/card"
import PropTypes from 'prop-types';

export const EmissionSummaryCard = ({
  data
}) => (
  <Card className="p-4">
    <CardContent>
      <h3 className="text-lg font-semibold mb-2">Emission Breakdown</h3>
      <p>Total: <strong>{data.totalEmission.toFixed(2)} kg CO₂</strong></p>
      <p>🚌 Travel: {data.travelEmission.toFixed(2)} kg</p>
      <p>⚡ Energy: {data.energyEmission.toFixed(2)} kg</p>
      <p>🍔 Food: {data.foodEmission.toFixed(2)} kg</p>
    </CardContent>
  </Card>
)