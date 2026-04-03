import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, logout } from "@/lib/auth";
import { getUsers, getUserById, type UserRecord } from "@/lib/data";
import AdminSidebar, { type AdminPage } from "@/components/admin/AdminSidebar";
import OverviewPage from "@/components/admin/OverviewPage";
import UserListPage from "@/components/admin/UserListPage";
import UserOverviewPage from "@/components/admin/UserOverviewPage";
import CaseDetailsPage from "@/components/admin/CaseDetailsPage";
import ActiveCasesPage from "@/components/admin/ActiveCasesPage";
import RecentActivityPage from "@/components/admin/RecentActivityPage";
import ContentManagerPage from "@/components/admin/ContentManagerPage";
import UserFormModal from "@/components/admin/UserFormModal";
import { Menu, X } from "lucide-react";

type ViewState =
  | { level: "page"; page: AdminPage }
  | { level: "user-overview"; userId: string; from: AdminPage }
  | { level: "case-details"; userId: string; from: AdminPage };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [view, setView] = useState<ViewState>({ level: "page", page: "overview" });
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth.role !== "admin") { navigate("/login"); return; }
    refresh().then(() => setLoading(false));
  }, [navigate]);

  const refresh = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const handleNavigate = (page: AdminPage) => {
    setView({ level: "page", page });
    setSidebarOpen(false);
  };

  const handleViewUser = (user: UserRecord, from?: AdminPage) => {
    setView({ level: "user-overview", userId: user.id, from: from || currentPage() });
  };

  const handleViewCase = (userId: string, from?: AdminPage) => {
    setView({ level: "case-details", userId, from: from || currentPage() });
  };

  const currentPage = (): AdminPage => {
    if (view.level === "page") return view.page;
    return view.from;
  };

  const getUser = (id: string) => users.find(u => u.id === id);

  // Reload user data when navigating to user views
  const getRefreshedUser = async (id: string): Promise<UserRecord | undefined> => {
    const fresh = await getUserById(id);
    if (fresh) {
      setUsers(prev => prev.map(u => u.id === id ? fresh : u));
    }
    return fresh;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    if (view.level === "user-overview") {
      const user = getUser(view.userId);
      if (!user) return null;
      return (
        <UserOverviewPage
          user={user}
          onBack={() => setView({ level: "page", page: view.from })}
          onViewCase={() => setView({ level: "case-details", userId: view.userId, from: view.from })}
        />
      );
    }

    if (view.level === "case-details") {
      const user = getUser(view.userId);
      if (!user) return null;
      return (
        <CaseDetailsPage
          user={user}
          onBackToUsers={() => setView({ level: "page", page: view.from })}
          onBackToUser={() => setView({ level: "user-overview", userId: view.userId, from: view.from })}
          onRefresh={async () => {
            await getRefreshedUser(view.userId);
            await refresh();
          }}
        />
      );
    }

    switch (view.page) {
      case "overview":
        return <OverviewPage users={users} onNavigate={handleNavigate} />;
      case "users":
        return (
          <UserListPage
            users={users}
            onRefresh={refresh}
            onViewUser={(u) => handleViewUser(u, "users")}
            onEditUser={(u) => { setEditingUser(u); setShowForm(true); }}
          />
        );
      case "active-cases":
        return <ActiveCasesPage users={users} onViewUser={(u) => handleViewUser(u, "active-cases")} />;
      case "activity":
        return <RecentActivityPage onViewUser={(u) => handleViewUser(u, "activity")} />;
      case "content":
        return <ContentManagerPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 hover:bg-muted rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <img src="/images/logo.png" alt="Pet Planet" className="h-8 w-8" />
            <span className="font-heading font-bold gradient-text">Admin Dashboard</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="hidden lg:block">
          <AdminSidebar current={currentPage()} onNavigate={handleNavigate} onLogout={handleLogout} />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div className="absolute inset-0 bg-foreground/30" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-10 w-64">
              <AdminSidebar current={currentPage()} onNavigate={handleNavigate} onLogout={handleLogout} />
            </div>
          </div>
        )}

        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
      </div>

      {showForm && (
        <UserFormModal
          user={editingUser}
          onClose={() => { setShowForm(false); setEditingUser(null); }}
          onSave={async () => { await refresh(); setShowForm(false); setEditingUser(null); }}
        />
      )}
    </div>
  );
}
