import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useListChatbots } from "@workspace/api-client-react";
import { MessageSquare, Bot, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Conversations() {
  const { data: chatbots, isLoading } = useListChatbots();
  const [selectedBot, setSelectedBot] = useState<number | null>(null);

  const filtered = selectedBot
    ? (chatbots as any[])?.filter((b) => b.id === selectedBot)
    : (chatbots as any[]);

  return (
    <DashboardLayout>
      <SEO title="Conversations — NeuroDesk AI" description="View all conversations across your AI agents." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground mt-1">All user conversations across your agents.</p>
        </div>
        <select
          value={selectedBot ?? ""}
          onChange={(e) => setSelectedBot(e.target.value ? Number(e.target.value) : null)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-indigo-500/50"
        >
          <option value="">All agents</option>
          {(chatbots as any[])?.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      ) : !filtered?.length ? (
        <div className="text-center py-24 border border-white/8 rounded-xl text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <h3 className="font-medium text-lg mb-2">No conversations yet</h3>
          <p className="text-sm">Conversations will appear here once users start chatting with your agents.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered?.map((bot: any) => (
            <div key={bot.id} className="p-4 rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/12 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bot.primaryColor + "22" }}>
                  <Bot className="w-4 h-4" style={{ color: bot.primaryColor }} />
                </div>
                <span className="font-medium text-sm">{bot.name}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full border", bot.status === "ready" ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-gray-400 bg-gray-500/10 border-gray-500/20")}>
                  {bot.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" />{bot.totalConversations ?? 0} conversations</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />Last active {new Date(bot.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
