"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Bell, 
  Menu,
  Search,
  Building2,
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/Sidebar"
import { Input } from "@/components/ui/input"
import { useNotificationStore } from "@/store/notification-store"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getUnreadCount } = useNotificationStore()
  const router = useRouter()
  
  const unreadCount = getUnreadCount()

  return (
    <header className="w-full glass-header sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden hover:bg-primary/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 glass-sidebar border-r-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Logo for mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gradient">HRAI</span>
          </div>
        </div>
        
        {/* Center: Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Aday, mülakat veya pozisyon ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/30 border-border/50 focus:bg-background/80 transition-colors rounded-xl"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <Button variant="ghost" size="sm" className="md:hidden hover:bg-primary/10 rounded-xl">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-primary/10 rounded-xl">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass-card">
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="font-semibold">Bildirimler</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{unreadCount} yeni</Badge>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="font-medium text-sm">Yeni mülakat talebi</p>
                  <p className="text-xs text-muted-foreground">Frontend Developer pozisyonu için</p>
                  <p className="text-xs text-muted-foreground">2 dakika önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="font-medium text-sm">AI analiz raporu hazır</p>
                  <p className="text-xs text-muted-foreground">John Doe mülakatı için</p>
                  <p className="text-xs text-muted-foreground">15 dakika önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => router.push('/notifications')}
                >
                  Tümünü Gör
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header