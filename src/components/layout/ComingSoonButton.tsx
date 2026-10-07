import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ComingSoonButtonProps {
  label: string;
  variant?: 'gold' | 'outline' | 'outline-sm' | 'gold-sm';
  className?: string;
  children?: ReactNode;
}

const variantClasses: Record<string, string> = {
  gold: 'luxury-btn luxury-btn--gold',
  outline: 'luxury-btn luxury-btn--outline',
  'outline-sm': 'luxury-btn luxury-btn--outline luxury-btn--sm',
  'gold-sm': 'luxury-btn luxury-btn--gold luxury-btn--sm',
};

const ComingSoonButton = ({ label, variant = 'outline-sm', className, children }: ComingSoonButtonProps) => {
  return (
    <div
      className={cn(variantClasses[variant], 'relative cursor-not-allowed opacity-70', className)}
      role="button"
      aria-disabled="true"
      title="Coming Soon"
    >
      {children || label}
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'rgba(10, 10, 10, 0.6)',
          borderRadius: 'inherit',
        }}
      >
        <span
          className="text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded"
          style={{
            color: 'var(--luxury-gold-light)',
            background: 'rgba(10, 10, 10, 0.8)',
            border: '1px solid var(--luxury-gold-muted)',
          }}
        >
          Coming Soon
        </span>
      </span>
    </div>
  );
};

export default ComingSoonButton;
