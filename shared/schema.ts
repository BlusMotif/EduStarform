import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// Study Abroad Questionnaire Submissions
export interface ISubmission extends Document {
  id: string;
  referenceNumber: string;

  // Section 1: Personal Details
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  currentCountry: string;
  passportNumber: string;

  // Section 2: Educational Background
  educationLevel: string;
  educationLevelOther?: string;
  institutionName: string;
  fieldOfStudy: string;
  graduationYear: string;

  // Section 3: Challenges & Insights
  challenges: string[];
  challengesOther?: string;

  // Section 4: Additional Information
  openToContact: boolean;
  contactMethod?: string;
  contactMethodOther?: string;

  // Emergency Contact Details
  emergencyName: string;
  emergencyContact: string;
  emergencyAddress: string;
  emergencyEmail: string;
  emergencyCountry: string;
  emergencyRelationship: string;
  emergencyProvince: string;
  emergencyCity: string;

  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
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

  // Section 3: Challenges & Insights
  challenges: { type: [String], required: true },
  challengesOther: String,

  // Section 4: Additional Information
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
}, {
  timestamps: true,
});

export const SubmissionModel = mongoose.model<ISubmission>('Submission', SubmissionSchema);

export const insertSubmissionSchema = z.object({
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

  // Section 3: Challenges & Insights
  challenges: z.array(z.string()).min(1, "Please select at least one challenge"),
  challengesOther: z.string().optional(),

  // Section 4: Additional Information
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
}).refine(
  (data) => {
    if (data.openToContact && !data.contactMethod) {
      return false;
    }
    return true;
  },
  {
    message: "Contact method is required when open to contact",
    path: ["contactMethod"],
  }
);

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = ISubmission;
