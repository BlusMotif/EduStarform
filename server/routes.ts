import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit a new questionnaire
  app.post("/api/submissions", async (req, res) => {
    try {
      console.log("Received submission data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      
      res.json({
        id: submission.id,
        referenceNumber: submission.referenceNumber,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        console.error("Zod errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message,
          errors: error.errors
        });
      }
      
      console.error("Error creating submission:", error);
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  // Get all submissions (for admin dashboard)
  app.get("/api/submissions", async (_req, res) => {
    try {
      const submissions = await storage.getAllSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Get a specific submission by reference number
  app.get("/api/submissions/:referenceNumber", async (req, res) => {
    try {
      const { referenceNumber } = req.params;
      const submission = await storage.getSubmissionByReference(referenceNumber);
      
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
