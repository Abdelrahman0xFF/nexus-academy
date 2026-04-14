import {
  ArrowRight,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Star,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import CourseCard from "@/components/CourseCard";
import InstructorCard from "@/components/InstructorCard";
import CategoryCard from "@/components/CategoryCard";
import RatingStars from "@/components/RatingStars";
import ScrollReveal from "@/components/ScrollReveal";
import { courses, instructors, categories, testimonials } from "@/lib/data";
import heroImage from "@/assets/landing-img.svg";
import Marquee from "@/components/Marquee";

const Landing = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden h-[calc(100vh_-_65px)] flex items-center">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-small font-medium mb-6">
                <TrendingUp size={14} /> #1 Learning Platform in 2025
              </div>
              <h1 className="text-h1 lg:text-5xl font-extrabold text-foreground leading-tight mb-6">
                Unlock Your Potential with{" "}
                <span className="gradient-text">World-Class</span> Courses
              </h1>
              <p className="text-body text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Join over 100,000+ learners mastering new skills with expert-led
                courses. From coding to design, advance your career with
                NexusAcademy.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/courses">
                  <Button
                    size="lg"
                    className="gradient-primary border-0 text-primary-foreground rounded-button px-8 hover:opacity-90 transition-opacity"
                  >
                    Explore Courses <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-button px-8"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                {[
                  {
                    label: "Active Students",
                    value: "100K+",
                  },
                  {
                    label: "Expert Instructors",
                    value: "500+",
                  },
                  {
                    label: "Courses Available",
                    value: "1,200+",
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-small text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block animate-reveal-up">
              <img
                src={heroImage}
                alt="Hero Illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <ScrollReveal className="animate-reveal">
        <section className="border-y border-border bg-card">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <Marquee pauseOnHover={false}>
              {[
                {
                  icon: Users,
                  label: "Students Enrolled",
                  value: "100,000+",
                },
                {
                  icon: BookOpen,
                  label: "Total Courses",
                  value: "1,200+",
                },
                {
                  icon: Award,
                  label: "Certificates Issued",
                  value: "45,000+",
                },
                {
                  icon: Star,
                  label: "Average Rating",
                  value: "4.8/5",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-4 w-64 shrink-0 mx-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">
                      {s.value}
                    </div>
                    <div className="text-small text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Courses */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-h2 text-foreground">Featured Courses</h2>
              <p className="text-body text-muted-foreground mt-2">
                Learn from the best instructors in the industry
              </p>
            </div>
            <Link
              to="/courses"
              className="hidden sm:flex items-center gap-1 text-primary font-medium text-small hover:underline"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((c, index) => (
            <ScrollReveal key={c.id} delay={`${index * 0.1}s`}>
              <CourseCard course={c} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-h2 text-foreground">Browse by Category</h2>
              <p className="text-body text-muted-foreground mt-2">
                Find courses in your area of interest
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c, index) => (
              <ScrollReveal key={c.id} delay={`${index * 0.1}s`}>
                <CategoryCard
                  category={c}
                  to={`/courses?category=${encodeURIComponent(c.name)}`}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-h2 text-foreground">Top Instructors</h2>
            <p className="text-body text-muted-foreground mt-2">
              Learn from industry-leading experts
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((i, index) => (
            <ScrollReveal key={i.id} delay={`${index * 0.1}s`}>
              <InstructorCard instructor={i} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-h2 text-foreground">What Our Students Say</h2>
              <p className="text-body text-muted-foreground mt-2">
                Success stories from learners worldwide
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <ScrollReveal key={t.id} delay={`${index * 0.1}s`}>
                <div className="bg-background rounded-card card-shadow p-6 hover-lift h-full">
                  <Quote size={24} className="text-primary/30 mb-4" />
                  <p className="text-body text-muted-foreground leading-relaxed mb-6">
                    {t.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <span className="text-small font-bold text-primary-foreground">
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="text-small font-semibold text-foreground">
                        {t.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <RatingStars
                        rating={t.rating}
                        size={12}
                        showValue={false}
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <ScrollReveal>
          <div className="gradient-primary rounded-card p-10 md:p-16 text-center">
            <h2 className="text-h2 text-primary-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-body text-primary-foreground/80 max-w-lg mx-auto mb-8">
              Join thousands of students already transforming their careers.
              Start your journey today.
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-card text-primary hover:bg-card/90 rounded-button px-10 font-semibold"
              >
                Get Started Free <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </MainLayout>
  );
};

export default Landing;
