# Hero Section Patterns

> Reusable hero section specifications and patterns

## Pattern 1: Split Hero (Recommended)

```
┌─────────────────────────────────────────────────┐
│  Navigation                                      │
├────────────────────────┬────────────────────────┤
│                        │                        │
│   Headline             │   [Product Visual]     │
│   Subheadline          │   Dashboard/App        │
│                        │   Screenshot           │
│   [CTA] [Secondary]    │                        │
│                        │                        │
└────────────────────────┴────────────────────────┘
```

**Best for:** Product demos, dashboard tools, visual products
**Animation:** Content slides in from left, visual fades in with slight scale

---

## Pattern 2: Centered Hero

```
┌─────────────────────────────────────────────────┐
│  Navigation                                      │
├─────────────────────────────────────────────────┤
│                                                  │
│              Headline (centered)                 │
│              Subheadline                         │
│                                                  │
│           [CTA]    [Secondary]                   │
│                                                  │
│          [Product Visual Below]                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Best for:** Simple products, text-focused messaging
**Animation:** Fade up with staggered timing

---

## Pattern 3: Video Hero

```
┌─────────────────────────────────────────────────┐
│  Navigation (transparent overlay)                │
├─────────────────────────────────────────────────┤
│                                                  │
│              [Background Video]                  │
│                                                  │
│              Headline (overlay)                  │
│              [CTA]                               │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Best for:** Lifestyle products, emotional appeal
**Animation:** Text fades in over autoplay video

---

## Animation Specifications

### Headline Animation
```css
animation: fadeInUp 0.8s ease-out;
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### CTA Button Hover
```css
transition: all 0.3s ease;
&:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.4);
}
```

### Visual Float Animation
```css
animation: float 6s ease-in-out infinite;
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

---

*Add new patterns as they're discovered and approved.*
