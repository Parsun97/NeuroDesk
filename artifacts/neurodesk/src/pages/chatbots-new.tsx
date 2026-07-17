import { useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useCreateChatbot, useCreateSource, useTrainChatbot } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase, Smile, TrendingUp, Code2, Crown,
  Globe, FileText, HelpCircle, Plus, Trash2,
  CheckCircle, ArrowRight, ArrowLeft, Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PERSONALITIES = [
  { id: "professional", label: "Professional", desc: "Formal, precise, business-ready", icon: Briefcase, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "friendly", label: "Friendly", desc: "Warm, approachable, conversational", icon: Smile, color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { id: "sales", label: "Sales", desc: "Persuasive, benefit-focused, converts", icon: TrendingUp, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { id: "technical", label: "Technical", desc: "Precise, detailed, developer-grade", icon: Code2, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "luxury", label: "Luxury", desc: "Refined, exclusive, high-end tone", icon: Crown, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
];

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#06b6d4", "#3b82f6", "#ef4444"];

const STEPS = ["Basic Info", "Knowledge", "Appearance", "Deploy"];

type SourceInput = { type: "url" | "text" | "faq"; title: string; content: string };

export default function ChatbotsNew() {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    description: "",
    personality: "professional",
  });
  const [sources, setSources] = useState<SourceInput[]>([]);
  const [addingSource, setAddingSource] = useState<"url" | "text" | "faq" | null>(null);
  const [sourceForm, setSourceForm] = useState({ title: "", content: "" });
  const [appearance, setAppearance] = useState({ primaryColor: "#6366f1", welcomeMessage: "Hi! How can I help you today?" });

  const [createdBotId, setCreatedBotId] = useState<number | null>(null);
  const [embedCode, setEmbedCode] = useState<string>("");

  const createMutation = useCreateChatbot();
  const sourceMutation = useCreateSource();
  const trainMutation = useTrainChatbot();

  const canProceed = () => {
    if (step === 0) return form.name.trim() && form.companyName.trim();
    return true;
  };

  const handleNext = async () => {
    if (step === 2) {
      // Create chatbot
      try {
        const bot = await createMutation.mutateAsync({
          data: {
            name: form.name,
            companyName: form.companyName,
            description: form.description || undefined,
            personality: form.personality as any,
            primaryColor: appearance.primaryColor,
            welcomeMessage: appearance.welcomeMessage,
          },
        });
        const botId = (bot as any).id;
        setCreatedBotId(botId);

        // Create sources
        for (const src of sources) {
          await sourceMutation.mutateAsync({ id: botId, data: src });
        }

        // Train
        await trainMutation.mutateAsync({ id: botId });

        setEmbedCode(`<!-- NeuroDesk AI Widget -->\n<script>\n  window.NeuroDeskConfig = { botId: ${botId} };\n</script>\n<script src="https://widget.neurodesk.ai/widget.js" async></script>`);

        queryClient.invalidateQueries({ queryKey: ["/api/chatbots"] });
        setStep(3);
      } catch (e) {
        // step stays at 2
      }
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const addSource = () => {
    if (!sourceForm.title || !sourceForm.content || !addingSource) return;
    setSources((prev) => [...prev, { type: addingSource, ...sourceForm }]);
    setSourceForm({ title: "", content: "" });
    setAddingSource(null);
  };

  const isLoading = createMutation.isPending || sourceMutation.isPending || trainMutation.isPending;

  return (
    <DashboardLayout>
      <SEO title="New Agent — NeuroDesk AI" description="Create a new AI chatbot agent." />

      <div className="max-w-2xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center mb-10 gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={cn("flex items-center gap-2 text-sm font-medium transition-colors", i === step ? "text-foreground" : i < step ? "text-indigo-400" : "text-muted-foreground")}>
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all", i === step ? "bg-indigo-600 border-indigo-600 text-white" : i < step ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400" : "bg-white/5 border-white/10")}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={cn("h-px flex-1 mx-3 transition-colors", i < step ? "bg-indigo-500/40" : "bg-white/10")} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Name your agent</h1>
                  <p className="text-muted-foreground">Give your agent a name and tell it where it works.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Agent name <span className="text-red-400">*</span></label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Aria, Support Bot" className="bg-white/5 border-white/10 focus:border-indigo-500/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Company / website <span className="text-red-400">*</span></label>
                    <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="e.g. Acme Corp" className="bg-white/5 border-white/10 focus:border-indigo-500/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Description <span className="text-muted-foreground text-xs">(optional)</span></label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this agent do? What topics should it focus on?" rows={3} className="bg-white/5 border-white/10 focus:border-indigo-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Personality</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PERSONALITIES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setForm({ ...form, personality: p.id })}
                          className={cn("p-4 rounded-xl border text-left transition-all", form.personality === p.id ? "border-indigo-500/60 bg-indigo-500/10" : "border-white/8 bg-white/[0.02] hover:border-white/15")}
                        >
                          <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center mb-2", p.color)}>
                            <p.icon className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-sm">{p.label}</div>
                          <div className="text-xs text-muted-foreground">{p.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Knowledge */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Add knowledge sources</h1>
                  <p className="text-muted-foreground">Your agent will learn from these sources. You can add more later.</p>
                </div>
                <div className="space-y-3">
                  {sources.map((src, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/8 bg-white/[0.03]">
                      {src.type === "url" ? <Globe className="w-4 h-4 text-blue-400 shrink-0" /> : src.type === "text" ? <FileText className="w-4 h-4 text-green-400 shrink-0" /> : <HelpCircle className="w-4 h-4 text-orange-400 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{src.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{src.content.slice(0, 60)}...</div>
                      </div>
                      <button onClick={() => setSources((s) => s.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

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
                        <span className="text-sm font-medium capitalize">Add {addingSource}</span>
                        <button onClick={() => setAddingSource(null)} className="text-muted-foreground hover:text-foreground text-xs">Cancel</button>
                      </div>
                      <Input
                        placeholder={addingSource === "url" ? "https://yoursite.com/about" : addingSource === "faq" ? "e.g. What is your return policy?" : "Title"}
                        value={sourceForm.title}
                        onChange={(e) => setSourceForm({ ...sourceForm, title: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                      <Textarea
                        placeholder={addingSource === "url" ? "Describe what content to extract from this URL" : "Paste your content here..."}
                        value={sourceForm.content}
                        onChange={(e) => setSourceForm({ ...sourceForm, content: e.target.value })}
                        rows={4}
                        className="bg-white/5 border-white/10 resize-none"
                      />
                      <Button onClick={addSource} disabled={!sourceForm.title || !sourceForm.content} size="sm">
                        <Plus className="w-4 h-4 mr-1" /> Add Source
                      </Button>
                    </div>
                  )}
                </div>
                {sources.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-2">No sources yet. You can skip this step and add sources later.</p>
                )}
              </div>
            )}

            {/* Step 2: Appearance */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Customize appearance</h1>
                  <p className="text-muted-foreground">Set the brand color and opening message your visitors will see.</p>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Brand color</label>
                    <div className="flex gap-3 flex-wrap">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setAppearance({ ...appearance, primaryColor: c })}
                          className={cn("w-10 h-10 rounded-full transition-all", appearance.primaryColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110" : "hover:scale-105")}
                          style={{ background: c }}
                        />
                      ))}
                      <div className="flex items-center gap-2">
                        <input type="color" value={appearance.primaryColor} onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })} className="w-10 h-10 rounded-full cursor-pointer border-0 bg-transparent" />
                        <span className="text-sm text-muted-foreground">{appearance.primaryColor}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Welcome message</label>
                    <Textarea
                      value={appearance.welcomeMessage}
                      onChange={(e) => setAppearance({ ...appearance, welcomeMessage: e.target.value })}
                      rows={3}
                      className="bg-white/5 border-white/10 resize-none"
                    />
                  </div>
                  {/* Preview */}
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-4 py-2 text-xs text-muted-foreground border-b border-white/8 bg-white/[0.02]">Preview</div>
                    <div className="p-4 bg-card">
                      <div className="w-64 rounded-xl border border-white/10 overflow-hidden">
                        <div className="px-3 py-2 flex items-center gap-2" style={{ background: appearance.primaryColor }}>
                          <Bot className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-medium">{form.name || "Your Agent"}</span>
                        </div>
                        <div className="p-3">
                          <div className="bg-white/[0.06] rounded-xl rounded-bl-sm px-3 py-2 text-sm max-w-[80%]">{appearance.welcomeMessage}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Deploy */}
            {step === 3 && (
              <div className="text-center space-y-6 py-8">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                  <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Agent deployed!</h1>
                  <p className="text-muted-foreground">Your agent is training now and will be ready in seconds. Add this code to your site:</p>
                </div>
                <div className="text-left">
                  <div className="rounded-xl border border-white/10 bg-[#0d0d14] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/8 bg-white/[0.02]">
                      <span className="text-xs text-muted-foreground font-mono">embed code</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(embedCode)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="p-4 text-xs text-green-300 font-mono overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setLocation(`/chatbots/${createdBotId}`)} className="bg-indigo-600 hover:bg-indigo-500">
                    View Agent
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/chatbots")}>
                    All Agents
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/8">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500"
            >
              {isLoading ? "Creating..." : step === 2 ? "Deploy Agent" : "Continue"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
