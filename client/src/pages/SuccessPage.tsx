import { useLocation, Link } from "wouter";
import { CheckCircle, Copy, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "@/components/FormHeader";
import { useToast } from "@/hooks/use-toast";

export default function SuccessPage() {
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);
  const referenceNumber = params.get("ref") || "N/A";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceNumber);
    toast({
      title: "Copied!",
      description: "Reference number copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <FormHeader />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-primary" data-testid="icon-success" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Thank You!
              </h1>
              <p className="text-muted-foreground text-lg">
                Your questionnaire has been submitted successfully
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Your Reference Number
              </p>
              <div className="flex items-center justify-center gap-3">
                <code 
                  className="text-2xl font-mono font-semibold text-primary bg-card px-4 py-2 rounded-md"
                  data-testid="text-referenceNumber"
                >
                  {referenceNumber}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  data-testid="button-copy"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Please save this reference number for your records
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Our team at EduStar Consult will review your application and contact you soon. 
                We're excited to help you on your study abroad journey!
              </p>
            </div>

            <Link href="/">
              <Button className="gap-2 mt-6" data-testid="button-home">
                <Home className="w-4 h-4" />
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
