# Testimonial Patterns

> Reusable testimonial section specifications

## Pattern 1: Card Grid (3-column)

```
┌─────────────────────────────────────────────────┐
│                  Section Title                   │
├───────────────┬───────────────┬─────────────────┤
│  [Avatar]     │  [Avatar]     │  [Avatar]       │
│  "Quote..."   │  "Quote..."   │  "Quote..."     │
│  Name, Role   │  Name, Role   │  Name, Role     │
│  Company      │  Company      │  Company        │
└───────────────┴───────────────┴─────────────────┘
```

**Best for:** Multiple short testimonials
**Card style:** Glassmorphism with subtle border

---

## Pattern 2: Carousel

```
┌─────────────────────────────────────────────────┐
│                  Section Title                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  ←  [Large Quote Card with Photo]  →            │
│                                                  │
│              ○ ○ ● ○ ○ (dots)                    │
└─────────────────────────────────────────────────┘
```

**Best for:** Detailed testimonials, featured customers
**Animation:** Smooth slide transition

---

## Pattern 3: Featured Quote

```
┌─────────────────────────────────────────────────┐
│                                                  │
│              "Large impactful quote              │
│               that spans multiple                │
│               lines for emphasis"                │
│                                                  │
│       [Avatar]  Name, Role @ Company            │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Best for:** Single powerful testimonial
**Background:** Gradient or pattern

---

## Testimonial Template

```markdown
### [Customer Name]
- **Role:** [Job Title]
- **Company:** [Company Name]
- **Photo:** [URL or placeholder]
- **Quote:** "[Testimonial text - keep under 150 words]"
- **Metric:** [Optional: "Increased revenue by 40%"]
```

---

## Sample Testimonials (Placeholder)

### Sarah Chen
- **Role:** Head of Product
- **Company:** TechFlow Inc.
- **Quote:** "This tool transformed how our team works. We've cut our development time in half and our customers love the results."
- **Metric:** "50% faster development"

### Marcus Johnson  
- **Role:** CEO
- **Company:** StartupXYZ
- **Quote:** "The best investment we've made this year. ROI was positive within the first month."
- **Metric:** "10x ROI in 30 days"

### Elena Rodriguez
- **Role:** Engineering Manager
- **Company:** ScaleUp Co
- **Quote:** "Finally, a solution that actually delivers on its promises. Our team productivity has never been higher."
- **Metric:** "3x team productivity"

---

*Replace with real testimonials as they're collected.*
