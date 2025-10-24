import logoUrl from "@assets/EduStar Consult - new Logo copy_1761225652958.png";

export function FormHeader() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-card-border shadow-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center">
        <img 
          src={logoUrl} 
          alt="EduStar Consult" 
          className="h-16 sm:h-20 mx-auto mb-3"
        />
        <p className="text-lg italic text-primary font-medium">
          Unleashing Stars Through Education
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          GA-3925815 ADJACENT LAS PALMAS NII BOI TOWN
        </p>
      </div>
    </header>
  );
}
