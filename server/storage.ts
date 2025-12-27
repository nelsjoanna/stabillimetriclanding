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
      console.log(`🔄 Attempting to save waitlist signup to database: ${signup.email}`);
      console.log(`📝 Signup data:`, JSON.stringify(signup, null, 2));
      
      // Use a transaction to ensure the insert commits properly
      const result = await db.transaction(async (tx) => {
        const [inserted] = await tx
          .insert(waitlistSignups)
          .values(signup)
          .returning();
        
        if (!inserted) {
          throw new Error("Failed to create waitlist signup - no result returned");
        }
        
        // Verify immediately within the same transaction
        const verify = await tx
          .select()
          .from(waitlistSignups)
          .where(eq(waitlistSignups.email, signup.email))
          .limit(1);
        
        if (verify.length === 0) {
          throw new Error("CRITICAL: Signup was inserted but cannot be queried back in same transaction!");
        }
        
        console.log(`✅ Transaction verified: Signup exists (ID: ${verify[0].id})`);
        return inserted;
      });
      
      console.log(`✅ Waitlist signup saved to database: ${signup.email}`);
      console.log(`📊 Saved signup ID: ${result.id}, Email: ${result.email}`);
      
      // Verify after transaction commits (using a new connection from pool)
      const postCommitVerify = await db
        .select()
        .from(waitlistSignups)
        .where(eq(waitlistSignups.email, signup.email))
        .limit(1);
      
      if (postCommitVerify.length === 0) {
        console.error("❌ CRITICAL: Signup was inserted in transaction but not visible after commit!");
        console.error("❌ This suggests a database connection or isolation level issue");
      } else {
        console.log(`✅ Post-commit verified: Signup exists in database (ID: ${postCommitVerify[0].id})`);
      }
      
      return result;
    } catch (error: any) {
      console.error("❌ Error saving waitlist signup to database:");
      console.error("❌ Error message:", error?.message);
      console.error("❌ Error code:", error?.code);
      console.error("❌ Error detail:", error?.detail);
      console.error("❌ Full error:", error);
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
      name: signup.name,
      phoneNumber: signup.phoneNumber ?? null,
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
