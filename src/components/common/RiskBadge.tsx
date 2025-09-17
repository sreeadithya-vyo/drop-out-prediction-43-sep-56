import { Badge } from '@/components/ui/badge';
import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

type RiskBadgeProps = {
  risk: RiskLevel;
  className?: string;
};

export const RiskBadge = ({ risk, className }: RiskBadgeProps) => {
  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return 'bg-risk-low text-white hover:bg-risk-low/90';
      case 'medium':
        return 'bg-risk-medium text-white hover:bg-risk-medium/90';
      case 'high':
        return 'bg-risk-high text-white hover:bg-risk-high/90';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge 
      className={cn(getRiskColor(risk), className)}
      variant="secondary"
    >
      {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
    </Badge>
  );
};