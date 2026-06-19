import { useState } from 'react'

// ── useLocalStorage hook ──────────────────────────────────────────
//
// @param {string} key          - The localStorage key to store the value under
// @param {*}      initialValue - The value to use if no stored value is found
//                                (can be any JSON-serializable value)
// @returns {[*, Function]}     - [storedValue, setValue] — same as useState
function useLocalStorage(key, initialValue) {

    // ── Initialize state from localStorage ─────────────────────────
    // useState accepts a function as its argument — the function runs
    // only once on first render (lazy initialization). This avoids
    // reading localStorage on every re-render.
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)

            if (item === null) {
                // Key does not exist in localStorage — use initialValue
                return initialValue
            }

            // Key exists — parse and return the stored JSON value
            return JSON.parse(item)
        } catch (error) {
            // JSON.parse failed (corrupted data) or localStorage is unavailable
            // (e.g. private browsing with strict settings).
            // Fall back to initialValue and log a warning.
            console.warn(
                `[useLocalStorage] Failed to read key "${key}" from localStorage.`,
                error
            )
            return initialValue
        }
    })

    // ── setValue ──────────────────────────────────────────────────
    // Works exactly like React's setState:
    // - Accepts a new value directly:    setValue('new value')
    // - Accepts a function (updater):    setValue(prev => [...prev, item])
    // Also persists the new value to localStorage as a JSON string.
    const setValue = (value) => {
        try {
            // If value is a function, call it with the current stored value
            // to get the actual new value (mirrors React setState behaviour)
            const valueToStore =
                value instanceof Function ? value(storedValue) : value

            // Update React state — triggers re-render
            setStoredValue(valueToStore)

            // Persist to localStorage as a JSON string
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            // localStorage.setItem can throw if:
            // - Storage quota is exceeded (common on mobile)
            // - localStorage is unavailable (private browsing)
            // Log the warning but DO NOT crash — the state update still
            // happened above so the UI stays correct, just not persisted.
            console.warn(
                `[useLocalStorage] Failed to write key "${key}" to localStorage.`,
                error
            )
        }
    }

    return [storedValue, setValue]
}

export default useLocalStorage