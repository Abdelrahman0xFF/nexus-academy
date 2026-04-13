import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center animate-reveal">
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <FileQuestion size={200} className="text-primary" />
                    </div>
                    <h1 className="text-9xl font-extrabold gradient-text relative z-10">
                        404
                    </h1>
                </div>

                <h2 className="text-h2 font-bold text-foreground mb-4">
                    Lost in Space?
                </h2>
                <p className="text-body text-muted-foreground mb-10 leading-relaxed">
                    The page you are looking for doesn't exist or has been moved.
                    Don't worry, even the best explorers get lost sometimes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        size="lg"
                        className="rounded-button px-8 group"
                    >
                        <ArrowLeft
                            size={18}
                            className="mr-2 group-hover:-translate-x-1 transition-transform"
                        />
                        Go Back
                    </Button>
                    <Link to="/">
                        <Button
                            size="lg"
                            className="gradient-primary border-0 text-primary-foreground rounded-button px-8 hover:opacity-90 transition-opacity w-full sm:w-auto"
                        >
                            <Home size={18} className="mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <div className="mt-16 pt-8 border-t border-border">
                    <p className="text-small text-muted-foreground">
                        Need help? Visit our{" "}
                        <Link
                            to="/"
                            className="text-primary font-medium hover:underline"
                        >
                            Help Center
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
