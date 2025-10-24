import { useQuery } from "@tanstack/react-query";
import { FormHeader } from "@/components/FormHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2 } from "lucide-react";
import { Link } from "wouter";
import type { Submission } from "@shared/schema";

export default function AdminDashboard() {
  const { data: submissions, isLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  const exportToCSV = () => {
    if (!submissions || submissions.length === 0) return;

    const headers = [
      "Reference Number",
      "Full Name",
      "Email",
      "Phone Number",
      "Date of Birth",
      "Gender",
      "Nationality",
      "Current Country",
      "Passport Number",
      "Education Level",
      "Institution",
      "Field of Study",
      "Graduation Year",
      "Institutions Preference",
      "Program Type",
      "Field of Study Abroad",
      "Study Reasons",
      "Funding Method",
      "Challenges",
      "Open to Contact",
      "Contact Method",
      "Emergency Name",
      "Emergency Contact",
      "Emergency Email",
      "Emergency Country",
      "Emergency City",
      "IELTS",
      "SAT",
      "PTE",
      "GRE",
      "Submitted At",
    ];

    const rows = submissions.map((sub) => [
      sub.referenceNumber,
      sub.fullName,
      sub.email,
      sub.phoneNumber,
      sub.dateOfBirth,
      sub.gender,
      sub.nationality,
      sub.currentCountry,
      sub.passportNumber,
      sub.educationLevel,
      sub.institutionName,
      sub.fieldOfStudy,
      sub.graduationYear,
      sub.institutionsPreference,
      sub.programType,
      sub.fieldOfStudyAbroad,
      Array.isArray(sub.studyReasons) ? sub.studyReasons.join(", ") : sub.studyReasons,
      sub.fundingMethod,
      Array.isArray(sub.challenges) ? sub.challenges.join(", ") : sub.challenges,
      sub.openToContact ? "Yes" : "No",
      sub.contactMethod || "",
      sub.emergencyName,
      sub.emergencyContact,
      sub.emergencyEmail,
      sub.emergencyCountry,
      sub.emergencyCity,
      sub.ieltsScore || "",
      sub.satScore || "",
      sub.pteScore || "",
      sub.greScore || "",
      new Date(sub.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `edustar-submissions-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <FormHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all questionnaire submissions
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={!submissions || submissions.length === 0}
              className="gap-2"
              data-testid="button-export"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </Button>
            <Link href="/">
              <Button variant="default" data-testid="button-newSubmission">
                New Submission
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              All Submissions ({submissions?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : submissions && submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference #</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nationality</TableHead>
                      <TableHead>Program Type</TableHead>
                      <TableHead>Field of Study</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow 
                        key={submission.id}
                        data-testid={`row-submission-${submission.referenceNumber}`}
                      >
                        <TableCell className="font-mono text-sm font-medium text-primary">
                          {submission.referenceNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {submission.fullName}
                        </TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.nationality}</TableCell>
                        <TableCell>{submission.programType}</TableCell>
                        <TableCell>{submission.fieldOfStudyAbroad}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No submissions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
