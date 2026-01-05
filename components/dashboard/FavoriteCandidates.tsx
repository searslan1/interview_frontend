"use client"

import { useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Star, Info, Users, ChevronRight } from "lucide-react"
import { useDashboardStore, type FavoriteCandidate } from "@/store/dashboardStore"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

export function FavoriteCandidates() {
  const { favoriteCandidates, fetchDashboardData } = useDashboardStore()

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Son 3 favoriyi al (favoriye eklenme tarihine göre sıralı)
  const recentFavorites = useMemo(() => {
    return [...favoriteCandidates]
      .sort((a, b) => {
        // Eğer addedAt varsa ona göre sırala, yoksa score'a göre
        const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0
        const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0
        return dateB - dateA
      })
      .slice(0, 3)
  }, [favoriteCandidates])

  const hasMoreFavorites = favoriteCandidates.length > 3

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <CardTitle className="text-base">Favori Adaylar</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">
                    Değerlendirme sürecinde beğendiğiniz ve takip etmek istediğiniz adaylar burada listelenir.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            {favoriteCandidates.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {favoriteCandidates.length} aday
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {favoriteCandidates.length === 0 ? (
            /* Boş durum - aksiyon içeren mesaj */
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-3 mb-3">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium mb-1">Henüz favori aday yok</p>
              <p className="text-xs text-muted-foreground mb-4">
                Mülakat değerlendirmelerinde beğendiğiniz adayları favorilere ekleyin.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/candidates">
                  <Users className="h-4 w-4 mr-1.5" />
                  Aday Havuzuna Git
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Son 3 favori aday */}
              {recentFavorites.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/candidates/${candidate.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${candidate.id}`} />
                    <AvatarFallback className="text-xs">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {candidate.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {candidate.position}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {candidate.addedAt 
                        ? formatDistanceToNow(new Date(candidate.addedAt), { addSuffix: true, locale: tr })
                        : `%${candidate.score}`
                      }
                    </p>
                  </div>
                </Link>
              ))}

              {/* Tüm Favorileri Gör linki */}
              <div className="pt-2 border-t">
                <Link
                  href="/candidates?filter=favorite"
                  className="flex items-center justify-center gap-1 text-sm text-primary hover:underline py-2"
                >
                  {hasMoreFavorites ? (
                    <>
                      Tüm Favorileri Gör ({favoriteCandidates.length})
                      <ChevronRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Aday Yönetimine Git
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

