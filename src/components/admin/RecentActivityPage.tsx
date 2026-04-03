import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { getActivities, getUserById, type UserRecord, type ActivityLog } from "@/lib/data";

interface Props {
  onViewUser: (user: UserRecord) => void;
}

export default function RecentActivityPage({ onViewUser }: Props) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [userCache, setUserCache] = useState<Record<string, UserRecord>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const acts = await getActivities();
      setActivities(acts);

      // Load users for activities
      const uniqueIds = [...new Set(acts.map(a => a.userId).filter(Boolean))];
      const cache: Record<string, UserRecord> = {};
      await Promise.all(uniqueIds.map(async (id) => {
        const user = await getUserById(id);
        if (user) cache[id] = user;
      }));
      setUserCache(cache);
      setLoading(false);
    };
    load();
  }, []);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-2xl font-bold">Recent Activity</h1>
          <p className="text-muted-foreground text-sm mt-1">Loading...</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold">Recent Activity</h1>
        <p className="text-muted-foreground text-sm mt-1">Latest updates and changes</p>
      </div>

      {activities.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Clock className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="font-heading font-semibold text-lg mb-2">No activity yet</h3>
          <p className="text-muted-foreground text-sm">Activity will appear here as you make changes</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-4">
            {activities.map((a) => {
              const user = userCache[a.userId];
              return (
                <div key={a.id} className="relative pl-16">
                  <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-primary border-4 border-card" />
                  <div className="glass-card p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{a.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{a.details}</p>
                        <p className="text-xs text-muted-foreground mt-2">{formatTime(a.timestamp)}</p>
                      </div>
                      {user && (
                        <button
                          onClick={() => onViewUser(user)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
