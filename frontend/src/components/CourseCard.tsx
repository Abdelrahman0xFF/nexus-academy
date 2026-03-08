import { Users, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import type { Course } from "@/lib/data";

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

const CourseCard = ({ course, showProgress = false }: CourseCardProps) => {
  return (
    <Link to={`/courses/${course.id}`} className="block group">
      <div className="bg-card rounded-card card-shadow hover-lift overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-muted">
          <div className="absolute inset-0 gradient-primary opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="text-primary-foreground" size={48} strokeWidth={1} />
          </div>
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-card/90 text-foreground backdrop-blur-sm">
              {course.level}
            </span>
          </div>
          {course.originalPrice && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-destructive text-destructive-foreground">
                {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <span className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">
            {course.category}
          </span>
          <h3 className="text-body font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <span className="flex flex-row justify-start items-center">
            <p className="text-small text-muted-foreground">{course.instructor}</p>
            <RatingStars rating={course.rating} reviewCount={course.reviewCount} size={14} />
          </span>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={13} /> {course.students.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {course.duration}
            </span>
          </div>

          {showProgress && course.progress !== undefined ? (
            <div className="mt-auto pt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-primary">{course.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full gradient-primary" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="mt-auto pt-4 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">${course.price}</span>
                {course.originalPrice && (
                  <span className="text-small text-muted-foreground line-through">${course.originalPrice}</span>
                )}
              </div>
              <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View Course →
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
