import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { SEO } from "@/components/seo";
import {
  Bot, Zap, Shield, BarChart3, Code2, Globe,
  ChevronDown, CheckCircle, ArrowRight, Star,
  MessageSquare, Upload, Palette, Layers
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const FEATURES = [
  { icon: Upload, title: "Train on Any Source", desc: "Import URLs, PDFs, and FAQ text. Your agent learns your knowledge base in seconds." },
  { icon: Bot, title: "Multiple Personalities", desc: "Choose from Professional, Friendly, Sales, Technical, or Luxury to match your brand voice." },
  { icon: Palette, title: "Full Customization", desc: "Brand colors, welcome messages, and appearance — pixel-perfect to your design system." },
  { icon: Code2, title: "One-Line Embed", desc: "Drop a single script tag onto any site. No frameworks, no build steps, no engineers needed." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track conversations, message volume, and satisfaction scores in real time." },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant. Data encrypted at rest and in transit. Your data stays yours." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Upload Your Knowledge", desc: "Paste URLs, upload PDFs, or type FAQs. NeuroDesk indexes and understands every word." },
  { step: "02", title: "Train & Customize", desc: "Hit train. In seconds your agent is ready — configure its personality, color, and greeting." },
  { step: "03", title: "Embed & Go Live", desc: "Copy one script tag into your site. Your AI support agent is live, 24/7, from day one." },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Head of Support, Nexus SaaS", quote: "Reduced support tickets by 67% in the first month. Our customers get instant answers at 2 AM now.", avatar: "SC" },
  { name: "Marcus Webb", role: "Founder, Vesper Commerce", quote: "Took 12 minutes from signup to a live chatbot on our store. Absolutely insane time-to-value.", avatar: "MW" },
  { name: "Priya Nair", role: "CTO, Lattice Health", quote: "The training accuracy blew us away. It understood our medical terminology out of the box.", avatar: "PN" },
  { name: "James Okafor", role: "Director, Bloom Agency", quote: "We white-label NeuroDesk for 30 of our clients. The Business plan pays for itself every week.", avatar: "JO" },
];

const FAQS = [
  { q: "How does the training work?", a: "You provide URLs, PDF files, or text. Our AI processes and indexes the content, then uses it to answer questions accurately. Training takes seconds to minutes depending on volume." },
  { q: "Can I use my own OpenAI key?", a: "Yes — NeuroDesk works with your own OpenAI API key, giving you full control over costs and model selection." },
  { q: "Is there a free trial?", a: "The Starter plan is $4/month and includes everything you need to deploy your first agent. No free tier — but no credit card required until you're ready." },
  { q: "What happens if I exceed my message limit?", a: "Your bot will gracefully decline new conversations and prompt visitors to contact you directly. Upgrade anytime with no downtime." },
  { q: "Can I remove the NeuroDesk branding?", a: "Yes — the Pro and Business plans include full white-labeling. Your brand, your domain, zero NeuroDesk footprint." },
  { q: "Do you support multiple languages?", a: "Your agent responds in whatever language the user writes in, powered by the underlying GPT-4o model's multilingual capabilities." },
];

const PLANS = [
  { id: "starter", name: "Starter", monthly: 4, yearly: 3.2, bots: 1, messages: "500", cta: "Get Started", popular: false, features: ["1 chatbot", "500 messages/month", "Website + PDF training", "Basic analytics", "Standard support"] },
  { id: "pro", name: "Pro", monthly: 9, yearly: 7.5, bots: 5, messages: "5,000", cta: "Start Pro", popular: true, features: ["5 chatbots", "5,000 messages/month", "Remove branding", "Lead generation", "Priority support", "AI memory", "API access"] },
  { id: "business", name: "Business", monthly: 20, yearly: 16.67, bots: null, messages: "25,000", cta: "Go Business", popular: false, features: ["Unlimited chatbots", "25,000 messages/month", "White-label", "CRM integrations", "Webhooks", "Custom domains", "Team collaboration"] },
];

export default function Landing() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="NeuroDesk AI — Deploy Your AI Support Agent in Minutes" description="Train a chatbot on your knowledge base, customize it, and embed it on your site in minutes. The fastest way to deploy an AI support agent." />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">NeuroDesk AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground font-medium">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.18),transparent)]" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 rounded-full px-4 py-1.5 text-sm font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            NeuroDesk 2.0 — now with GPT-4o
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6"
          >
            <span className="bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
              The fastest way to<br />deploy an AI agent.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Train on your knowledge base. Customize the personality. Embed on any site with one script tag. Your support agent is live in minutes — not months.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/sign-up" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
              Deploy your agent
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#demo" className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8 text-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              See a live demo
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground mt-6"
          >
            From $4/month. No engineers required.
          </motion.p>
        </div>
      </section>

      {/* Social proof strip */}
      <Section className="py-10 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {[["2,400+", "Businesses using NeuroDesk"], ["14M+", "Messages handled"], ["99.9%", "Uptime SLA"], ["< 2min", "Avg setup time"]].map(([num, label]) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <div className="text-3xl font-bold text-indigo-400">{num}</div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Live Demo */}
      <section id="demo" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">See it in action</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">This is a live chatbot, trained on TechGear Store's product catalog. Try asking it anything.</p>
          </div>
          <LiveDemoChat />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <Section className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-4">Everything you need. Nothing you don't.</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">A complete AI support platform engineered for precision — not feature bloat.</motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="p-6 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/15 transition-colors">
                  <f.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <Section className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-4">From zero to live in 3 steps.</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg">No engineering tickets. No weeks of setup. Just a working AI agent.</motion.p>
          </Section>
          <Section className="space-y-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.step} variants={fadeUp} className="flex gap-6 p-6 rounded-xl border border-white/8 bg-white/[0.02] hover:border-indigo-500/20 transition-all">
                <div className="text-5xl font-black text-indigo-500/20 leading-none shrink-0 w-16">{step.step}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <Section className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-4">Trusted by teams that move fast.</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="p-6 rounded-xl border border-white/8 bg-white/[0.03]">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm leading-relaxed mb-6 text-foreground/90">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-4">Simple, honest pricing.</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-8">Pick a plan. Change or cancel anytime.</motion.p>
            <motion.div variants={fadeUp} className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${billing === b ? "bg-indigo-600 text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {b === "monthly" ? "Monthly" : "Yearly"}
                  {b === "yearly" && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">-20%</span>}
                </button>
              ))}
            </motion.div>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                className={`relative p-6 rounded-xl border flex flex-col transition-all ${plan.popular ? "border-indigo-500/50 bg-indigo-500/5 shadow-xl shadow-indigo-500/10" : "border-white/8 bg-white/[0.02]"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
                )}
                <div className="mb-6">
                  <div className="font-semibold text-lg mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">${billing === "monthly" ? plan.monthly : plan.yearly.toFixed(2)}</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {plan.bots ? `${plan.bots} chatbot${plan.bots > 1 ? "s" : ""}` : "Unlimited chatbots"} · {plan.messages} msgs/mo
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`block text-center py-3 rounded-lg font-semibold text-sm transition-all ${plan.popular ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow shadow-indigo-500/30" : "border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8"}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 bg-white/[0.02]">
        <div className="max-w-2xl mx-auto">
          <Section className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-4">Questions answered.</motion.h2>
          </Section>
          <Section className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className="border border-white/8 rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-sm hover:bg-white/[0.03] transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${faqOpen === i ? "rotate-180" : ""}`} />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(99,102,241,0.12),transparent)]" />
        <div className="relative max-w-2xl mx-auto text-center">
          <Section>
            <motion.h2 variants={fadeUp} className="text-5xl font-bold tracking-tighter mb-6">
              Your support agent<br />is waiting.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-10">
              Join 2,400+ businesses running 24/7 AI support. Deploy in minutes.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40">
                Get started — from $4/mo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">NeuroDesk AI</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </div>
          <div className="text-sm text-muted-foreground">© 2026 NeuroDesk AI</div>
        </div>
      </footer>
    </div>
  );
}

// ── Live Demo Chat Component ───────────────────────────────────────────────────
const DEMO_PROMPTS = [
  "What headphones do you recommend?",
  "Do you offer free shipping?",
  "What's your return policy?",
  "Do you have any deals right now?",
];

type Msg = { role: "user" | "assistant"; content: string };

function LiveDemoChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm the TechGear Store AI assistant. Ask me anything about our products, shipping, or policies — I'm here to help!" },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const assistantMsg: Msg = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const resp = await fetch("/api/chatbots/1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: "demo-landing" }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          try {
            const data = JSON.parse(line.slice(5).trim());
            if (data.content) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = { ...last, content: last.content + data.content };
                }
                return updated;
              });
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant" && last.content === "") {
          updated[updated.length - 1] = { ...last, content: "I'm a demo agent — I'll be fully operational once you deploy your own bot on NeuroDesk." };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <div className="space-y-4 mb-6">
          <h3 className="text-2xl font-bold">TechGear Store AI</h3>
          <p className="text-muted-foreground">This bot was trained on product pages, shipping policies, and FAQs. It handles hundreds of support questions daily — without a single human.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium mb-3">Try asking:</p>
          {DEMO_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="block w-full text-left text-sm px-4 py-2.5 rounded-lg border border-white/8 bg-white/[0.03] hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-muted-foreground hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden h-[480px] flex flex-col shadow-2xl shadow-black/50">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-card/50">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">TG</div>
          <div>
            <div className="text-sm font-semibold">TechGear Store</div>
            <div className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Online</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white/[0.06] text-foreground rounded-bl-sm"}`}>
                {m.content || (streaming && m.role === "assistant" ? <span className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.15s]" /><span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.3s]" /></span> : null)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-border">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={streaming}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500/50 placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
