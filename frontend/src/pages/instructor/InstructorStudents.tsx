import { Users, Search, Mail, MoreHorizontal } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";

const students = [
  { id: 1, name: "David Martinez", email: "david@example.com", enrolled: 3, progress: 72, joined: "Jan 15, 2025" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", enrolled: 2, progress: 89, joined: "Feb 3, 2025" },
  { id: 3, name: "Tom Anderson", email: "tom@example.com", enrolled: 1, progress: 45, joined: "Feb 20, 2025" },
  { id: 4, name: "Maria Garcia", email: "maria@example.com", enrolled: 4, progress: 95, joined: "Dec 10, 2024" },
  { id: 5, name: "James Lee", email: "james@example.com", enrolled: 2, progress: 33, joined: "Mar 1, 2025" },
  { id: 6, name: "Sophie Chen", email: "sophie@example.com", enrolled: 1, progress: 61, joined: "Jan 28, 2025" },
  { id: 7, name: "Alex Kim", email: "alex@example.com", enrolled: 3, progress: 78, joined: "Nov 15, 2024" },
  { id: 8, name: "Emma Wilson", email: "emma@example.com", enrolled: 2, progress: 52, joined: "Feb 14, 2025" },
];

const InstructorStudents = () => {
  return (
    <DashboardLayout type="instructor">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-foreground">Students</h1>
          <p className="text-body text-muted-foreground mt-1">View and manage your enrolled students</p>
        </div>
        <div className="flex items-center gap-2 text-small text-muted-foreground">
          <Users size={16} className="text-primary" />
          <span className="font-semibold text-foreground">{students.length}</span> total students
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search students by name or email..."
          className="w-full max-w-md pl-10 pr-4 py-2.5 text-small bg-card rounded-button border border-border outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-card card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Student</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3 hidden md:table-cell">Courses</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3">Progress</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase px-6 py-3 hidden lg:table-cell">Joined</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {s.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <div className="text-small font-medium text-card-foreground">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-small text-card-foreground">{s.enrolled}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted max-w-[100px]">
                        <div className="h-full rounded-full gradient-primary" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-small text-muted-foreground">{s.joined}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"><Mail size={16} /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorStudents;
