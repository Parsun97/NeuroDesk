import { useUser, useClerk } from "@clerk/react";
import { DashboardLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { LogOut, User, Shield } from "lucide-react";

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <DashboardLayout>
      <SEO title="Settings — NeuroDesk AI" description="Manage your NeuroDesk account settings." />

      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
        </div>

        <section className="p-5 rounded-xl border border-white/8 bg-white/[0.02] mb-4">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-4 h-4 text-indigo-400" />
            <h2 className="font-semibold">Profile</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Full name</span>
              <span>{user?.fullName || "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Email</span>
              <span>{user?.primaryEmailAddress?.emailAddress || "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">User ID</span>
              <code className="text-xs text-muted-foreground font-mono">{user?.id?.slice(0, 24)}...</code>
            </div>
          </div>
        </section>

        <section className="p-5 rounded-xl border border-white/8 bg-white/[0.02] mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h2 className="font-semibold">Plan</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Free tier</div>
              <div className="text-sm text-muted-foreground">Upgrade to unlock more agents and messages.</div>
            </div>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">Upgrade</Button>
          </div>
        </section>

        <section className="p-5 rounded-xl border border-red-500/20 bg-red-500/[0.03]">
          <div className="flex items-center gap-3 mb-4">
            <LogOut className="w-4 h-4 text-red-400" />
            <h2 className="font-semibold">Session</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Sign out of your NeuroDesk account.</div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
