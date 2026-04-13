import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  HelpCircle,
  Book,
  CreditCard,
  User,
  Video,
  Mail,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button on the homepage, fill in your details and verify your email.",
      },
      {
        q: "How do I enroll in a course?",
        a: "Browse our catalog, select a course, and click 'Enroll Now'.",
      },
      {
        q: "What are the system requirements?",
        a: "A modern browser and stable internet connection.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Profile",
    icon: User,
    questions: [
      {
        q: "How do I reset my password?",
        a: "Use the 'Forgot Password' link on the login page.",
      },
      {
        q: "How do I update my profile?",
        a: "Go to Settings > Profile in your dashboard.",
      },
    ],
  },
  {
    id: "courses",
    title: "Courses & Learning",
    icon: Video,
    questions: [
      {
        q: "How do I access content?",
        a: "Go to 'My Courses' and select your course.",
      },
      {
        q: "Do I get a certificate?",
        a: "Yes, after completing all lessons and passing the final quiz.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Payments",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "Credit cards, PayPal, and bank transfers.",
      },
      {
        q: "How do I get a refund?",
        a: "Contact support within 30 days of purchase.",
      },
    ],
  },
];

const CategoryCard = ({ icon: Icon, title, count, onClick, isAi = false }) => (
  <button
    onClick={onClick}
    className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-md group text-left"
  >
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
      <Icon className="text-primary" size={24} />
    </div>
    <h3 className="font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">
      {isAi ? "Ask anything about Nexus" : `${count} articles`}
    </p>
  </button>
);

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const scrollToSection = (id) => {
    setExpandedCategory(id);
    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const filteredCategories = helpCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-b from-primary/5 via-primary/10 to-background py-16">
        <div className="container mx-auto px-4 text-center relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap size={22} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bold">
              Nexus<span className="gradient-text">Academy</span>
            </span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How can we <span className="gradient-text">help you?</span>
          </h1>
          <div className="relative max-w-xl mx-auto mt-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              placeholder="Search for answers..."
              className="pl-12 h-12 bg-background/80 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <CategoryCard
            icon={Bot}
            title="AI Assistant"
            isAi
            onClick={() => alert("Coming Soon!")}
            count={undefined}
          />
          {helpCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              title={cat.title}
              count={cat.questions.length}
              onClick={() => scrollToSection(cat.id)}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              id={cat.id}
              className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28"
            >
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === cat.id ? null : cat.id,
                  )
                }
                className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <cat.icon className="text-primary" size={20} />
                  <span className="font-semibold">{cat.title}</span>
                </div>
                {expandedCategory === cat.id ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>

              {expandedCategory === cat.id && (
                <div className="border-t border-border">
                  {cat.questions.map((q, i) => (
                    <div
                      key={i}
                      className="border-b border-border last:border-b-0"
                    >
                      <button
                        onClick={() =>
                          setExpandedQuestion(
                            expandedQuestion === `${cat.id}-${i}`
                              ? null
                              : `${cat.id}-${i}`,
                          )
                        }
                        className="w-full flex items-center justify-between p-4 pl-8 hover:bg-muted/30 text-left"
                      >
                        <span className="text-sm font-medium">{q.q}</span>
                        {expandedQuestion === `${cat.id}-${i}` ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      {expandedQuestion === `${cat.id}-${i}` && (
                        <div className="px-8 pb-4 text-sm text-muted-foreground">
                          {q.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any articles matching "{searchQuery}"
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <div className="flex justify-center gap-4">
            <Button className="gradient-primary">
              <Mail size={18} className="mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
