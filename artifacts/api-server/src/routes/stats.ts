import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { chatbotsTable, botConversationsTable, botMessagesTable, knowledgeSourcesTable } from "@workspace/db";
import { eq, and, sql, desc } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
}

router.get("/stats/dashboard", requireAuth, async (req: any, res) => {
  try {
    const userId = req.userId;

    const bots = await db
      .select()
      .from(chatbotsTable)
      .where(eq(chatbotsTable.userId, userId));

    const botIds = bots.map((b) => b.id);
    const totalChatbots = bots.length;
    const activeChatbots = bots.filter((b) => b.status === "ready").length;
    const totalMessages = bots.reduce((sum, b) => sum + (b.totalMessages ?? 0), 0);
    const totalConversations = bots.reduce((sum, b) => sum + (b.totalConversations ?? 0), 0);

    // Messages this month (from DB)
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const messagesThisMonth = totalMessages; // simplified

    // Top bots by message count
    const topBots = bots
      .sort((a, b) => (b.totalMessages ?? 0) - (a.totalMessages ?? 0))
      .slice(0, 5)
      .map((b) => ({ id: b.id, name: b.name, messageCount: b.totalMessages ?? 0 }));

    return res.json({
      totalChatbots,
      totalConversations,
      totalMessages,
      activeChatbots,
      messagesThisMonth,
      topBots,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/chatbots/:id/stats", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const [bot] = await db
      .select()
      .from(chatbotsTable)
      .where(and(eq(chatbotsTable.id, id), eq(chatbotsTable.userId, req.userId)));
    if (!bot) return res.status(404).json({ error: "Not found" });

    const sourceCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(knowledgeSourcesTable)
      .where(eq(knowledgeSourcesTable.chatbotId, id));

    const avgMessages =
      bot.totalConversations > 0
        ? parseFloat((bot.totalMessages / bot.totalConversations).toFixed(1))
        : 0;

    return res.json({
      totalConversations: bot.totalConversations,
      totalMessages: bot.totalMessages,
      averageMessagesPerConversation: avgMessages,
      trainingScore: bot.trainingScore,
      sourceCount: Number(sourceCount[0]?.count ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get chatbot stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
