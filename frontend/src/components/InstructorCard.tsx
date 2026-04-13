import { Users, BookOpen, Star } from "lucide-react";
import type { Instructor } from "@/lib/data";

const InstructorCard = ({ instructor }: { instructor: Instructor }) => {
  return (
    <div className="bg-card rounded-card card-shadow hover-lift p-6 text-center group">
      <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-primary-foreground">
          {instructor.name.split(" ").map((n) => n[0]).join("")}
        </span>
      </div>
      <h3 className="text-body font-semibold text-card-foreground group-hover:text-primary transition-colors">
        {instructor.name}
      </h3>
      <p className="text-small text-muted-foreground mt-1 mb-4">{instructor.title}</p>
      <div className="flex items-center justify-center gap-4 text-small text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star size={14} className="fill-amber-400 text-amber-400" /> {instructor.rating}
        </span>
        <span className="flex items-center gap-1">
          <BookOpen size={14} /> {instructor.courses}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} /> {(instructor.students / 1000).toFixed(0)}k
        </span>
      </div>
    </div>
  );
};

export default InstructorCard;
