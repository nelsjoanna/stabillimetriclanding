# StabiliMetric Pro Landing Page Design Guidelines

## Design Approach

**Selected Approach:** Reference-based, drawing from modern B2B SaaS leaders (Stripe, Notion, Linear) with beauty industry refinement (Glossier, Sephora aesthetic influence for credibility in the beauty space).

**Core Principles:**
- Scientific credibility meets beauty industry polish
- Trust-building through clean, professional design
- Conversion-optimized for early adopter signups
- Balance technical sophistication with approachable UX

## Typography System

**Primary Font:** Inter or DM Sans (Google Fonts)
- Headlines: 600-700 weight, tight line-height (1.1-1.2)
- Body: 400-500 weight, comfortable reading (1.6-1.7 line-height)

**Type Scale:**
- Hero headline: text-5xl lg:text-7xl
- Section headlines: text-3xl lg:text-5xl
- Feature titles: text-xl lg:text-2xl
- Body text: text-base lg:text-lg
- Small text/labels: text-sm

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 8, 12, 16, and 24 for consistency
- Section padding: py-16 lg:py-24
- Component spacing: space-y-8 lg:space-y-12
- Card padding: p-6 lg:p-8
- Button padding: px-6 py-3

**Container Strategy:**
- Full-width sections with inner max-w-7xl mx-auto px-6
- Content sections: max-w-6xl
- Form containers: max-w-xl

## Page Structure & Sections

**1. Hero Section (100vh on desktop, natural height mobile)**
- Video demo player (16:9 aspect ratio, centered, max-w-4xl)
- Compelling headline above video emphasizing AI-powered formulation + compliance
- Subheadline highlighting sustainable beauty focus
- Dual CTA buttons below video: "Join Waitlist" (primary) + "Watch Demo" (secondary, triggers video play)
- Trust indicators: "Trusted by 50+ beauty brands" or similar social proof
- Video player with custom controls, thumbnail preview before play

**2. Problem/Solution Section**
- Two-column layout (lg:grid-cols-2)
- Left: The Challenge (current formulation pain points)
- Right: The StabiliMetric Solution (AI-powered approach)
- Include relevant imagery: lab setting, ingredient testing visuals

**3. Feature Gallery (Primary showcase)**
- Three-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each feature card includes:
  - Icon (use Heroicons - beaker, shield-check, sparkles, etc.)
  - Feature title
  - 2-3 sentence description
  - "Learn more" link
- Features to highlight:
  - Predictive Ingredient Compatibility Testing
  - All-in-One Formulation Platform
  - Automatic Regulatory Compliance (MoCRA/FDA/EU)
  - Sustainable Ingredient Database
  - Real-time Stability Predictions
  - Manufacturing Integration

**4. Benefits Showcase**
- Alternating two-column layout (image-text, text-image)
- 3 major benefits, each with:
  - Large benefit number/stat ("90% faster formulation")
  - Headline
  - Detailed explanation
  - Supporting image (product interface screenshots, before/after comparisons)

**5. How It Works**
- Horizontal step-by-step flow (3-4 steps)
- Number badges for each step
- Connected with subtle lines/arrows
- Steps: Input ingredients → AI analysis → Compliance check → Ready to manufacture

**6. Waitlist Signup (Prominent, appears twice)**
- Primary signup in hero
- Secondary detailed signup section with:
  - Form fields: Email, Company Name, Role (dropdown), Company Size
  - Checkbox: "I'm interested in being a pilot partner"
  - Privacy statement
  - Strong CTA: "Get Early Access"
  - Side content: What early users get (exclusive features, priority support, pricing discount)

**7. Social Proof**
- Logo grid of beauty brands (if available) or "Join industry leaders" placeholder
- Testimonial format if available: Photo, quote, name, role, company

**8. Footer (Rich)**
- Newsletter signup embedded
- Quick links: Product, Features, Pricing (Coming Soon), Resources, Contact
- Company info, social links
- Trust badges: "FDA Compliant Platform", "EU Certified", "SOC 2 Secure"

## Component Library

**Buttons:**
- Primary: Solid with backdrop-blur-sm when on images/video
- Secondary: Outline style
- Sizes: Standard (px-6 py-3), Large (px-8 py-4)
- Rounded: rounded-lg

**Cards:**
- Feature cards: Bordered, subtle shadow, hover lift effect
- Benefit cards: Clean, minimal border
- Padding: p-6 lg:p-8
- Border radius: rounded-xl

**Form Inputs:**
- Border style with focus ring
- Consistent height: h-12
- Rounded: rounded-lg
- Label above input pattern

**Icons:**
- Use Heroicons via CDN
- Sizes: w-6 h-6 for inline, w-12 h-12 for feature icons
- Consistent stroke width

## Images Strategy

**Hero Section:** Video demo player (not static image) with professional thumbnail
**Benefits/Features:** Mix of:
- Product interface screenshots (dashboard, formulation tool, compliance checker)
- Beauty industry imagery (lab settings, ingredient close-ups, cosmetic products)
- Abstract tech/AI visualizations (data patterns, molecular structures)

**Image Treatment:**
- Subtle rounded corners (rounded-xl)
- Optional subtle shadow for depth
- Maintain aspect ratios: 16:9 for wide, 4:3 for standard, 1:1 for squares

## Responsive Behavior

- Mobile: Single column, stacked sections, full-width CTAs
- Tablet: Two-column where appropriate
- Desktop: Full multi-column layouts, generous spacing
- Video: Maintains aspect ratio, reduces to full-width mobile

## Animations

Use sparingly, only for:
- Fade-in on scroll for section reveals
- Subtle hover states on cards (slight lift/shadow)
- Button hover states (handled by component)
- Form validation feedback

## Trust & Credibility Elements

- Regulatory badges prominently displayed
- Scientific terminology balanced with clarity
- Professional imagery from beauty/lab settings
- Data security mentions
- Industry certification logos

This design balances the technical sophistication of an AI/SaaS platform with the visual polish expected in the beauty industry, creating trust while driving waitlist conversions.