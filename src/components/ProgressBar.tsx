
interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

const ProgressBar = ({ 
  value, 
  max, 
  color = "bg-token-purple", 
  className = "",
  showLabel = false 
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span>{value.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className={`progress-bar-fill ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
