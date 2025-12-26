import {
  type User,
  type InsertUser,
  type WaitlistSignup,
  type InsertWaitlistSignup,
  users,
  waitlistSignups,
} from "@shared/schema";
import { eq } from "drizzle-orm";

// Lazy import db to avoid errors if DATABASE_URL is not set
async function getDb() {
  const { db } = await import("./db");
  return db;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistSignup(signup: InsertWaitlistSignup): Promise<WaitlistSignup>;
  getWaitlistSignupByEmail(email: string): Promise<WaitlistSignup | undefined>;
  getAllWaitlistSignups(): Promise<WaitlistSignup[]>;
}

// Database-backed storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDb();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDb();
    const [user] = await db.insert(users).values(insertUser).returning();
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  }

  async createWaitlistSignup(
    signup: InsertWaitlistSignup
  ): Promise<WaitlistSignup> {
    const db = await getDb();
    try {
      const [result] = await db
        .insert(waitlistSignups)
        .values(signup)
        .returning();
      if (!result) {
        throw new Error("Failed to create waitlist signup");
      }
      console.log(`✅ Waitlist signup saved to database: ${signup.email}`);
      return result;
    } catch (error) {
      console.error("❌ Error saving waitlist signup to database:", error);
      throw error;
    }
  }

  async getWaitlistSignupByEmail(
    email: string
  ): Promise<WaitlistSignup | undefined> {
    const db = await getDb();
    const result = await db
      .select()
      .from(waitlistSignups)
      .where(eq(waitlistSignups.email, email))
      .limit(1);
    return result[0];
  }

  async getAllWaitlistSignups(): Promise<WaitlistSignup[]> {
    const db = await getDb();
    return await db.select().from(waitlistSignups);
  }
}

// In-memory storage for development/testing when database is not available
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private waitlistSignups: Map<string, WaitlistSignup>;

  constructor() {
    this.users = new Map();
    this.waitlistSignups = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { randomUUID } = await import("crypto");
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistSignup(
    signup: InsertWaitlistSignup
  ): Promise<WaitlistSignup> {
    const { randomUUID } = await import("crypto");
    const id = randomUUID();
    const waitlistSignup: WaitlistSignup = {
      ...signup,
      id,
      role: signup.role ?? null,
      companySize: signup.companySize ?? null,
      isPilotPartner: signup.isPilotPartner ?? false,
      createdAt: new Date(),
    };
    this.waitlistSignups.set(id, waitlistSignup);
    return waitlistSignup;
  }

  async getWaitlistSignupByEmail(
    email: string
  ): Promise<WaitlistSignup | undefined> {
    return Array.from(this.waitlistSignups.values()).find(
      (signup) => signup.email === email,
    );
  }

  async getAllWaitlistSignups(): Promise<WaitlistSignup[]> {
    return Array.from(this.waitlistSignups.values());
  }
}

// Use database storage if DATABASE_URL is set, otherwise fall back to memory
let storageInstance: IStorage;

if (process.env.DATABASE_URL) {
  try {
    // Import db to check if it's available
    // This will throw if DATABASE_URL is invalid
    storageInstance = new DatabaseStorage();
    console.log("✅ Using database storage for waitlist signups");
  } catch (error) {
    // Fall back to memory storage if database connection fails
    console.warn("⚠️  Database connection failed, using in-memory storage:", error);
    storageInstance = new MemStorage();
  }
} else {
  console.warn("⚠️  DATABASE_URL not set - using in-memory storage (data will not persist)");
  storageInstance = new MemStorage();
}

export const storage = storageInstance;
