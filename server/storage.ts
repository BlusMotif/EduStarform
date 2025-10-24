import { SubmissionModel, type Submission, type InsertSubmission } from "@shared/schema";
import { nanoid } from "nanoid";

// Generate reference number (e.g., EDU-ABC123)
function generateReferenceNumber(): string {
  return `EDU-${nanoid(6).toUpperCase()}`;
}

export interface IStorage {
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionByReference(referenceNumber: string): Promise<Submission | undefined>;
  getAllSubmissions(): Promise<Submission[]>;
}

export class DatabaseStorage implements IStorage {
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const referenceNumber = insertSubmission.referenceNumber || generateReferenceNumber();

    const submissionData = {
      ...insertSubmission,
      referenceNumber,
    };

    const submission = new SubmissionModel(submissionData);
    await submission.save();

    return submission;
  }

  async getSubmissionByReference(referenceNumber: string): Promise<Submission | undefined> {
    const submission = await SubmissionModel.findOne({ referenceNumber });
    return submission || undefined;
  }

  async getAllSubmissions(): Promise<Submission[]> {
    const submissions = await SubmissionModel.find().sort({ createdAt: -1 });
    return submissions;
  }
}

export const storage = new DatabaseStorage();
