# EduStar Consult Study Abroad Questionnaire - Design Guidelines

## Design Approach
**Hybrid Approach**: Material Design foundation with strong brand customization for EduStar Consult. This utility-focused form application prioritizes clarity, trust, and efficiency while maintaining professional brand presence.

---

## Core Design Elements

### A. Color Palette

**Brand Colors:**
- Primary Purple: 270 70% 58% (EduStar brand - #7C3AED)
- Primary Purple Dark: 270 70% 48% (hover/active states)
- Primary Purple Light: 270 70% 95% (backgrounds/highlights)

**Functional Colors:**
- Success Green: 142 71% 45%
- Error Red: 0 84% 60%
- Warning Amber: 38 92% 50%
- Info Blue: 217 91% 60%

**Neutral Palette:**
- Background: 220 15% 98%
- Surface White: 0 0% 100%
- Border: 220 13% 91%
- Text Primary: 220 13% 18%
- Text Secondary: 220 9% 46%
- Text Disabled: 220 9% 70%

**Dark Mode (if implemented):**
- Background: 220 20% 8%
- Surface: 220 15% 12%
- Border: 220 15% 20%

### B. Typography

**Font Stack:**
- Primary: 'Inter', -apple-system, sans-serif
- Monospace: 'JetBrains Mono', monospace (for reference numbers)

**Type Scale:**
- Hero/Logo Text: text-4xl (36px) font-bold
- Section Headings: text-2xl (24px) font-semibold
- Subsection Titles: text-xl (20px) font-semibold
- Form Labels: text-sm (14px) font-medium
- Input Text: text-base (16px) font-normal
- Helper Text: text-sm (14px) font-normal
- Tagline: text-lg (18px) font-normal italic

### C. Layout System

**Spacing Primitives:**
Primary units: 2, 4, 6, 8, 12, 16, 20, 24 (Tailwind scale)

**Container Strategy:**
- Maximum form width: max-w-3xl (768px)
- Side padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)
- Section spacing: py-8 to py-12
- Field spacing: mb-6 between form fields
- Card padding: p-6 to p-8

**Grid System:**
- Single column form layout (max readability)
- Two-column for paired fields (First/Last Name, City/State)
- Three-column for checkboxes/radio groups where appropriate

### D. Component Library

**Header Component:**
- White background with subtle shadow (shadow-sm)
- Centered EduStar logo (height h-16 to h-20)
- Tagline "Unleashing Stars Through Education" below logo in italic purple text
- Company address in small text below tagline
- Sticky positioning for easy navigation

**Progress Indicator:**
- Horizontal stepper showing 6 sections
- Active step: purple filled circle with white checkmark
- Current step: purple outline circle with number
- Upcoming steps: gray outline circle
- Connector lines between steps (gray for incomplete, purple for completed)
- Section names displayed below each step
- Mobile: simplified dot indicator

**Form Sections/Cards:**
- White background (bg-white)
- Rounded corners (rounded-lg or rounded-xl)
- Subtle shadow (shadow-md)
- Section title with purple accent border-l-4
- Padding: p-6 to p-8

**Input Fields:**
- Height: h-11 (44px minimum for touch)
- Rounded: rounded-md
- Border: 1px solid border color
- Focus: purple ring (ring-2 ring-purple-500)
- Padding: px-4 py-3
- Background: white with hover state (bg-gray-50)
- Disabled: bg-gray-100 with reduced opacity text

**Checkbox/Radio Groups:**
- Purple accent when selected
- Clear focus states with ring
- Grouped in vertical lists with spacing
- "Other" option includes inline text input

**Buttons:**
- Primary (Submit/Next): bg-purple-600 with white text, h-11, rounded-md, font-medium, hover state darker purple
- Secondary (Previous/Back): bg-white with purple border and text
- Disabled: reduced opacity with cursor-not-allowed
- Full-width on mobile, auto-width on desktop

**Validation Messages:**
- Error: Red text below field with small icon
- Success: Green text with checkmark icon
- Inline validation on blur

**Success Confirmation:**
- Centered card with success icon (green checkmark circle)
- Reference number in monospace font with copy button
- Confirmation message
- Return to home button

**Admin Dashboard Table:**
- Zebra striping for rows
- Sticky header
- Export to CSV button (purple)
- Search/filter functionality
- Responsive: horizontal scroll on mobile

### E. Interactions & Animations

**Minimal Approach:**
- Smooth transitions: transition-all duration-200
- Button hover: subtle scale (hover:scale-102) and brightness
- Input focus: ring animation
- Section transitions: fade-in effect (opacity 0 to 100)
- Progress indicator: smooth fill animations for completed steps
- NO: Complex scroll animations, parallax, decorative motion

**Micro-interactions:**
- Checkbox/radio: smooth checkmark appearance
- Successful form submission: confetti or subtle celebration (single occurrence)
- Field validation: shake animation on error

---

## Layout Specifications

**Form Flow:**
1. Header with logo (always visible/sticky)
2. Progress indicator (below header)
3. Current section card with fields
4. Navigation buttons at bottom (Previous/Next/Submit)
5. Footer with contact information

**Responsive Breakpoints:**
- Mobile: < 640px (single column, stacked elements)
- Tablet: 640px - 1024px (optimized spacing)
- Desktop: > 1024px (maximum form width, generous whitespace)

**Vertical Rhythm:**
- Consistent py-8 between major sections
- mb-6 between form fields within sections
- mb-4 between label and helper text
- mb-2 between related checkboxes

---

## Images

**Logo Placement:**
- Position: Top center of header
- Size: 180-220px width, auto height
- Background: White or very light purple tint
- Shadow: None to subtle
- File: EduStar Consult purple logo with star element

**No Hero Image:**
This is a form application focused on data collection. The logo serves as the primary visual branding element. No large hero image needed.

**Optional Decorative Elements:**
- Subtle purple gradient background behind entire form (very light, non-distracting)
- Small star icons as bullet points for checkbox groups
- Success page: illustration or icon representing successful submission

---

## Critical Form UX Principles

1. **Clear Field Labels**: Every input has bold, descriptive label above field
2. **Helper Text**: Important fields include example format below label
3. **Required Field Indicators**: Red asterisk (*) next to required field labels
4. **Logical Grouping**: Related fields visually grouped with subtle backgrounds
5. **Error Prevention**: Inline validation before submission
6. **Progress Saving**: Consider auto-save to localStorage for longer forms
7. **Accessibility**: WCAG 2.1 AA compliant - proper contrast, keyboard navigation, ARIA labels
8. **Mobile Optimization**: Large touch targets, optimized keyboard types (email, tel, number)