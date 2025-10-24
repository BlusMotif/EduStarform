// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import mongoose, { Schema } from "mongoose";
import { z } from "zod";
var SubmissionSchema = new Schema({
  referenceNumber: { type: String, required: true, unique: true },
  // Section 1: Personal Details
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  nationality: { type: String, required: true },
  currentCountry: { type: String, required: true },
  passportNumber: { type: String, required: true },
  // Section 2: Educational Background
  educationLevel: { type: String, required: true },
  educationLevelOther: String,
  institutionName: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  graduationYear: { type: String, required: true },
  // Section 3: Study Abroad Journey
  institutionsPreference: { type: String, required: true },
  programType: { type: String, required: true },
  programTypeOther: String,
  fieldOfStudyAbroad: { type: String, required: true },
  studyReasons: { type: [String], required: true },
  studyReasonsOther: String,
  fundingMethod: { type: String, required: true },
  fundingMethodOther: String,
  // Section 4: Challenges & Insights
  challenges: { type: [String], required: true },
  challengesOther: String,
  // Section 5: Additional Information
  openToContact: { type: Boolean, required: true, default: false },
  contactMethod: String,
  contactMethodOther: String,
  // Emergency Contact Details
  emergencyName: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  emergencyAddress: { type: String, required: true },
  emergencyEmail: { type: String, required: true },
  emergencyCountry: { type: String, required: true },
  emergencyRelationship: { type: String, required: true },
  emergencyProvince: { type: String, required: true },
  emergencyCity: { type: String, required: true },
  // Language Test Scores
  ieltsScore: String,
  satScore: String,
  pteScore: String,
  greScore: String
}, {
  timestamps: true
});
var SubmissionModel = mongoose.model("Submission", SubmissionSchema);
var insertSubmissionSchema = z.object({
  referenceNumber: z.string().min(1, "Reference number is required"),
  // Section 1: Personal Details
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(5, "Phone number must include country code"),
  nationality: z.string().min(1, "Nationality is required"),
  currentCountry: z.string().min(1, "Current country is required"),
  passportNumber: z.string().min(3, "Passport number is required"),
  // Section 2: Educational Background
  educationLevel: z.string().min(1, "Education level is required"),
  educationLevelOther: z.string().optional(),
  institutionName: z.string().min(1, "Institution name is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  graduationYear: z.string().min(1, "Graduation year is required"),
  // Section 3: Study Abroad Journey
  institutionsPreference: z.string().min(1, "Institutions preference is required"),
  programType: z.string().min(1, "Program type is required"),
  programTypeOther: z.string().optional(),
  fieldOfStudyAbroad: z.string().min(1, "Field of study abroad is required"),
  studyReasons: z.array(z.string()).min(1, "Please select at least one reason"),
  studyReasonsOther: z.string().optional(),
  fundingMethod: z.string().min(1, "Funding method is required"),
  fundingMethodOther: z.string().optional(),
  // Section 4: Challenges & Insights
  challenges: z.array(z.string()).min(1, "Please select at least one challenge"),
  challengesOther: z.string().optional(),
  // Section 5: Additional Information
  openToContact: z.boolean().default(false),
  contactMethod: z.string().optional(),
  contactMethodOther: z.string().optional(),
  // Emergency Contact Details
  emergencyName: z.string().min(1, "Emergency name is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  emergencyAddress: z.string().min(1, "Emergency address is required"),
  emergencyEmail: z.string().email("Invalid emergency email"),
  emergencyCountry: z.string().min(1, "Emergency country is required"),
  emergencyRelationship: z.string().min(1, "Emergency relationship is required"),
  emergencyProvince: z.string().min(1, "Emergency province is required"),
  emergencyCity: z.string().min(1, "Emergency city is required"),
  // Language Test Scores
  ieltsScore: z.string().optional(),
  satScore: z.string().optional(),
  pteScore: z.string().optional(),
  greScore: z.string().optional()
}).refine(
  (data) => {
    if (data.openToContact && !data.contactMethod) {
      return false;
    }
    return true;
  },
  {
    message: "Contact method is required when open to contact",
    path: ["contactMethod"]
  }
);

// server/storage.ts
import { nanoid } from "nanoid";
function generateReferenceNumber() {
  return `EDU-${nanoid(6).toUpperCase()}`;
}
var DatabaseStorage = class {
  async createSubmission(insertSubmission) {
    const referenceNumber = insertSubmission.referenceNumber || generateReferenceNumber();
    const submissionData = {
      ...insertSubmission,
      referenceNumber
    };
    const submission = new SubmissionModel(submissionData);
    await submission.save();
    return submission;
  }
  async getSubmissionByReference(referenceNumber) {
    const submission = await SubmissionModel.findOne({ referenceNumber });
    return submission || void 0;
  }
  async getAllSubmissions() {
    const submissions = await SubmissionModel.find().sort({ createdAt: -1 });
    return submissions;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.post("/api/submissions", async (req, res) => {
    try {
      console.log("Received submission data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      res.json({
        id: submission.id,
        referenceNumber: submission.referenceNumber
      });
    } catch (error) {
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
  app2.get("/api/submissions", async (_req, res) => {
    try {
      const submissions = await storage.getAllSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });
  app2.get("/api/submissions/:referenceNumber", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/db.ts
import mongoose2 from "mongoose";
var MONGO_URI = process.env.MONGO_URI || "mongodb+srv://12sonjames:5l7bHtMCObabkycf@cluster0.fa8fd.mongodb.net/EDUSTARCONSULT_db?retryWrites=true&w=majority&appName=Cluster0";
if (!process.env.MONGO_URI) {
  console.warn("MONGO_URI not set, using default connection string");
}
var connectDB = async () => {
  try {
    await mongoose2.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
var db = mongoose2.connection;

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await connectDB();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
