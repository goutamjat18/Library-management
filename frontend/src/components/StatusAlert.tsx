import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

type AlertType = 'error' | 'success' | 'info' | 'warning';

const config: Record<AlertType, { icon: typeof AlertCircle; classes: string }> = {
  error: { icon: AlertCircle, classes: 'bg-destructive/10 text-destructive border-destructive/20' },
  success: { icon: CheckCircle2, classes: 'bg-success/10 text-success border-success/20' },
  info: { icon: Info, classes: 'bg-info/10 text-info border-info/20' },
  warning: { icon: AlertTriangle, classes: 'bg-warning/10 text-warning-foreground border-warning/20' },
};

export default function StatusAlert({ type, children }: { type: AlertType; children: React.ReactNode }) {
  const { icon: Icon, classes } = config[type];
  return (
    <div className={cn('flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium mb-4', classes)}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
