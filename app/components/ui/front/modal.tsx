import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  closeOnBackdropClick?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children, title, description, closeOnBackdropClick = true, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    React.useEffect(() => {
      if (isOpen) {
        const scrollY = window.scrollY
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = '100%'
        
        return () => {
          document.body.style.position = ''
          document.body.style.top = ''
          document.body.style.width = ''
          window.scrollTo(0, scrollY)
        }
      }
    }, [isOpen])

    if (!isOpen || !mounted) return null

    const modalContent = (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998
          }}
          onClick={closeOnBackdropClick ? onClose : undefined}
        />
        
        {/* Modal Content */}
        <div
          ref={ref}
          className="relative bg-surface border border-default rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          style={{ zIndex: 9999 }}
          {...props}
        >
          {/* Header */}
          {(title || description) && (
            <div className="px-8 py-6 border-b border-default bg-primary-bg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {title && (
                    <h2 
                      className="text-2xl font-bold mb-2 text-primary"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p 
                      className="text-lg text-secondary"
                    >
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 hover:bg-surface-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-tertiary" />
                </button>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="p-8 flex-1 overflow-y-auto bg-surface text-primary">
            {children}
          </div>
        </div>
      </div>
    )

    return createPortal(modalContent, document.body)
  }
)
Modal.displayName = "Modal"

export { Modal }
