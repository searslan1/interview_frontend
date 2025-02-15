  "use client"

  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Progress } from "@/components/ui/progress"

  interface AIGeneralAnalysisProps {
    candidate: any
    currentTime: number
  }

  export function AIGeneralAnalysis({ candidate, currentTime }: AIGeneralAnalysisProps) {
    // Mock AI analysis data
    const aiAnalysis = {
      overallScore: 85,
      personalityType: "INTJ",
      currentMood: "Confident",
      speechConfidence: 80,
      toneSentiment: "Positive",
    }

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>AI General Analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Overall AI Score</h3>
            <Progress value={aiAnalysis.overallScore} className="w-full" />
            <p className="text-center">{aiAnalysis.overallScore}%</p>
          </div>
          <div>
            <h3 className="font-semibold">Personality Type</h3>
            <p>{aiAnalysis.personalityType}</p>
          </div>
          <div>
            <h3 className="font-semibold">Current Mood</h3>
            <p>{aiAnalysis.currentMood}</p>
          </div>
          <div>
            <h3 className="font-semibold">Speech Confidence</h3>
            <Progress value={aiAnalysis.speechConfidence} className="w-full" />
            <p className="text-center">{aiAnalysis.speechConfidence}%</p>
          </div>
          <div>
            <h3 className="font-semibold">Tone Sentiment</h3>
            <p>{aiAnalysis.toneSentiment}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

