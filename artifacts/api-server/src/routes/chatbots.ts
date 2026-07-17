import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import {
  chatbotsTable,
  knowledgeSourcesTable,
  botConversationsTable,
  botMessagesTable,
} from "@workspace/db";
import { eq, and, sql, desc } from "drizzle-orm";
import {
  CreateChatbotBody,
  UpdateChatbotBody,
  CreateSourceBody,
  ChatWithBotBody,
} from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
}

// ── List chatbots ──────────────────────────────────────────
router.get("/chatbots", requireAuth, async (req: any, res) => {
  try {
    const bots = await db
      .select()
      .from(chatbotsTable)
      .where(eq(chatbotsTable.userId, req.userId))
      .orderBy(desc(chatbotsTable.createdAt));
    return res.json(bots);
  } catch (err) {
    req.log.error({ err }, "Failed to list chatbots");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Create chatbot ─────────────────────────────────────────
router.post("/chatbots", requireAuth, async (req: any, res) => {
  try {
    const parsed = CreateChatbotBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const [bot] = await db
      .insert(chatbotsTable)
      .values({
        userId: req.userId,
        name: parsed.data.name,
        companyName: parsed.data.companyName,
        description: parsed.data.description ?? null,
        personality: parsed.data.personality ?? "professional",
        primaryColor: parsed.data.primaryColor ?? "#6366f1",
        welcomeMessage: parsed.data.welcomeMessage ?? "Hi! How can I help you today?",
        status: "draft",
      })
      .returning();

    return res.status(201).json(bot);
  } catch (err) {
    req.log.error({ err }, "Failed to create chatbot");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Get chatbot ────────────────────────────────────────────
router.get("/chatbots/:id", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const [bot] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, id), eq(chatbotsTable.userId, req.userId)));
    if (!bot) return res.status(404).json({ error: "Not found" });
    return res.json(bot);
  } catch (err) {
    req.log.error({ err }, "Failed to get chatbot");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Update chatbot ─────────────────────────────────────────
router.patch("/chatbots/:id", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = UpdateChatbotBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const [existing] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, id), eq(chatbotsTable.userId, req.userId)));
    if (!existing) return res.status(404).json({ error: "Not found" });

    const [updated] = await db
      .update(chatbotsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(chatbotsTable.id, id))
      .returning();

    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update chatbot");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Delete chatbot ─────────────────────────────────────────
router.delete("/chatbots/:id", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, id), eq(chatbotsTable.userId, req.userId)));
    if (!existing) return res.status(404).json({ error: "Not found" });

    await db.delete(chatbotsTable).where(eq(chatbotsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete chatbot");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Train chatbot ──────────────────────────────────────────
router.post("/chatbots/:id/train", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, id), eq(chatbotsTable.userId, req.userId)));
    if (!existing) return res.status(404).json({ error: "Not found" });

    // Mark as training
    await db
      .update(chatbotsTable)
      .set({ status: "training", updatedAt: new Date() })
      .where(eq(chatbotsTable.id, id));

    // Simulate training completion async
    setTimeout(async () => {
      const score = Math.floor(Math.random() * 25) + 75; // 75-99
      await db
        .update(chatbotsTable)
        .set({ status: "ready", trainingScore: score, updatedAt: new Date() })
        .where(eq(chatbotsTable.id, id));

      // Mark sources as processed
      await db
        .update(knowledgeSourcesTable)
        .set({ status: "processed" })
        .where(eq(knowledgeSourcesTable.chatbotId, id));
    }, 3000);

    const [updated] = await db.select().from(chatbotsTable).where(eq(chatbotsTable.id, id));
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to train chatbot");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Embed code ─────────────────────────────────────────────
router.get("/chatbots/:id/embed-code", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const [bot] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, id), eq(chatbotsTable.userId, req.userId)));
    if (!bot) return res.status(404).json({ error: "Not found" });

    const host = req.get("x-forwarded-host") ?? req.get("host") ?? "";
    const proto = req.get("x-forwarded-proto") ?? req.protocol ?? "https";
    const widgetUrl = `${proto}://${host}/api/widget.js`;

    const snippet = `<!-- NeuroDesk AI Widget -->
<script>
  window.NeuroDeskConfig = { botId: ${id} };
</script>
<script src="${widgetUrl}" async></script>`;

    return res.json({ snippet, botId: id });
  } catch (err) {
    req.log.error({ err }, "Failed to get embed code");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Knowledge sources ──────────────────────────────────────
router.get("/chatbots/:id/sources", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const [bot] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, id), eq(chatbotsTable.userId, req.userId)));
    if (!bot) return res.status(404).json({ error: "Not found" });

    const sources = await db
      .select()
      .from(knowledgeSourcesTable)
      .where(eq(knowledgeSourcesTable.chatbotId, id))
      .orderBy(desc(knowledgeSourcesTable.createdAt));
    return res.json(sources);
  } catch (err) {
    req.log.error({ err }, "Failed to list sources");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/chatbots/:id/sources", requireAuth, async (req: any, res) => {
  try {
    const chatbotId = parseInt(req.params.id);
    const [bot] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, chatbotId), eq(chatbotsTable.userId, req.userId)));
    if (!bot) return res.status(404).json({ error: "Not found" });

    const parsed = CreateSourceBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const [source] = await db
      .insert(knowledgeSourcesTable)
      .values({
        chatbotId,
        type: parsed.data.type,
        title: parsed.data.title,
        content: parsed.data.content,
        status: "pending",
      })
      .returning();

    return res.status(201).json(source);
  } catch (err) {
    req.log.error({ err }, "Failed to create source");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/chatbots/:id/sources/:sourceId", requireAuth, async (req: any, res) => {
  try {
    const chatbotId = parseInt(req.params.id);
    const sourceId = parseInt(req.params.sourceId);
    const [bot] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, chatbotId), eq(chatbotsTable.userId, req.userId)));
    if (!bot) return res.status(404).json({ error: "Not found" });

    await db.delete(knowledgeSourcesTable).where(eq(knowledgeSourcesTable.id, sourceId));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete source");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Public bot info (no auth — for widget) ─────────────────
router.get("/chatbots/:id/public", async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const [bot] = await db
      .select({
        id: chatbotsTable.id,
        name: chatbotsTable.name,
        companyName: chatbotsTable.companyName,
        personality: chatbotsTable.personality,
        primaryColor: chatbotsTable.primaryColor,
        welcomeMessage: chatbotsTable.welcomeMessage,
        status: chatbotsTable.status,
      })
      .from(chatbotsTable)
      .where(eq(chatbotsTable.id, id));
    if (!bot) return res.status(404).json({ error: "Not found" });
    return res.json(bot);
  } catch (err) {
    req.log.error({ err }, "Failed to get public bot info");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Chat with bot (SSE streaming) ──────────────────────────
router.post("/chatbots/:id/chat", async (req: any, res) => {
  try {
    const chatbotId = parseInt(req.params.id);
    const parsed = ChatWithBotBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const [bot] = await db.select().from(chatbotsTable).where(eq(chatbotsTable.id, chatbotId));
    if (!bot) return res.status(404).json({ error: "Not found" });

    const { message, sessionId } = parsed.data;

    // Get or create conversation
    let [conv] = await db
      .select()
      .from(botConversationsTable)
      .where(
        and(
          eq(botConversationsTable.chatbotId, chatbotId),
          eq(botConversationsTable.sessionId, sessionId),
        ),
      );

    if (!conv) {
      [conv] = await db
        .insert(botConversationsTable)
        .values({ chatbotId, sessionId })
        .returning();
    }

    // Get recent messages for context
    const recentMessages = await db
      .select()
      .from(botMessagesTable)
      .where(eq(botMessagesTable.conversationId, conv.id))
      .orderBy(desc(botMessagesTable.createdAt))
      .limit(10);

    // Save user message
    await db.insert(botMessagesTable).values({
      conversationId: conv.id,
      role: "user",
      content: message,
    });

    // Get knowledge sources for context
    const sources = await db
      .select()
      .from(knowledgeSourcesTable)
      .where(
        and(
          eq(knowledgeSourcesTable.chatbotId, chatbotId),
          eq(knowledgeSourcesTable.status, "processed"),
        ),
      )
      .limit(5);

    const knowledgeContext = sources.map((s) => `${s.title}:\n${s.content}`).join("\n\n");

    const systemPrompt = `You are ${bot.name}, an AI assistant for ${bot.companyName}.
Personality: ${bot.personality}.
Welcome message: "${bot.welcomeMessage}"
${knowledgeContext ? `\nKnowledge base:\n${knowledgeContext}` : ""}
Keep responses helpful, concise, and on-topic.`;

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...recentMessages
        .reverse()
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: message },
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      stream: true,
      max_tokens: 500,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Save assistant message
    await db.insert(botMessagesTable).values({
      conversationId: conv.id,
      role: "assistant",
      content: fullResponse,
    });

    // Update chatbot message count
    await db
      .update(chatbotsTable)
      .set({
        totalMessages: sql`${chatbotsTable.totalMessages} + 2`,
        updatedAt: new Date(),
      })
      .where(eq(chatbotsTable.id, chatbotId));

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  } catch (err) {
    req.log?.error?.({ err }, "Failed to chat with bot");
    if (!res.headersSent) return res.status(500).json({ error: "Internal server error" });
    return;
  }
});

// ── Bot conversations ──────────────────────────────────────
router.get("/chatbots/:id/conversations", requireAuth, async (req: any, res) => {
  try {
    const chatbotId = parseInt(req.params.id);
    const [bot] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, chatbotId), eq(chatbotsTable.userId, req.userId)));
    if (!bot) return res.status(404).json({ error: "Not found" });

    const convs = await db
      .select({
        id: botConversationsTable.id,
        chatbotId: botConversationsTable.chatbotId,
        sessionId: botConversationsTable.sessionId,
        createdAt: botConversationsTable.createdAt,
        messageCount: sql<number>`(
          SELECT COUNT(*) FROM bot_messages
          WHERE bot_messages.conversation_id = ${botConversationsTable.id}
        )`,
      })
      .from(botConversationsTable)
      .where(eq(botConversationsTable.chatbotId, chatbotId))
      .orderBy(desc(botConversationsTable.createdAt));

    return res.json(convs);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/chatbots/:id/conversations/:convId", requireAuth, async (req: any, res) => {
  try {
    const chatbotId = parseInt(req.params.id);
    const convId = parseInt(req.params.convId);
    const [bot] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, chatbotId), eq(chatbotsTable.userId, req.userId)));
    if (!bot) return res.status(404).json({ error: "Not found" });

    const [conv] = await db
      .select()
      .from(botConversationsTable)
      .where(eq(botConversationsTable.id, convId));
    if (!conv) return res.status(404).json({ error: "Not found" });

    const msgs = await db
      .select()
      .from(botMessagesTable)
      .where(eq(botMessagesTable.conversationId, convId))
      .orderBy(botMessagesTable.createdAt);

    return res.json({ ...conv, messages: msgs });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
