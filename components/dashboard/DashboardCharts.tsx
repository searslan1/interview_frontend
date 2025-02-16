"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboardStore } from "@/store/dashboardStore";

export function DashboardCharts() {
  const {
    applicationTrends,
    departmentApplications,
    candidateProfiles,
    fetchDashboardData,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* 📊 Başvuru Trendleri Grafiği */}
      <Card>
        <CardHeader>
          <CardTitle>Başvuru Trendleri</CardTitle>
        </CardHeader>
        <CardContent>
          {applicationTrends.length === 0 ? (
            <p className="text-center text-muted-foreground">Veri bulunmamaktadır.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 📊 Departman Bazlı Başvuru Grafiği */}
      <Card>
        <CardHeader>
          <CardTitle>Departmanlara Göre Başvurular</CardTitle>
        </CardHeader>
        <CardContent>
          {departmentApplications.length === 0 ? (
            <p className="text-center text-muted-foreground">Veri bulunmamaktadır.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentApplications}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {departmentApplications.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 📊 Aday Profilleri Grafiği */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Aday Profilleri</CardTitle>
        </CardHeader>
        <CardContent>
          {candidateProfiles.length === 0 ? (
            <p className="text-center text-muted-foreground">Veri bulunmamaktadır.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={candidateProfiles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="experience" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
