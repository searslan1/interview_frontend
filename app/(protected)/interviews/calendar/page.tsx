"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useInterviewStore } from "@/store/interviewStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { InterviewStatus } from "@/types/interview";
import { cn } from "@/lib/utils";

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export default function InterviewCalendarPage() {
  const { interviews, loading, fetchInterviews } = useInterviewStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Bu ayın mülakatlarını al
  const currentMonthInterviews = interviews.filter(interview => {
    const interviewDate = new Date(interview.createdAt);
    return interviewDate.getMonth() === currentDate.getMonth() && 
           interviewDate.getFullYear() === currentDate.getFullYear();
  });

  // Takvim günlerini oluştur
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay(); // Pazartesi = 1

    const days = [];
    
    // Önceki ayın günleri
    for (let i = 1; i < startingDay; i++) {
      days.push({ date: new Date(year, month, 1 - (startingDay - i)), isCurrentMonth: false });
    }
    
    // Bu ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Sonraki ayın günleri
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Belirli gündeki mülakatları al
  const getInterviewsForDate = (date) => {
    return interviews.filter(interview => {
      const interviewDate = new Date(interview.createdAt);
      return interviewDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      [InterviewStatus.ACTIVE]: 'bg-green-500',
      [InterviewStatus.PUBLISHED]: 'bg-blue-500',
      [InterviewStatus.COMPLETED]: 'bg-gray-500',
      [InterviewStatus.DRAFT]: 'bg-yellow-500',
      [InterviewStatus.INACTIVE]: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <PageHeader
          title="Takvim"
          description="Mülakatları takvim görünümünde inceleyin"
        />
        <div className="flex-1 p-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Takvim"
        description={`${currentMonthInterviews.length} mülakat - ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
        actions={
          <Button size="sm" asChild>
            <Link href="/interviews/new">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Mülakat
            </Link>
          </Button>
        }
      />

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Bugün
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {interviews.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Henüz mülakat yok"
                description="Yeni mülakatlar oluşturdukça takvimde görünecekler."
              />
            ) : (
              <div className="space-y-4">
                {/* Gün başlıkları */}
                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map(day => (
                    <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Takvim */}
                <div className="grid grid-cols-7 gap-1 min-h-[500px]">
                  {calendarDays.map((day, index) => {
                    const dayInterviews = getInterviewsForDate(day.date);
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[80px] p-2 border rounded-lg",
                          day.isCurrentMonth ? "bg-background" : "bg-muted/50",
                          isToday && "ring-2 ring-primary"
                        )}
                      >
                        <div className="font-medium text-sm mb-1">
                          {day.date.getDate()}
                        </div>
                        
                        {/* Mülakatlar */}
                        <div className="space-y-1">
                          {dayInterviews.slice(0, 2).map(interview => (
                            <Link
                              key={interview._id}
                              href={`/interviews/${interview._id}`}
                              className="block"
                            >
                              <div className="text-xs p-1 rounded bg-blue-100 border border-blue-200 hover:bg-blue-200 transition-colors">
                                <div className="flex items-center gap-1">
                                  <div className={cn("w-2 h-2 rounded-full", getStatusColor(interview.status))} />
                                  <span className="truncate">{interview.title}</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                          
                          {dayInterviews.length > 2 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{dayInterviews.length - 2} daha
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
