import {
    UtensilsCrossed,
    Car,
    ShoppingBag,
    Heart,
    Home,
    BookOpen,
    Tv,
    Tag,
} from 'lucide-react'
import './CategoryBadge.css'

// Category configuration — icon + CSS variable names
// Colors are defined in global.css under section 2 (Design Tokens)
const CATEGORY_CONFIG = {
    Food: {
        icon: <UtensilsCrossed size={11} />,
        colorVar: 'var(--color-cat-food)',
        bgVar: 'var(--color-cat-food-bg)',
    },
    Transport: {
        icon: <Car size={11} />,
        colorVar: 'var(--color-cat-transport)',
        bgVar: 'var(--color-cat-transport-bg)',
    },
    Shopping: {
        icon: <ShoppingBag size={11} />,
        colorVar: 'var(--color-cat-shopping)',
        bgVar: 'var(--color-cat-shopping-bg)',
    },
    Health: {
        icon: <Heart size={11} />,
        colorVar: 'var(--color-cat-health)',
        bgVar: 'var(--color-cat-health-bg)',
    },
    Housing: {
        icon: <Home size={11} />,
        colorVar: 'var(--color-cat-housing)',
        bgVar: 'var(--color-cat-housing-bg)',
    },
    Education: {
        icon: <BookOpen size={11} />,
        colorVar: 'var(--color-cat-education)',
        bgVar: 'var(--color-cat-education-bg)',
    },
    Entertainment: {
        icon: <Tv size={11} />,
        colorVar: 'var(--color-cat-entertainment)',
        bgVar: 'var(--color-cat-entertainment-bg)',
    },
    Other: {
        icon: <Tag size={11} />,
        colorVar: 'var(--color-cat-other)',
        bgVar: 'var(--color-cat-other-bg)',
    },
}

// Props:
//   category (string) — one of the 8 category strings above
function CategoryBadge({ category }) {
    const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.Other

    return (
        <span
            className="category-badge"
            style={{
                color: config.colorVar,
                backgroundColor: config.bgVar,
                borderColor: config.colorVar,
            }}
        >
            <span className="category-badge-icon" aria-hidden="true">
                {config.icon}
            </span>
            <span className="category-badge-label">{category ?? 'Other'}</span>
        </span>
    )
}

export default CategoryBadge