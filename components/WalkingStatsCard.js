// components/WalkingStatsCard.tsx
export default function WalkingStatsCard({
    steps,
    carbonSaved,
  }){
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow mt-6">
        <h3 className="text-lg font-semibold text-green-700 mb-2">🌿 Walking Impact Summary</h3>
        <p className="text-gray-700">
          👣 You took <strong>{steps}</strong> steps this week.<br />
          🌍 That helped you avoid <strong>{carbonSaved.toFixed(3)} kg CO₂</strong> from being released!
        </p>
      </div>
    )
  }
  