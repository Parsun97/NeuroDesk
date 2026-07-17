import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { motion } from "framer-motion";
import { Bot, ArrowRight, Clock } from "lucide-react";

const POSTS = [
  {
    slug: "how-ai-chatbots-reduce-support-tickets",
    title: "How AI Chatbots Reduce Support Tickets by 60%",
    excerpt: "The numbers are in: businesses deploying AI support agents are seeing dramatic reductions in first-line ticket volume. Here's the data — and how to replicate it.",
    category: "Case Study",
    readTime: "5 min",
    date: "May 15, 2026",
  },
  {
    slug: "train-chatbot-on-your-knowledge-base",
    title: "The Complete Guide to Training a Chatbot on Your Knowledge Base",
    excerpt: "Not all training data is equal. We break down what types of content produce the best results and how to structure your knowledge base for maximum accuracy.",
    category: "Guide",
    readTime: "8 min",
    date: "May 10, 2026",
  },
  {
    slug: "ai-chatbot-vs-live-chat",
    title: "AI Chatbot vs Live Chat: Which Is Right for Your Business?",
    excerpt: "Both have their place. But understanding when to use each — and how to blend them — can be the difference between delight and frustration for your customers.",
    category: "Strategy",
    readTime: "6 min",
    date: "May 4, 2026",
  },
  {
    slug: "chatbot-personality-design",
    title: "Designing Chatbot Personality: Why Tone Converts Better Than Features",
    excerpt: "Your chatbot's personality isn't cosmetic — it's a conversion variable. We analyzed 10,000 conversations to find out which personality types perform best by industry.",
    category: "Design",
    readTime: "7 min",
    date: "Apr 28, 2026",
  },
  {
    slug: "embed-chatbot-without-developer",
    title: "How to Embed a Chatbot on Any Website Without a Developer",
    excerpt: "One script tag. That's all it takes. We walk through embedding your NeuroDesk agent on Webflow, WordPress, Shopify, and raw HTML — step by step.",
    category: "Tutorial",
    readTime: "4 min",
    date: "Apr 21, 2026",
  },
  {
    slug: "multilingual-ai-support-agents",
    title: "Running a Multilingual AI Support Agent: What You Need to Know",
    excerpt: "Your customers speak dozens of languages. Modern LLMs can handle most of them — but the strategy around multilingual deployment requires careful thought.",
    category: "Strategy",
    readTime: "6 min",
    date: "Apr 14, 2026",
  },
];

const categoryColors: Record<string, string> = {
  "Case Study": "text-green-400 bg-green-500/10 border-green-500/20",
  "Guide": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Strategy": "text-violet-400 bg-violet-500/10 border-violet-500/20",
  "Design": "text-pink-400 bg-pink-500/10 border-pink-500/20",
  "Tutorial": "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Blog — NeuroDesk AI" description="Guides, case studies, and strategy for AI chatbot deployment." />

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
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
            <h1 className="text-5xl font-bold tracking-tighter mb-4">Blog</h1>
            <p className="text-muted-foreground text-lg">Guides, case studies, and AI chatbot strategy for teams that move fast.</p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            {POSTS.map((post) => (
              <motion.div key={post.slug} variants={fadeUp}>
                <Link href={`/blog/${post.slug}`} className="group block p-6 rounded-xl border border-white/8 bg-white/[0.02] hover:border-indigo-500/25 hover:bg-indigo-500/[0.04] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${categoryColors[post.category] ?? "text-muted-foreground"}`}>{post.category}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{post.readTime}</span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <h2 className="text-lg font-semibold mb-2 group-hover:text-indigo-300 transition-colors">{post.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
