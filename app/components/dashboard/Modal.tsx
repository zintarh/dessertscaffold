'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4'
};

export default function Modal({
  open,
  onOpenChange,
  title,
  children,
  description,
  size = 'md',
  showCloseButton = true,
  className
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "bg-white rounded-lg shadow-xl z-50",
            "w-full mx-4",
            sizeClasses[size],
            "max-h-[90vh] overflow-y-auto",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-lg font-medium text-gray-900 truncate">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-gray-500 mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            
            {showCloseButton && (
              <Dialog.Close asChild>
                <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            )}
          </div>

          {/* Content */}
          <div className="p-6 bg-white">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Modal Footer component for consistent button layouts
export function ModalFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      "flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200",
      className
    )}>
      {children}
    </div>
  );
}

// Modal Section component for organizing content
export function ModalSection({ 
  children, 
  className,
  title,
  description 
}: { 
  children: React.ReactNode; 
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      {title && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
          {description && (
            <p className="text-sm text-gray-700">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
