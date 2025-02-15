import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AIRecommendationsProps {
  recommendation: string
}

export function AIRecommendations({ recommendation }: AIRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Önerisi</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{recommendation}</p>
      </CardContent>
    </Card>
  )
}

