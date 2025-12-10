import { type User, type InsertUser, type WaitlistSignup, type InsertWaitlistSignup } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistSignup(signup: InsertWaitlistSignup): Promise<WaitlistSignup>;
  getWaitlistSignupByEmail(email: string): Promise<WaitlistSignup | undefined>;
  getAllWaitlistSignups(): Promise<WaitlistSignup[]>;
}

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
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistSignup(signup: InsertWaitlistSignup): Promise<WaitlistSignup> {
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

  async getWaitlistSignupByEmail(email: string): Promise<WaitlistSignup | undefined> {
    return Array.from(this.waitlistSignups.values()).find(
      (signup) => signup.email === email,
    );
  }

  async getAllWaitlistSignups(): Promise<WaitlistSignup[]> {
    return Array.from(this.waitlistSignups.values());
  }
}

export const storage = new MemStorage();
