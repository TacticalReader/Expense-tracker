import { useEffect, useRef } from 'react'
import { LogOut, X, AlertTriangle } from 'lucide-react'
import './LogoutConfirmModal.css'

function LogoutConfirmModal({ isOpen, onClose, onConfirm, isConfirming }) {
    const modalRef = useRef(null)

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            // Lock body scroll
            document.body.style.overflow = 'hidden'
            // Focus trap (optional, but focus the confirmation card)
            modalRef.current?.focus()
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="logout-modal-overlay" onClick={onClose}>
            <div
                className="logout-modal-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-title"
                tabIndex={-1}
                ref={modalRef}
            >
                {/* Close Button */}
                <button
                    className="logout-modal-close"
                    onClick={onClose}
                    disabled={isConfirming}
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                {/* Modal Icon Header */}
                <div className="logout-modal-icon-wrap">
                    <div className="logout-modal-icon-bg">
                        <AlertTriangle size={32} className="logout-modal-icon" />
                    </div>
                </div>

                {/* Content */}
                <div className="logout-modal-content">
                    <h2 id="logout-title" className="logout-modal-title">
                        Confirm Logout
                    </h2>
                    <p className="logout-modal-text">
                        Are you sure you want to log out? You will need to enter your credentials to access your dashboard again.
                    </p>
                </div>

                {/* Actions */}
                <div className="logout-modal-actions">
                    <button
                        type="button"
                        className="btn btn-secondary logout-modal-btn-cancel"
                        onClick={onClose}
                        disabled={isConfirming}
                    >
                        No, Stay
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger logout-modal-btn-confirm"
                        onClick={onConfirm}
                        disabled={isConfirming}
                    >
                        <LogOut size={16} />
                        {isConfirming ? 'Logging out...' : 'Yes, Log out'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LogoutConfirmModal
