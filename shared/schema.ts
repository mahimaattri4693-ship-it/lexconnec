import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'user' or 'lawyer'
  barCouncilId: text("bar_council_id"),
  specialization: text("specialization"),
  experience: integer("experience"),
  fee: integer("fee"),
  about: text("about"),
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lawyerId: integer("lawyer_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("Pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  casesAsUser: many(cases, { relationName: "userCases" }),
  casesAsLawyer: many(cases, { relationName: "lawyerCases" }),
}));

export const casesRelations = relations(cases, ({ one }) => ({
  user: one(users, {
    fields: [cases.userId],
    references: [users.id],
    relationName: "userCases",
  }),
  lawyer: one(users, {
    fields: [cases.lawyerId],
    references: [users.id],
    relationName: "lawyerCases",
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCaseSchema = createInsertSchema(cases).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof loginSchema>;
