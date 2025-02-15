"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CandidateManagementProps {
  candidate: any
}

export function CandidateManagement({ candidate }: CandidateManagementProps) {
  const [status, setStatus] = useState(candidate.status)
  const [comment, setComment] = useState("")

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // Implement API call to update status
    console.log(`Status updated to: ${newStatus}`)
  }

  const handleCommentSubmit = () => {
    // Implement API call to submit comment
    console.log(`Comment submitted: ${comment}`)
    setComment("")
  }

  const handleRedirect = () => {
    // Implement logic to redirect candidate to other interviews
    console.log("Redirecting candidate to other interviews")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Application Status</h4>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="review">Needs Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Add Comment</h4>
          <Textarea
            placeholder="Enter your comment here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleCommentSubmit}>Submit Comment</Button>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Redirect Candidate</h4>
          <Button onClick={handleRedirect}>Suggest Other Interviews</Button>
        </div>
      </CardContent>
    </Card>
  )
}

