import { Award, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";

const certificates = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2025",
    instructor: "Sarah Johnson",
    completedDate: "Feb 15, 2025",
    credentialId: "NA-WD-2025-78432",
  },
];

const inProgress = [
  { id: 2, title: "Machine Learning & AI Masterclass", progress: 42 },
  { id: 3, title: "UI/UX Design: From Wireframe to Prototype", progress: 89 },
  { id: 4, title: "Advanced React & TypeScript Patterns", progress: 15 },
];

const StudentCertificates = () => {
  return (
    <DashboardLayout type="student">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Certificates</h1>
        <p className="text-body text-muted-foreground mt-1">Your earned certificates and credentials</p>
      </div>

      {/* Earned */}
      <h2 className="text-h3 text-foreground mb-4">Earned Certificates</h2>
      {certificates.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-card rounded-card card-shadow overflow-hidden hover-lift">
              <div className="h-32 gradient-primary flex items-center justify-center relative">
                <Award size={48} className="text-primary-foreground/50" />
                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium text-primary">
                  Verified
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-small font-semibold text-card-foreground mb-1">{cert.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">By {cert.instructor}</p>
                <p className="text-xs text-muted-foreground mb-3">Completed {cert.completedDate}</p>
                <div className="text-[10px] text-muted-foreground font-mono mb-4">ID: {cert.credentialId}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-button flex-1 text-xs">
                    <Eye size={12} className="mr-1" /> View
                  </Button>
                  <Button size="sm" className="rounded-button flex-1 text-xs gradient-primary border-0 text-primary-foreground hover:opacity-90">
                    <Download size={12} className="mr-1" /> Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-card card-shadow p-10 text-center mb-10">
          <Award size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-body text-muted-foreground">No certificates earned yet. Complete a course to earn your first certificate!</p>
        </div>
      )}

      {/* In Progress */}
      <h2 className="text-h3 text-foreground mb-4">Almost There</h2>
      <div className="space-y-3">
        {inProgress.map((c) => (
          <div key={c.id} className="bg-card rounded-card card-shadow p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Award size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-small font-medium text-card-foreground truncate">{c.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 rounded-full bg-muted max-w-[200px]">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${c.progress}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{c.progress}%</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{100 - c.progress}% remaining</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
