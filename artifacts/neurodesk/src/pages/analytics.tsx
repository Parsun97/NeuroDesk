import { DashboardLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useGetDashboardStats, useListChatbots } from "@workspace/api-client-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import { Bot, MessageSquare, Activity, TrendingUp } from "lucide-react";

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#22c55e"];

const MOCK_WEEKLY = [
  { day: "Mon", messages: 42 }, { day: "Tue", messages: 65 }, { day: "Wed", messages: 38 },
  { day: "Thu", messages: 91 }, { day: "Fri", messages: 74 }, { day: "Sat", messages: 28 }, { day: "Sun", messages: 19 },
];

const MOCK_MONTHLY = [
  { month: "Jan", conversations: 28 }, { month: "Feb", conversations: 45 }, { month: "Mar", conversations: 62 },
  { month: "Apr", conversations: 38 }, { month: "May", conversations: 84 }, { month: "Jun", conversations: 93 },
];

const tooltipStyle = {
  backgroundColor: "#13131a",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "12px",
};

export default function Analytics() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: chatbots } = useListChatbots();

  const pieData = (chatbots as any[])?.slice(0, 5).map((b, i) => ({
    name: b.name,
    value: b.totalMessages ?? 0,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })) ?? [];

  return (
    <DashboardLayout>
      <SEO title="Analytics — NeuroDesk AI" description="Track your AI agent performance metrics." />

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Performance metrics across all your agents.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Agents", value: (stats as any)?.totalChatbots ?? 0, icon: Bot, color: "text-indigo-400" },
          { label: "Active Agents", value: (stats as any)?.activeChatbots ?? 0, icon: Activity, color: "text-green-400" },
          { label: "Conversations", value: (stats as any)?.totalConversations ?? 0, icon: MessageSquare, color: "text-violet-400" },
          { label: "Total Messages", value: (stats as any)?.totalMessages ?? 0, icon: TrendingUp, color: "text-orange-400" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-xl border border-white/8 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold">{isLoading ? "—" : s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Messages this week */}
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.02]">
          <h3 className="font-semibold mb-4">Messages This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_WEEKLY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
              <Bar dataKey="messages" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversations trend */}
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.02]">
          <h3 className="font-semibold mb-4">Conversation Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK_MONTHLY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="conversations" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Messages by bot */}
      {pieData.length > 0 && (
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.02]">
          <h3 className="font-semibold mb-4">Messages by Agent</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 min-w-40">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.fill }} />
                  <span className="text-muted-foreground truncate">{d.name}</span>
                  <span className="ml-auto font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {pieData.length === 0 && (
        <div className="text-center py-16 border border-white/8 rounded-xl text-muted-foreground">
          <Activity className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No agent data yet. Create and deploy agents to see analytics here.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
