import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { insertWaitlistSignupSchema } from "../../shared/schema";
import { z } from "zod";
import { MemStorage } from "../../server/storage";

// In-memory storage (resets on each function invocation in serverless)
// For production, you should use a database like PostgreSQL, Fauna, or Supabase
const memStorage = new MemStorage();

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const parsed = insertWaitlistSignupSchema.parse(body);

      const existing = await memStorage.getWaitlistSignupByEmail(parsed.email);
      if (existing) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({
            error: "This email is already on the waitlist",
          }),
        };
      }

      const signup = await memStorage.createWaitlistSignup(parsed);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(signup),
      };
    }

    if (event.httpMethod === "GET") {
      const signups = await memStorage.getAllWaitlistSignups();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(signups),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid request data",
          details: error.errors,
        }),
      };
    }

    console.error("Waitlist error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to process request" }),
    };
  }
};
