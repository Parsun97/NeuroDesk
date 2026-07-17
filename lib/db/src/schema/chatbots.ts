import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const chatbotsTable = pgTable("chatbots", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  personality: text("personality").notNull().default("professional"),
  primaryColor: text("primary_color").notNull().default("#6366f1"),
  welcomeMessage: text("welcome_message").notNull().default("Hi! How can I help you today?"),
  trainingScore: integer("training_score"),
  totalMessages: integer("total_messages").notNull().default(0),
  totalConversations: integer("total_conversations").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertChatbotSchema = createInsertSchema(chatbotsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertChatbot = z.infer<typeof insertChatbotSchema>;
export type Chatbot = typeof chatbotsTable.$inferSelect;
