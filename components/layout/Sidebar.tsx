"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCheck,
  MessageSquare,
  Bell,
  BookOpen,
  Target,
  LogOut,
  User,
  Moon,
  Sun,
  Archive,
} from "lucide-react";
import { SettingsDialog } from "@/components/settings-dialog";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Mülakatlar",
    href: "/interviews",
    icon: Calendar,
    subItems: [
      { title: "Tüm Mülakatlar", href: "/interviews", icon: Calendar },
      { title: "Takvim Görünümü", href: "/interviews/calendar", icon: Calendar },
    ],
  },
  {
    title: "Başvurular",
    href: "/applications",
    icon: FileText,
    badge: "12",
    subItems: [
      { title: "Tüm Başvurular", href: "/applications", icon: FileText },
      { title: "Bekleyen Başvurular", href: "/applications/pending", icon: FileText },
      { title: "Değerlendirilen", href: "/applications/reviewed", icon: FileText },
      { title: "Arşiv", href: "/applications/archived", icon: FileText },
    ],
  },
  {
    title: "Adaylar",
    href: "/candidates",
    icon: Users,
    subItems: [
      { title: "Tüm Adaylar", href: "/candidates", icon: Users },
      { title: "Favoriler", href: "/candidates/favorites", icon: UserCheck },
      { title: "Kara Liste", href: "/candidates/blacklist", icon: Users },
    ],
  },
  {
    title: "Raporlar",
    href: "/reports",
    icon: BarChart3,
    subItems: [
      { title: "Performans Raporu", href: "/reports/performance", icon: BarChart3 },
      { title: "AI Analiz Raporu", href: "/reports/ai-analysis", icon: BarChart3 },
      { title: "İstatistikler", href: "/reports/statistics", icon: BarChart3 },
    ],
  },
  {
    title: "Bildirimler",
    href: "/notifications",
    icon: Bell,
    badge: "3",
  },
  {
    title: "Mesajlar",
    href: "/messages",
    icon: MessageSquare,
    badge: "5",
  },
  {
    title: "Kaynak Merkezi",
    href: "/resources",
    icon: BookOpen,
  },
  {
    title: "Hedefler",
    href: "/goals",
    icon: Target,
  },
  {
    title: "Organizasyon",
    href: "/organization",
    icon: Building2,
    subItems: [
      { title: "Departmanlar", href: "/organization/departments", icon: Building2 },
      { title: "Pozisyonlar", href: "/organization/positions", icon: Building2 },
      { title: "Kullanıcılar", href: "/organization/users", icon: Users },
    ],
  },

];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
  

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const hasActiveSubItem = (subItems?: NavItem[]) => {
    return subItems?.some(subItem => isActive(subItem.href));
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "flex flex-col h-screen glass-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-gradient">HRAI</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isItemActive = isActive(item.href);
              const isExpanded = expandedItems.includes(item.href);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const hasActiveSubItems = hasActiveSubItem(item.subItems);

              return (
                <div key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "relative rounded-xl",
                        (isItemActive || hasActiveSubItems) && "nav-item-active"
                      )}>
                        {/* Active Indicator */}
                        <div className="nav-indicator" />
                        
                        {hasSubItems ? (
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-3 px-3 py-2.5 h-11 rounded-xl transition-all",
                              collapsed && "px-2 justify-center",
                              (isItemActive || hasActiveSubItems) 
                                ? "bg-primary/10 text-primary hover:bg-primary/15" 
                                : "hover:bg-muted/50"
                            )}
                            onClick={() => toggleExpanded(item.href)}
                          >
                            <item.icon className={cn(
                              "h-5 w-5 shrink-0 transition-colors",
                              (isItemActive || hasActiveSubItems) && "text-primary"
                            )} />
                            {!collapsed && (
                              <>
                                <span className="flex-1 text-left font-medium">{item.title}</span>
                                {item.badge && (
                                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                                    {item.badge}
                                  </span>
                                )}
                                <ChevronRight 
                                  className={cn(
                                    "h-4 w-4 shrink-0 transition-transform text-muted-foreground",
                                    isExpanded && "rotate-90"
                                  )} 
                                />
                              </>
                            )}
                          </Button>
                        ) : (
                          <Link href={item.href}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-3 px-3 py-2.5 h-11 rounded-xl transition-all",
                                collapsed && "px-2 justify-center",
                                isItemActive 
                                  ? "bg-primary/10 text-primary hover:bg-primary/15" 
                                  : "hover:bg-muted/50"
                              )}
                            >
                              <item.icon className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                isItemActive && "text-primary"
                              )} />
                              {!collapsed && (
                                <>
                                  <span className="flex-1 text-left font-medium">{item.title}</span>
                                  {item.badge && (
                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                </>
                              )}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="glass-card">
                        <p className="font-medium">{item.title}</p>
                        {item.badge && <p className="text-xs text-muted-foreground">({item.badge} yeni)</p>}
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {/* Sub Items */}
                  {hasSubItems && isExpanded && !collapsed && (
                    <div className="ml-4 pl-4 mt-1 space-y-1 border-l border-border/50">
                      {item.subItems?.map((subItem) => (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start gap-2 px-3 py-1.5 h-9 rounded-lg",
                              isActive(subItem.href) 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <div className={cn(
                              "h-1.5 w-1.5 rounded-full transition-colors",
                              isActive(subItem.href) ? "bg-primary" : "bg-muted-foreground/50"
                            )} />
                            <span className="text-sm">{subItem.title}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {/* Footer */}
        <div className="border-t border-border/50 mt-auto">
          {/* User Profile with Dropdown */}
          <div className="p-3">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full h-auto p-2 hover:bg-primary/10 rounded-xl">
                        <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                          <AvatarImage src={user?.profilePicture || ""} alt={user?.name || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs font-medium">
                            {user?.name ? getInitials(user.name) : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right" className="w-56 glass-card">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.name || "İsimsiz Kullanıcı"}</p>
                          <p className="text-xs text-muted-foreground">{user?.email || "E-posta yok"}</p>
                          {user?.role && (
                            <Badge variant="secondary" className="text-xs w-fit bg-primary/10 text-primary">
                              {user.role}
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Ayarlar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                        {theme === "dark" ? (
                          <Sun className="mr-2 h-4 w-4" />
                        ) : (
                          <Moon className="mr-2 h-4 w-4" />
                        )}
                        <span>{theme === "dark" ? "Açık Tema" : "Koyu Tema"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Çıkış Yap</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent side="right" className="glass-card">
                  <div className="text-sm">
                    <p className="font-medium">{user?.name || "İsimsiz Kullanıcı"}</p>
                    <p className="text-muted-foreground">Menü için tıklayın</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full h-auto p-3 hover:bg-primary/10 rounded-xl transition-all">
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarImage src={user?.profilePicture || ""} alt={user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-medium">
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-sm truncate">{user?.name || "İsimsiz Kullanıcı"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.role || "HR Manager"}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-64 glass-card">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src={user?.profilePicture || ""} alt={user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user?.name || "İsimsiz Kullanıcı"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || "E-posta yok"}</p>
                        {user?.role && (
                          <Badge variant="secondary" className="text-xs mt-1 bg-primary/10 text-primary">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Ayarlar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    <span>{theme === "dark" ? "Açık Tema" : "Koyu Tema"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </TooltipProvider>
  );
}