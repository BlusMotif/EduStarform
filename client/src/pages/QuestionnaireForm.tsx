import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { FormHeader } from "@/components/FormHeader";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { FormSection } from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { nanoid } from "nanoid";

const formSchema = z.object({
  // Section 1: Personal Details
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"], { required_error: "Please select your gender" }),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(5, "Phone number must include country code"),
  nationality: z.string().min(1, "Nationality is required"),
  currentCountry: z.string().min(1, "Current country is required"),
  passportNumber: z.string().min(3, "Passport number is required"),
  
  // Section 2: Educational Background
  educationLevel: z.string().min(1, "Please select your education level"),
  educationLevelOther: z.string().optional(),
  institutionName: z.string().min(1, "Institution name is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  graduationYear: z.string().min(4, "Graduation year is required"),
  
  // Section 3: Study Abroad Journey
  institutionsPreference: z.string().min(1, "Please list your preferred institutions"),
  programType: z.string().min(1, "Please select a program type"),
  programTypeOther: z.string().optional(),
  fieldOfStudyAbroad: z.string().min(1, "Field of study abroad is required"),
  studyReasons: z.array(z.string()).min(1, "Please select at least one reason"),
  studyReasonsOther: z.string().optional(),
  fundingMethod: z.string().min(1, "Please select a funding method"),
  fundingMethodOther: z.string().optional(),
  
  // Section 4: Challenges
  challenges: z.array(z.string()).min(1, "Please select at least one challenge"),
  challengesOther: z.string().optional(),
  
  // Section 5: Additional Information
  openToContact: z.boolean(),
  contactMethod: z.string().optional(),
  contactMethodOther: z.string().optional(),
  
  // Emergency Contact
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyContact: z.string().min(1, "Emergency contact number is required"),
  emergencyAddress: z.string().min(1, "Emergency contact address is required"),
  emergencyEmail: z.string().email("Invalid email address"),
  emergencyCountry: z.string().min(1, "Emergency contact country is required"),
  emergencyRelationship: z.string().min(1, "Relationship is required"),
  emergencyProvince: z.string().min(1, "Province/State is required"),
  emergencyCity: z.string().min(1, "City is required"),
  
  // Language Tests
  ieltsScore: z.string().optional(),
  satScore: z.string().optional(),
  pteScore: z.string().optional(),
  greScore: z.string().optional(),
}).refine(
  (data) => {
    if (data.openToContact && !data.contactMethod) {
      return false;
    }
    return true;
  },
  {
    message: "Please select a contact method",
    path: ["contactMethod"],
  }
).refine(
  (data) => {
    if (data.educationLevel === "Other" && !data.educationLevelOther?.trim()) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify your education level",
    path: ["educationLevelOther"],
  }
).refine(
  (data) => {
    if (data.programType === "Other" && !data.programTypeOther?.trim()) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify your program type",
    path: ["programTypeOther"],
  }
).refine(
  (data) => {
    if (data.studyReasons?.includes("Other") && !data.studyReasonsOther?.trim()) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify your study reasons",
    path: ["studyReasonsOther"],
  }
).refine(
  (data) => {
    if (data.fundingMethod === "Other" && !data.fundingMethodOther?.trim()) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify your funding method",
    path: ["fundingMethodOther"],
  }
).refine(
  (data) => {
    if (data.challenges?.includes("Other") && !data.challengesOther?.trim()) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify your challenges",
    path: ["challengesOther"],
  }
).refine(
  (data) => {
    if (data.contactMethod === "Other" && !data.contactMethodOther?.trim()) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify your contact method",
    path: ["contactMethodOther"],
  }
);

type FormData = z.infer<typeof formSchema>;

const educationLevels = [
  "High school/Secondary School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD/Doctorate",
  "Other",
];

const programTypes = [
  "Undergraduate",
  "Postgraduate",
  "Short-term course/Exchange program",
  "Language course",
  "Other",
];

const studyReasonsOptions = [
  "Higher quality education",
  "Career opportunities",
  "Cultural experience",
  "Personal development",
  "Language improvement",
  "Scholarships/Financial aid",
  "Other",
];

const fundingMethods = [
  "Self-funded",
  "Family support",
  "Scholarship",
  "Student loan",
  "Other",
];

const challengesOptions = [
  "Visa process",
  "Financial difficulties",
  "Language barrier",
  "Cultural adjustment",
  "Academic pressure",
  "Homesickness",
  "Finding accommodation",
  "Other",
];

const contactMethods = [
  "Email",
  "Phone/WhatsApp",
  "Other",
];

export default function QuestionnaireForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      gender: undefined,
      email: "",
      phoneNumber: "",
      nationality: "",
      currentCountry: "",
      passportNumber: "",
      educationLevel: "",
      educationLevelOther: "",
      institutionName: "",
      fieldOfStudy: "",
      graduationYear: "",
      institutionsPreference: "",
      programType: "",
      programTypeOther: "",
      fieldOfStudyAbroad: "",
      studyReasons: [],
      studyReasonsOther: "",
      fundingMethod: "",
      fundingMethodOther: "",
      challenges: [],
      challengesOther: "",
      openToContact: false,
      contactMethod: "",
      contactMethodOther: "",
      emergencyName: "",
      emergencyContact: "",
      emergencyAddress: "",
      emergencyEmail: "",
      emergencyCountry: "",
      emergencyRelationship: "",
      emergencyProvince: "",
      emergencyCity: "",
      ieltsScore: "",
      satScore: "",
      pteScore: "",
      greScore: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const referenceNumber = `EDU-${nanoid(6).toUpperCase()}`;
      const submissionData = { ...data, referenceNumber };
      const res = await apiRequest("POST", "/api/submissions", submissionData);
      return await res.json();
    },
    onSuccess: (data: { id: string; referenceNumber: string }) => {
      setLocation(`/success?ref=${data.referenceNumber}`);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ["fullName", "dateOfBirth", "gender", "email", "phoneNumber", "nationality", "currentCountry", "passportNumber"];
      case 2:
        return ["educationLevel", "institutionName", "fieldOfStudy", "graduationYear"];
      case 3:
        return ["institutionsPreference", "programType", "fieldOfStudyAbroad", "studyReasons", "fundingMethod"];
      case 4:
        return ["challenges"];
      case 5:
        return ["emergencyName", "emergencyContact", "emergencyAddress", "emergencyEmail", "emergencyCountry", "emergencyRelationship", "emergencyProvince", "emergencyCity"];
      case 6:
        return ["ieltsScore", "satScore", "pteScore", "greScore"];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FormHeader />
      <ProgressIndicator currentStep={currentStep} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Personal Details */}
            {currentStep === 1 && (
              <FormSection 
                title="Section 1: Personal Details"
                description="Please provide your personal information"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          data-testid="input-fullName"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          data-testid="input-dateOfBirth"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                          data-testid="radio-gender"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id="male" data-testid="radio-gender-male" />
                            <Label htmlFor="male" className="cursor-pointer">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id="female" data-testid="radio-gender-female" />
                            <Label htmlFor="female" className="cursor-pointer">Female</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          data-testid="input-email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (with country code) <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="+1 234 567 8900" 
                          data-testid="input-phoneNumber"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Ghanaian" 
                            data-testid="input-nationality"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Country of Residence <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Ghana" 
                            data-testid="input-currentCountry"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="passportNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Number <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your passport number" 
                          data-testid="input-passportNumber"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            )}

            {/* Section 2: Educational Background */}
            {currentStep === 2 && (
              <FormSection 
                title="Section 2: Educational Background"
                description="Tell us about your educational history"
              >
                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Level of Education Completed <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                          data-testid="radio-educationLevel"
                        >
                          {educationLevels.map((level) => (
                            <div key={level} className="flex items-center space-x-2">
                              <RadioGroupItem value={level} id={level} data-testid={`radio-educationLevel-${level.replace(/\s+/g, '-').toLowerCase()}`} />
                              <Label htmlFor={level} className="cursor-pointer font-normal">{level}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("educationLevel") === "Other" && (
                  <FormField
                    control={form.control}
                    name="educationLevelOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify your education level" data-testid="input-educationLevelOther" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Institution(s) Attended <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter institution name" 
                          data-testid="input-institutionName"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Computer Science, Business Administration" 
                          data-testid="input-fieldOfStudy"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="e.g., 2023" 
                          maxLength={4}
                          data-testid="input-graduationYear"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            )}

            {/* Section 3: Study Abroad Journey */}
            {currentStep === 3 && (
              <FormSection 
                title="Section 3: Study Abroad Journey"
                description="Share your study abroad preferences and goals"
              >
                <FormField
                  control={form.control}
                  name="institutionsPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List of Institutions of Preference <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List your preferred universities or institutions (one per line)"
                          className="min-h-24"
                          data-testid="input-institutionsPreference"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="programType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Type <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                          data-testid="radio-programType"
                        >
                          {programTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <RadioGroupItem value={type} id={type} data-testid={`radio-programType-${type.replace(/\s+/g, '-').toLowerCase()}`} />
                              <Label htmlFor={type} className="cursor-pointer font-normal">{type}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("programType") === "Other" && (
                  <FormField
                    control={form.control}
                    name="programTypeOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify your program type" data-testid="input-programTypeOther" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="fieldOfStudyAbroad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study Abroad <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Data Science, International Business" 
                          data-testid="input-fieldOfStudyAbroad"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studyReasons"
                  render={() => (
                    <FormItem>
                      <FormLabel>Main Reason for Studying Abroad (select all that apply) <span className="text-destructive">*</span></FormLabel>
                      <div className="space-y-3">
                        {studyReasonsOptions.map((reason) => (
                          <FormField
                            key={reason}
                            control={form.control}
                            name="studyReasons"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(reason)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...(field.value || []), reason]
                                        : field.value?.filter((value) => value !== reason) || [];
                                      field.onChange(newValue);
                                    }}
                                    data-testid={`checkbox-studyReasons-${reason.replace(/\s+/g, '-').toLowerCase()}`}
                                  />
                                </FormControl>
                                <Label className="cursor-pointer font-normal">{reason}</Label>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("studyReasons")?.includes("Other") && (
                  <FormField
                    control={form.control}
                    name="studyReasonsOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify your reason" data-testid="input-studyReasonsOther" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="fundingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How will you fund your studies abroad? <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                          data-testid="radio-fundingMethod"
                        >
                          {fundingMethods.map((method) => (
                            <div key={method} className="flex items-center space-x-2">
                              <RadioGroupItem value={method} id={method} data-testid={`radio-fundingMethod-${method.replace(/\s+/g, '-').toLowerCase()}`} />
                              <Label htmlFor={method} className="cursor-pointer font-normal">{method}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("fundingMethod") === "Other" && (
                  <FormField
                    control={form.control}
                    name="fundingMethodOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify your funding method" data-testid="input-fundingMethodOther" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </FormSection>
            )}

            {/* Section 4: Challenges & Insights */}
            {currentStep === 4 && (
              <FormSection 
                title="Section 4: Challenges & Insights"
                description="Help us understand potential challenges you may face"
              >
                <FormField
                  control={form.control}
                  name="challenges"
                  render={() => (
                    <FormItem>
                      <FormLabel>What were/are your biggest challenges related to studying abroad? (select all that apply) <span className="text-destructive">*</span></FormLabel>
                      <div className="space-y-3">
                        {challengesOptions.map((challenge) => (
                          <FormField
                            key={challenge}
                            control={form.control}
                            name="challenges"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(challenge)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...(field.value || []), challenge]
                                        : field.value?.filter((value) => value !== challenge) || [];
                                      field.onChange(newValue);
                                    }}
                                    data-testid={`checkbox-challenges-${challenge.replace(/\s+/g, '-').toLowerCase()}`}
                                  />
                                </FormControl>
                                <Label className="cursor-pointer font-normal">{challenge}</Label>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("challenges")?.includes("Other") && (
                  <FormField
                    control={form.control}
                    name="challengesOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify your challenges" data-testid="input-challengesOther" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="openToContact"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-openToContact"
                        />
                      </FormControl>
                      <Label className="cursor-pointer font-normal">
                        Would you be open to being contacted for a follow-up interview or testimonial?
                      </Label>
                    </FormItem>
                  )}
                />

                {form.watch("openToContact") && (
                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred method of contact</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                            data-testid="radio-contactMethod"
                          >
                            {contactMethods.map((method) => (
                              <div key={method} className="flex items-center space-x-2">
                                <RadioGroupItem value={method} id={method} data-testid={`radio-contactMethod-${method.replace(/\s+/g, '-').toLowerCase()}`} />
                                <Label htmlFor={method} className="cursor-pointer font-normal">{method}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("contactMethod") === "Other" && (
                  <FormField
                    control={form.control}
                    name="contactMethodOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify your preferred contact method" data-testid="input-contactMethodOther" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </FormSection>
            )}

            {/* Section 5: Emergency Contact */}
            {currentStep === 5 && (
              <FormSection 
                title="Emergency Contact Details"
                description="Provide information for your emergency contact"
              >
                <FormField
                  control={form.control}
                  name="emergencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Emergency contact full name" 
                          data-testid="input-emergencyName"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Emergency contact phone number" 
                          data-testid="input-emergencyContact"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="emergency.contact@example.com" 
                          data-testid="input-emergencyEmail"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Parent, Spouse, Sibling" 
                          data-testid="input-emergencyRelationship"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residence Address <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Full residential address" 
                          data-testid="input-emergencyAddress"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="emergencyCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Country" 
                            data-testid="input-emergencyCountry"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyProvince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province/State <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Province or State" 
                            data-testid="input-emergencyProvince"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="emergencyCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="City" 
                          data-testid="input-emergencyCity"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            )}

            {/* Section 6: Language Tests */}
            {currentStep === 6 && (
              <FormSection
                title="English Language Test Scores"
                description="Provide your language test scores (optional)"
              >
                <p className="text-sm text-muted-foreground mb-6">
                  If you have taken any of the following language proficiency tests, please provide your scores.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ieltsScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IELTS Score</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 7.5"
                            data-testid="input-ieltsScore"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="satScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SAT Score</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 1450"
                            data-testid="input-satScore"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pteScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PTE Score</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 65"
                            data-testid="input-pteScore"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="greScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GRE Score</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 320"
                            data-testid="input-greScore"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-6">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="gap-2"
                  data-testid="button-previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-2 ml-auto"
                  data-testid="button-next"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={async () => {
                    const isValid = await form.trigger(["ieltsScore", "satScore", "pteScore", "greScore"]);
                    if (isValid) {
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  className="gap-2 ml-auto"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      Submit Form
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
