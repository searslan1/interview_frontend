"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, Users, CheckCircle, XCircle, TrendingUp } from "lucide-react"

export function OverviewStats() {
  // Bu veriler normalde bir API'den gelecektir
  const stats = {
    totalApplications: 1234,
    approvedCandidates: 89,
    rejectedCandidates: 45,
    applicationTrend: 12.5, // Yüzde olarak
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Başvuru</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalApplications}</div>
          <p className="text-xs text-muted-foreground">Son 30 gün</p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Onaylanan Adaylar</CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{stats.approvedCandidates}</div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Reddedilen Adaylar</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.rejectedCandidates}</div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Başvuru Trendi</CardTitle>
          <TrendingUp className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">
            {stats.applicationTrend > 0 ? "+" : ""}
            {stats.applicationTrend}%
          </div>
          <p className="text-xs text-muted-foreground">Son 7 gün</p>
          {stats.applicationTrend > 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-success inline-block ml-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-destructive inline-block ml-1" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

