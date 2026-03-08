export function LungIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Lung */}
      <path
        d="M35 25C30 25 25 30 25 35C25 40 25 60 25 65C25 75 30 80 35 80C40 80 42 75 42 70L42 40C42 35 40 30 38 28C37 26 36 25 35 25Z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Right Lung */}
      <path
        d="M65 25C70 25 75 30 75 35C75 40 75 60 75 65C75 75 70 80 65 80C60 80 58 75 58 70L58 40C58 35 60 30 62 28C63 26 64 25 65 25Z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Trachea */}
      <path
        d="M48 15C48 13 49 12 50 12C51 12 52 13 52 15L52 35C52 37 51 38 50 38C49 38 48 37 48 35L48 15Z"
        fill="currentColor"
      />
      
      {/* Bronchi - Left */}
      <path
        d="M50 35C50 35 45 38 42 40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Bronchi - Right */}
      <path
        d="M50 35C50 35 55 38 58 40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
