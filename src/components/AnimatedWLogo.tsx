import svgPaths from "../imports/svg-q8fzxtbtg3";

interface AnimatedWLogoProps {
  duration?: string;
  delay?: string;
  className?: string;
  strokeColor?: string;
  size?: number;
}

export function AnimatedWLogo({ 
  duration = "3s", 
  delay = "0s",
  className = "",
  strokeColor = "#3A4DEA",
  size
}: AnimatedWLogoProps) {
  return (
    <div className={`relative size-full ${className}`} style={size ? { width: size, height: size } : undefined}>
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="-5 -5 261 202">
        {/* Main stroke - sharp line */}
        <path 
          d={svgPaths.p35b23f00} 
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: "1000",
            strokeDashoffset: "1000",
            animation: `drawLine ${duration} ease-in-out ${delay} infinite`,
          }}
        />
      </svg>
      <style>{`
        @keyframes drawLine {
          0% {
            stroke-dashoffset: 1000;
            opacity: 0.3;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -1000;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

export default AnimatedWLogo;
