import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Bot } from "lucide-react";
import { SEO } from "@/components/seo";
import { useListPlans } from "@workspace/api-client-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { data: plans, isLoading } = useListPlans();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Pricing — NeuroDesk AI" description="Simple, honest pricing for AI chatbot deployment. From $4/month." />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">NeuroDesk AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors">Get started</Link>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-14">
            <motion.h1 variants={fadeUp} className="text-5xl font-bold tracking-tighter mb-4">Simple, honest pricing.</motion.h1>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-8">No hidden fees. No per-seat pricing. Pay for what you use.</motion.p>
            <motion.div variants={fadeUp} className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${billing === b ? "bg-indigo-600 text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {b === "monthly" ? "Monthly" : "Yearly"}
                  {b === "yearly" && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Save 20%</span>}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-96 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(plans ?? []).map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  className={`relative p-7 rounded-xl border flex flex-col transition-all ${plan.popular ? "border-indigo-500/50 bg-indigo-500/[0.06] shadow-2xl shadow-indigo-500/10" : "border-white/8 bg-white/[0.02]"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">MOST POPULAR</div>
                  )}
                  <div className="mb-6">
                    <div className="font-semibold text-lg mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl font-black">${billing === "monthly" ? plan.priceMonthly : plan.priceYearly.toFixed(2)}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                    {billing === "yearly" && (
                      <div className="text-sm text-green-400 mt-1">Billed ${(plan.priceYearly * 12).toFixed(0)}/year</div>
                    )}
                    <div className="text-sm text-muted-foreground mt-2">
                      {plan.chatbotLimit ? `${plan.chatbotLimit} chatbot${plan.chatbotLimit > 1 ? "s" : ""}` : "Unlimited chatbots"} · {plan.messageLimit.toLocaleString()} msgs/mo
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sign-up"
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${plan.popular ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8"}`}
                  >
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* FAQ */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-20 text-center">
            <p className="text-muted-foreground">Questions? <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Read our docs</Link> or <a href="mailto:hello@neurodesk.ai" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">contact us</a>.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
