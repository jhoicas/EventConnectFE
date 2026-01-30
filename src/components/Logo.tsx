import { Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
}

export const Logo = ({ className = '', textClassName = '', iconClassName = '', onClick }: LogoProps) => {
  return (
    <div 
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <Sparkles className={`w-8 h-8 ${iconClassName}`} />
      <span className={`text-2xl font-bold ${textClassName}`}>EventConnect</span>
    </div>
  );
};
