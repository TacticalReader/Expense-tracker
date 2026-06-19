import { Loader2 } from 'lucide-react'
import './LoadingSpinner.css'

// Props:
//   size     ('sm' | 'md' | 'lg') — controls icon size. Default: 'md'
//   fullPage (boolean)            — centers in full viewport. Default: false
//   message  (string)             — optional text shown below spinner
function LoadingSpinner({ size = 'md', fullPage = false, message = '' }) {
    const sizeMap = {
        sm: 16,
        md: 24,
        lg: 40,
    }

    const iconSize = sizeMap[size] ?? sizeMap.md

    return (
        <div
            className={`spinner-wrapper ${fullPage ? 'spinner-fullpage' : ''} spinner-${size}`}
            role="status"
            aria-label={message || 'Loading...'}
        >
            <Loader2
                size={iconSize}
                className="spinner-icon"
                aria-hidden="true"
            />
            {message && (
                <p className="spinner-message">{message}</p>
            )}
        </div>
    )
}

export default LoadingSpinner