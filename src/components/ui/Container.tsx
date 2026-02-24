import { forwardRef } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
export default Container;
