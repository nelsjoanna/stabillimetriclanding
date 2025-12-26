import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const waitlistSignups = pgTable("waitlist_signups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number"),
  companyName: text("company_name").notNull(),
  role: text("role"),
  companySize: text("company_size"),
  isPilotPartner: boolean("is_pilot_partner").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSignupSchema = createInsertSchema(waitlistSignups).omit({
  id: true,
  createdAt: true,
});

export type InsertWaitlistSignup = z.infer<typeof insertWaitlistSignupSchema>;
export type WaitlistSignup = typeof waitlistSignups.$inferSelect;

export const ingredients = pgTable("ingredients", {
  id: varchar("id").primaryKey(),
  tradeName: text("trade_name").notNull(),
  inciName: text("inci_name").notNull(),
  supplier: text("supplier").notNull(),
  physicalForm: text("physical_form").notNull(),
  function: text("function").notNull(),
  chemicalClass: text("chemical_class").notNull(),
  charge: text("charge").notNull(),
  solubility: text("solubility").notNull(),
  phMin: real("ph_min"),
  phMax: real("ph_max"),
  hlb: real("hlb"),
  requiredHlb: real("required_hlb"),
  iodineValue: real("iodine_value"),
  oxidationRisk: text("oxidation_risk").notNull(),
  pka: real("pka"),
  processTemp: text("process_temp").notNull(),
  notes: text("notes"),
});

export const insertIngredientSchema = createInsertSchema(ingredients);
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;
