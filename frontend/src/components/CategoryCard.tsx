import { Globe, BarChart3, Palette, Smartphone, Megaphone, Cloud, Shield, Briefcase } from "lucide-react";
import type { Category } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Globe, BarChart3, Palette, Smartphone, Megaphone, Cloud, Shield, Briefcase,
};

const CategoryCard = ({ category }: { category: Category }) => {
  const Icon = iconMap[category.icon] || Globe;
  return (
    <div className="bg-card rounded-card card-shadow hover-lift p-6 text-center group cursor-pointer">
      <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
        <Icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
      <h3 className="text-body font-semibold text-card-foreground">{category.name}</h3>
      <p className="text-small text-muted-foreground mt-1">{category.courseCount} Courses</p>
    </div>
  );
};

export default CategoryCard;
