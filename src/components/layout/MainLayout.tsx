
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  ChevronDown, 
  TrendingUp,
  History,
  LogOut,
  Link as LinkIcon
} from "lucide-react";

interface SideNavItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
  active?: boolean;
}

function SideNavItem({ icon, title, to, active }: SideNavItemProps) {
  return (
    <Link to={to}>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          active
            ? "bg-primary/10 text-primary"
            : "hover:bg-primary/5 text-muted-foreground"
        }`}
      >
        {icon}
        <span>{title}</span>
      </div>
    </Link>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = window.location.pathname;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AU";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">Auto Trailing Stop-Loss</h1>
          </div>
          <div className="mt-8 flex-1 px-3 space-y-1">
            <SideNavItem
              icon={<LayoutDashboard size={18} />}
              title="Dashboard"
              to="/dashboard"
              active={currentPath === "/dashboard"}
            />
            <SideNavItem
              icon={<LinkIcon size={18} />}
              title="Zerodha Integration"
              to="/zerodha-integration"
              active={currentPath === "/zerodha-integration"}
            />
            <SideNavItem
              icon={<TrendingUp size={18} />}
              title="Active Trades"
              to="/active-trades"
              active={currentPath === "/active-trades"}
            />
            <SideNavItem
              icon={<History size={18} />}
              title="Trade History"
              to="/trade-history"
              active={currentPath === "/trade-history"}
            />
            <SideNavItem
              icon={<Settings size={18} />}
              title="Settings"
              to="/settings"
              active={currentPath === "/settings"}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="flex justify-between items-center px-4 py-3 bg-background border-b border-gray-800">
          <div className="flex items-center gap-2 md:hidden">
            <h1 className="text-lg font-semibold">Auto Trailing Stop-Loss</h1>
          </div>
          <div className="relative">
            <div
              className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-sm hidden sm:block">
                <div className="font-medium">{profile?.username || profile?.full_name || user?.email}</div>
              </div>
              <ChevronDown size={16} />
            </div>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-10">
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Signed in as
                  <div className="font-semibold text-foreground">{user?.email}</div>
                </div>
                <div className="border-t border-gray-700 my-1"></div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 px-4 py-2"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
