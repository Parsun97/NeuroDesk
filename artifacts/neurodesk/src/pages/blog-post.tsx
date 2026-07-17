import { useParams, Link } from "wouter";
import { SEO } from "@/components/seo";
import { Bot, ArrowLeft, Clock } from "lucide-react";

const POSTS: Record<string, { title: string; category: string; readTime: string; date: string; content: string }> = {
  "how-ai-chatbots-reduce-support-tickets": {
    title: "How AI Chatbots Reduce Support Tickets by 60%",
    category: "Case Study",
    readTime: "5 min",
    date: "May 15, 2026",
    content: `Businesses deploying AI support agents are seeing ticket volume drop — fast. Across 200 companies surveyed, the median reduction in first-line support tickets within 90 days of deploying an AI agent was 58%.

## Why it works

The core insight is simple: most support questions are the same questions. "What's your return policy?" "How do I reset my password?" "Where is my order?" These aren't complex problems — they're repetitive ones. A well-trained AI agent answers them instantly, 24/7, without queuing.

When customers get answers in seconds instead of hours, they don't open tickets.

## The numbers

In one case study, a SaaS company with 12,000 monthly support emails deployed a NeuroDesk agent trained on their documentation and FAQ. Within 30 days:

- First-response time dropped from 4.2 hours to 12 seconds
- Ticket volume fell 64%
- Customer satisfaction scores increased 22 points
- Support team shifted focus to complex, high-value issues

## What drives success

Training quality matters more than model selection. Companies that gave their agents detailed, structured knowledge bases saw 2–3x better deflection rates than those who provided sparse content.

Personality also matters. Agents configured with a tone that matched the brand voice earned higher satisfaction scores — users felt they were talking to the company, not a generic bot.

## The bottom line

If your support team is drowning in repetitive queries, an AI agent isn't a luxury — it's infrastructure. The ROI calculation is straightforward: at $9/month for the Pro plan, you need to deflect roughly one human support interaction per month to break even. Most businesses deflect hundreds.`,
  },
  "train-chatbot-on-your-knowledge-base": {
    title: "The Complete Guide to Training a Chatbot on Your Knowledge Base",
    category: "Guide",
    readTime: "8 min",
    date: "May 10, 2026",
    content: `Training a chatbot is only as good as the knowledge you give it. Most companies under-invest in this step — and then wonder why their bot gives vague or wrong answers.

## What makes good training data

The best knowledge sources share three properties: they're accurate, they're specific, and they're written the way customers ask questions.

**URLs** work well for product pages, documentation, and help centers. The agent can extract structured information from well-formatted pages.

**Text documents** give you the most control. Write them as Q&A pairs or short explanatory paragraphs. Avoid jargon unless your customers use it.

**FAQ entries** are the highest-signal training data. If you already have an FAQ, import it first — these are real questions your customers ask, paired with answers you've validated.

## How much content do you need?

More isn't always better. 20 high-quality, specific articles outperform 200 generic ones. Focus on the top 80% of questions your support team actually receives.

## Structuring for accuracy

Break content into logical chunks. An agent that has access to a 10,000-word document will retrieve less precisely than one with 20 focused 500-word articles.

Use clear headings. The agent uses heading structure to understand what each section is about.

## Iterating after launch

Train once, then review the first 100 conversations. Where did the agent fail? What did users ask that wasn't covered? Add knowledge sources to close those gaps. Most teams find their agent accuracy improves significantly after two rounds of iteration.`,
  },
  "ai-chatbot-vs-live-chat": {
    title: "AI Chatbot vs Live Chat: Which Is Right for Your Business?",
    category: "Strategy",
    readTime: "6 min",
    date: "May 4, 2026",
    content: `This isn't an either/or decision. The businesses getting the most from AI support use both — with the AI handling volume and humans handling complexity.

## What AI does well

AI chatbots excel at scale. They handle unlimited simultaneous conversations without degrading quality. They're available at 3 AM on a Sunday. They're consistent — they never have a bad day or give a wrong answer because they were distracted.

For high-volume, repetitive questions, AI is categorically better than humans. Faster, cheaper, and more consistent.

## What humans do better

Complex problems requiring judgment, empathy for frustrated customers, sales conversations with high stakes, and anything requiring access to internal systems the AI isn't connected to.

A customer who just had a terrible experience doesn't want a bot. They want a human who can say "I'm sorry, let me fix this for you."

## The hybrid model

The most effective approach: AI handles first contact. It resolves what it can (typically 60–80% of queries). For the rest, it collects context and routes to a human with a full conversation transcript.

This means your human agents spend zero time on password resets and shipping lookups — and all their time on the conversations that actually need a human.

## Making the decision

If you're getting more than 20 repetitive support requests per day, an AI agent will pay for itself. If your support involves high-stakes, complex, emotional situations, keep humans in the loop — just let AI do the triage.`,
  },
  "chatbot-personality-design": {
    title: "Designing Chatbot Personality: Why Tone Converts Better Than Features",
    category: "Design",
    readTime: "7 min",
    date: "Apr 28, 2026",
    content: `Personality is not decoration. It's a conversion variable.

We analyzed 10,000 conversations across agents with different personality configurations and found that tone accounted for more variance in satisfaction scores than response accuracy.

## The five archetypes

**Professional** — Formal, precise, no-nonsense. Best for B2B, financial services, healthcare. Users trust it because it sounds like an expert.

**Friendly** — Warm, encouraging, casual. Best for consumer products, e-commerce, lifestyle brands. Users like it because it feels human.

**Sales** — Benefit-forward, solution-oriented. Best for sales-assist and lead qualification. Users engage because it's focused on them.

**Technical** — Detailed, structured, precise. Best for developer tools, SaaS products, IT. Users trust it because it speaks their language.

**Luxury** — Refined, exclusive, elevated. Best for premium products, high-end services. Users feel valued because it treats them as discerning.

## Matching personality to context

The mismatch that kills conversion most often: a friendly, casual bot on a serious B2B product. Users feel the dissonance. "This doesn't feel like a company I should trust with my business."

Conversely, a stiff professional bot on a consumer fashion brand creates distance when warmth would convert.

## The consistency principle

Personality only works if it's consistent. If your agent is friendly for three messages then suddenly formal, users notice. Configure the personality and leave it — don't try to switch based on conversation flow.

## Testing

If you're unsure which personality fits your brand, run two agents in parallel on different pages for two weeks. The data will tell you more than any framework.`,
  },
  "embed-chatbot-without-developer": {
    title: "How to Embed a Chatbot on Any Website Without a Developer",
    category: "Tutorial",
    readTime: "4 min",
    date: "Apr 21, 2026",
    content: `After you create and train your agent in NeuroDesk, you get a snippet of HTML. Two script tags. That's all you need.

## The embed code

\`\`\`html
<!-- NeuroDesk AI Widget -->
<script>
  window.NeuroDeskConfig = { botId: 42 };
</script>
<script src="https://widget.neurodesk.ai/widget.js" async></script>
\`\`\`

Paste this before the closing \`</body>\` tag on any page where you want the widget to appear.

## Webflow

Open the page settings for any page (or site-wide in Project Settings > Custom Code). Paste the snippet in the "Footer Code" section. Publish. Done.

## WordPress

Install the "Insert Headers and Footers" plugin. Paste the code in the "Scripts in Footer" section. Save. Your bot is live.

## Shopify

Go to Online Store > Themes > Edit Code. Find \`theme.liquid\` in the Layout section. Paste the snippet just before \`</body>\`. Save. Works across all pages.

## Raw HTML

If you control the HTML directly, paste the snippet at the bottom of your \`index.html\` or layout file, before \`</body>\`. That's it.

## Customizing appearance

The widget inherits the primary color you set in your agent configuration. To change it, update your agent settings in NeuroDesk — no code changes needed.

## Verifying it works

After embedding, load the page and look for the chat button in the bottom-right corner. Click it. You should see your welcome message. If it doesn't appear, check your browser console for errors and verify the bot ID matches.`,
  },
  "multilingual-ai-support-agents": {
    title: "Running a Multilingual AI Support Agent: What You Need to Know",
    category: "Strategy",
    readTime: "6 min",
    date: "Apr 14, 2026",
    content: `Modern LLMs are genuinely multilingual. GPT-4o understands and responds fluently in dozens of languages — without you doing anything special. But there are nuances worth understanding before you go live with a global audience.

## How it works out of the box

When a user writes in French, your agent responds in French. When they switch to Spanish mid-conversation, it adapts. You don't configure languages — the model handles it automatically based on what the user writes.

This is one of the most underappreciated capabilities of modern AI: you trained your agent in English, but it will answer accurately in any supported language.

## Limitations

Translation accuracy varies by language. Major European languages (Spanish, French, German, Italian, Portuguese) are excellent. Asian languages (Japanese, Korean, Mandarin) are strong but sometimes produce unnatural phrasing. Less common languages may have gaps.

Your knowledge base is English (probably). The model will translate the meaning, but idiomatic or highly technical content may lose nuance in translation.

## What to test

Before going live with international traffic, test in your target languages:

1. Ask your 10 most common support questions in each language
2. Verify the answers are accurate and natural-sounding
3. Check that product names, prices, and policies translate correctly

## When to add language-specific knowledge

If you serve a large market in a specific language, consider adding knowledge sources in that language. An agent with Spanish-language FAQ content will outperform one relying purely on translation when serving Spanish-speaking customers.

## The bottom line

You don't need to do anything special to support multiple languages. Your agent handles it. But verify the quality for your key markets before scaling.`,
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = POSTS[slug ?? ""];

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-indigo-400 hover:text-indigo-300">Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={`${post.title} — NeuroDesk AI Blog`} description={post.title} />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">NeuroDesk AI</span>
          </Link>
          <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors">Get started</Link>
        </div>
      </header>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs px-2 py-0.5 rounded-full border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 font-medium">{post.category}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{post.readTime}</span>
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">{post.title}</h1>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-foreground/85 leading-relaxed space-y-4">
            {post.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{block.slice(3)}</h2>;
              }
              if (block.startsWith("**") && block.endsWith("**")) {
                return <p key={i} className="font-semibold text-foreground">{block.slice(2, -2)}</p>;
              }
              if (block.startsWith("```")) {
                const code = block.replace(/```html\n?/, "").replace(/```/, "");
                return <pre key={i} className="bg-[#0d0d14] border border-white/10 rounded-xl p-4 text-xs text-green-300 font-mono overflow-x-auto">{code}</pre>;
              }
              return <p key={i} className="text-foreground/80">{block}</p>;
            })}
          </div>

          <div className="mt-16 p-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <h3 className="font-bold text-lg mb-2">Ready to deploy your AI agent?</h3>
            <p className="text-sm text-muted-foreground mb-4">Join 2,400+ businesses running 24/7 AI support with NeuroDesk.</p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
