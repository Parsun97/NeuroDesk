import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { chatbotsTable } from "./chatbots";

export const botConversationsTable = pgTable("bot_conversations", {
  id: serial("id").primaryKey(),
  chatbotId: integer("chatbot_id").notNull().references(() => chatbotsTable.id, { onDelete: "cascade" }),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const botMessagesTable = pgTable("bot_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => botConversationsTable.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBotConversationSchema = createInsertSchema(botConversationsTable).omit({ id: true, createdAt: true });
export const insertBotMessageSchema = createInsertSchema(botMessagesTable).omit({ id: true, createdAt: true });
export type InsertBotConversation = z.infer<typeof insertBotConversationSchema>;
export type InsertBotMessage = z.infer<typeof insertBotMessageSchema>;
export type BotConversation = typeof botConversationsTable.$inferSelect;
export type BotMessage = typeof botMessagesTable.$inferSelect;
