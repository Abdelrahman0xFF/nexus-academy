import { Plus } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/lib/data";

const AdminCategories = () => {
  return (
    <DashboardLayout type="admin">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-foreground">Categories</h1>
          <p className="text-body text-muted-foreground mt-1">Manage course categories and groupings</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground rounded-button">
          <Plus size={16} className="mr-2" /> Create Category
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="relative group">
            <CategoryCard category={cat} />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
               {/* Adding a small overlay for admin actions since CategoryCard might not have them */}
               <div className="bg-card/80 backdrop-blur-sm rounded-md shadow-sm border border-border p-1 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-destructive">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </Button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminCategories;
