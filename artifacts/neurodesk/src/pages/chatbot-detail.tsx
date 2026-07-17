import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  useGetChatbot, useGetChatbotStats, useGetChatbotEmbedCode,
  useListSources, useListBotConversations, useTrainChatbot,
  useDeleteChatbot, useCreateSource, useDeleteSource,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bot, Zap, Code2, MessageSquare, BarChart3, Settings,
  Globe, FileText, HelpCircle, Plus, Trash2, Copy, Check,
  Briefcase, Smile, TrendingUp, Crown, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: Bot },
  { id: "knowledge", label: "Knowledge", icon: Globe },
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "embed", label: "Embed Code", icon: Code2 },
];

const statusConfig = {
  draft: { label: "Draft", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  training: { label: "Training", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  ready: { label: "Ready", class: "bg-green-500/20 text-green-400 border-green-500/30" },
  error: { label: "Error", class: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const personalityIcons: Record<string, any> = {
  professional: Briefcase,
  friendly: Smile,
  sales: TrendingUp,
  technical: Code2,
  luxury: Crown,
};

export default function ChatbotDetail() {
  const { id } = useParams<{ id: string }>();
  const botId = parseInt(id ?? "0");
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [addingSource, setAddingSource] = useState<"url" | "text" | "faq" | null>(null);
  const [sourceForm, setSourceForm] = useState({ title: "", content: "", url: "" });
  const [showDelete, setShowDelete] = useState(false);

  const queryClient = useQueryClient();

  const { data: bot, isLoading } = useGetChatbot(botId, { query: { enabled: !!botId } });
  const { data: stats } = useGetChatbotStats(botId, { query: { enabled: !!botId } });
  const { data: embedData } = useGetChatbotEmbedCode(botId, { query: { enabled: !!botId && tab === "embed" } });
  const { data: sources, isLoading: sourcesLoading } = useListSources(botId, { query: { enabled: !!botId && tab === "knowledge" } });
  const { data: conversations } = useListBotConversations(botId, { query: { enabled: !!botId && tab === "conversations" } });

  const trainMutation = useTrainChatbot();
  const deleteMutation = useDeleteChatbot();
  const createSourceMutation = useCreateSource();
  const deleteSourceMutation = useDeleteSource();

  const handleTrain = async () => {
    await trainMutation.mutateAsync({ id: botId });
    queryClient.invalidateQueries({ queryKey: [`/api/chatbots/${botId}`] });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: botId });
    queryClient.invalidateQueries({ queryKey: ["/api/chatbots"] });
    setLocation("/chatbots");
  };

  const handleCopyEmbed = () => {
    if (embedData?.snippet) {
      navigator.clipboard.writeText(embedData.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddSource = async () => {
    if (!addingSource) return;
    if (addingSource === "url") {
      if (!sourceForm.url) return;
      await createSourceMutation.mutateAsync({
        id: botId,
        data: { type: "url", title: sourceForm.url, content: sourceForm.url },
      });
    } else {
      if (!sourceForm.title || !sourceForm.content) return;
      await createSourceMutation.mutateAsync({
        id: botId,
        data: { type: addingSource, title: sourceForm.title, content: sourceForm.content },
      });
    }
    queryClient.invalidateQueries({ queryKey: [`/api/chatbots/${botId}/sources`] });
    setSourceForm({ title: "", content: "", url: "" });
    setAddingSource(null);
  };

  const handleDeleteSource = async (sourceId: number) => {
    await deleteSourceMutation.mutateAsync({ id: botId, sourceId });
    queryClient.invalidateQueries({ queryKey: [`/api/chatbots/${botId}/sources`] });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-white/5 rounded-xl w-64" />
          <div className="h-48 bg-white/5 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!bot) {
    return (
      <DashboardLayout>
        <div className="text-center py-24 text-muted-foreground">Agent not found.</div>
      </DashboardLayout>
    );
  }

  const status = statusConfig[(bot as any).status as keyof typeof statusConfig] ?? statusConfig.draft;
  const PersonalityIcon = personalityIcons[(bot as any).personality] ?? Bot;

  return (
    <DashboardLayout>
      <SEO title={`${(bot as any).name} — NeuroDesk AI`} description={`Manage the ${(bot as any).name} AI agent.`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: (bot as any).primaryColor + "22", border: `1px solid ${(bot as any).primaryColor}44` }}>
            <PersonalityIcon className="w-6 h-6" style={{ color: (bot as any).primaryColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{(bot as any).name}</h1>
              <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", status.class)}>{status.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{(bot as any).companyName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTrain}
            disabled={trainMutation.isPending}
            className="border-white/10"
          >
            <Zap className="w-4 h-4 mr-2 text-amber-400" />
            {trainMutation.isPending ? "Training..." : "Retrain"}
          </Button>
          <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => setShowDelete(true)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/[0.03] border border-white/8 rounded-lg p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap", tab === t.id ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Conversations", value: (stats as any)?.totalConversations ?? 0 },
              { label: "Total Messages", value: (stats as any)?.totalMessages ?? 0 },
              { label: "Training Score", value: (bot as any).trainingScore ? `${(bot as any).trainingScore}%` : "—" },
            ].map((s) => (
              <div key={s.label} className="p-5 rounded-xl border border-white/8 bg-white/[0.02]">
                <div className="text-sm text-muted-foreground mb-1">{s.label}</div>
                <div className="text-3xl font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl border border-white/8 bg-white/[0.02] space-y-3">
            <h3 className="font-semibold">Configuration</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Personality</span><br /><span className="capitalize">{(bot as any).personality}</span></div>
              <div><span className="text-muted-foreground">Primary Color</span><br /><span className="flex items-center gap-2 mt-1"><span className="w-4 h-4 rounded-full inline-block" style={{ background: (bot as any).primaryColor }} />{(bot as any).primaryColor}</span></div>
              <div className="col-span-2"><span className="text-muted-foreground">Welcome Message</span><br /><span className="text-foreground/80">"{(bot as any).welcomeMessage}"</span></div>
              {(bot as any).description && <div className="col-span-2"><span className="text-muted-foreground">Description</span><br /><span className="text-foreground/80">{(bot as any).description}</span></div>}
            </div>
          </div>

          {(bot as any).status === "training" && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              Training in progress — your agent is indexing knowledge sources. This usually takes under a minute.
            </div>
          )}
        </motion.div>
      )}

      {/* Tab: Knowledge */}
      {tab === "knowledge" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {sourcesLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : (sources as any[])?.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border border-white/8 rounded-xl">
              <Globe className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No knowledge sources yet. Add some to train your agent.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(sources as any[])?.map((src) => (
                <div key={src.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/8 bg-white/[0.02]">
                  {src.type === "url" ? <Globe className="w-4 h-4 text-blue-400 shrink-0" /> : src.type === "text" ? <FileText className="w-4 h-4 text-green-400 shrink-0" /> : <HelpCircle className="w-4 h-4 text-orange-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{src.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{src.content?.slice(0, 80)}...</div>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border", src.status === "processed" ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20")}>{src.status}</span>
                  <button onClick={() => handleDeleteSource(src.id)} className="text-muted-foreground hover:text-red-400 transition-colors ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!addingSource ? (
            <div className="grid grid-cols-3 gap-3">
              {([["url", Globe, "URL", "text-blue-400"], ["text", FileText, "Text", "text-green-400"], ["faq", HelpCircle, "FAQ", "text-orange-400"]] as const).map(([type, Icon, label, color]) => (
                <button
                  key={type}
                  onClick={() => setAddingSource(type)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all text-sm"
                >
                  <Icon className={cn("w-5 h-5", color)} />
                  <span className="font-medium">Add {label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">Add {addingSource === "url" ? "URL" : addingSource === "faq" ? "FAQ" : "Text"}</span>
                <button onClick={() => { setAddingSource(null); setSourceForm({ title: "", content: "", url: "" }); }} className="text-muted-foreground hover:text-foreground text-xs">Cancel</button>
              </div>

              {addingSource === "url" ? (
                <>
                  <p className="text-xs text-muted-foreground">Paste the URL of a page you want the bot to learn from.</p>
                  <Input
                    placeholder="https://yoursite.com/about"
                    value={sourceForm.url}
                    onChange={(e) => setSourceForm({ ...sourceForm, url: e.target.value })}
                    className="bg-white/5 border-white/10"
                    type="url"
                  />
                </>
              ) : addingSource === "faq" ? (
                <>
                  <Input
                    placeholder="Question (e.g. What are your hours?)"
                    value={sourceForm.title}
                    onChange={(e) => setSourceForm({ ...sourceForm, title: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                  <Textarea
                    placeholder="Answer..."
                    value={sourceForm.content}
                    onChange={(e) => setSourceForm({ ...sourceForm, content: e.target.value })}
                    rows={3}
                    className="bg-white/5 border-white/10 resize-none"
                  />
                </>
              ) : (
                <>
                  <Input
                    placeholder="Title"
                    value={sourceForm.title}
                    onChange={(e) => setSourceForm({ ...sourceForm, title: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                  <Textarea
                    placeholder="Paste your content here..."
                    value={sourceForm.content}
                    onChange={(e) => setSourceForm({ ...sourceForm, content: e.target.value })}
                    rows={5}
                    className="bg-white/5 border-white/10 resize-none"
                  />
                </>
              )}

              <Button
                onClick={handleAddSource}
                disabled={
                  (addingSource === "url" ? !sourceForm.url : !sourceForm.title || !sourceForm.content)
                  || createSourceMutation.isPending
                }
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                {createSourceMutation.isPending ? "Adding..." : "Add Source"}
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Tab: Conversations */}
      {tab === "conversations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {!(conversations as any[])?.length ? (
            <div className="text-center py-16 text-muted-foreground border border-white/8 rounded-xl">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No conversations yet. Share the embed code to start receiving messages.</p>
            </div>
          ) : (
            (conversations as any[])?.map((conv) => (
              <div key={conv.id} className="flex items-center gap-4 px-4 py-3 rounded-lg border border-white/8 bg-white/[0.02] hover:border-white/12 transition-all">
                <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Session {conv.sessionId}</div>
                  <div className="text-xs text-muted-foreground">{new Date(conv.createdAt).toLocaleString()}</div>
                </div>
                <span className="text-sm text-muted-foreground">{conv.messageCount} msgs</span>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Tab: Embed Code */}
      {tab === "embed" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="p-5 rounded-xl border border-white/8 bg-white/[0.02]">
            <h3 className="font-semibold mb-2">Add to your website</h3>
            <p className="text-sm text-muted-foreground mb-4">Copy this code and paste it before the closing <code className="text-indigo-400">&lt;/body&gt;</code> tag on your site.</p>
            <div className="rounded-xl border border-white/10 bg-[#0d0d14] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/8 bg-white/[0.02]">
                <span className="text-xs text-muted-foreground font-mono">HTML</span>
                <button onClick={handleCopyEmbed} className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy code"}
                </button>
              </div>
              <pre className="p-4 text-xs text-green-300 font-mono overflow-x-auto whitespace-pre-wrap">
                {embedData?.snippet ?? "Loading embed code..."}
              </pre>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
              <h4 className="font-medium mb-2">Bot ID</h4>
              <code className="text-indigo-400 text-lg font-bold font-mono">{botId}</code>
            </div>
            <div className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
              <h4 className="font-medium mb-2">Status</h4>
              <span className={cn("text-sm px-2 py-1 rounded-full border font-medium", status.class)}>{status.label}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Delete confirm dialog */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Delete this agent?</h3>
            <p className="text-sm text-muted-foreground mb-6">This will permanently delete <strong>{(bot as any).name}</strong> and all its conversations. This cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-white/10" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-500" onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? "Deleting..." : "Delete Agent"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
