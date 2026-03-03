import { users, cases, type User, type InsertUser, type Case, type InsertCase } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  getLawyers(specialization?: string): Promise<User[]>;
  
  createCase(data: InsertCase): Promise<Case>;
  getCase(id: number): Promise<Case | undefined>;
  getCasesByUser(userId: number): Promise<Case[]>;
  getCasesByLawyer(lawyerId: number): Promise<Case[]>;
  updateCase(id: number, status: string): Promise<Case>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getLawyers(specialization?: string): Promise<User[]> {
    let query = db.select().from(users).where(eq(users.role, "lawyer"));
    const results = await query;
    if (specialization) {
      return results.filter(r => r.specialization === specialization);
    }
    return results;
  }

  async createCase(data: InsertCase): Promise<Case> {
    const [c] = await db.insert(cases).values(data).returning();
    return c;
  }

  async getCase(id: number): Promise<Case | undefined> {
    const [c] = await db.select().from(cases).where(eq(cases.id, id));
    return c;
  }

  async getCasesByUser(userId: number): Promise<Case[]> {
    return db.select().from(cases).where(eq(cases.userId, userId));
  }

  async getCasesByLawyer(lawyerId: number): Promise<Case[]> {
    return db.select().from(cases).where(eq(cases.lawyerId, lawyerId));
  }

  async updateCase(id: number, status: string): Promise<Case> {
    const [c] = await db.update(cases).set({ status }).where(eq(cases.id, id)).returning();
    return c;
  }
}

export const storage = new DatabaseStorage();
