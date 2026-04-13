import { ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: string;
  delay?: string;
  className?: string;
  once?: boolean;
}

const ScrollReveal = ({
  children,
  animation = "animate-reveal",
  delay = "0s",
  className = "",
  once = true,
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before the element enters
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once]);

  return (
    <div
      ref={ref}
      className={`${isVisible ? animation : "opacity-0"} ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
