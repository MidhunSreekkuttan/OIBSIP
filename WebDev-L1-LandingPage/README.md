# Flowspace — Work Better Together

Flowspace is a static, responsive landing page for a fictional team collaboration and project management platform. It introduces the product, highlights its features, explains its value, and encourages visitors to get started.

## Features

- Sticky navigation with links to the main page sections
- Hero section with headline, description, calls to action, and a dashboard preview
- Feature cards for project management, team collaboration, and task tracking
- About section with key benefits
- Sample testimonial cards
- Final call-to-action section
- Footer with placeholder contact and social links
- Responsive layout for desktop, tablet, and mobile screens
- Lucide icons for interface and decorative icons
- Consistent color palette and typography

## Built With

- HTML5
- CSS3 (Flexbox, CSS Grid, media queries, and CSS custom properties)
- [Inter](https://fonts.google.com/specimen/Inter) font
- [Lucide](https://lucide.dev/) icons via CDN

## Project Structure

```text
flowspace-landing-page/
├── index.html
├── index.css
└── README.md
```

- `index.html` contains the page structure and the Lucide icon initialization.
- `index.css` contains the page styles. Keep this file in the same directory as `index.html`.
- `README.md` contains project documentation.

> If your CSS is currently written inside the `<style>` element in `index.html`, you can keep it there instead. The provided HTML file links to `./index.css`, so make sure the stylesheet exists if you use that version.

## Getting Started

No build tools or package installation are required.

1. Download or clone this project.
2. Make sure `index.html` and `index.css` are in the same directory.
3. Open `index.html` in a browser.

You can also use the **Live Server** extension in Visual Studio Code to preview the page and automatically refresh it when you make changes.

## Customization

### Update the color palette

If your styles are in `index.css`, edit the CSS custom properties in the `:root` selector. For example:

```css
:root {
  --primary: #6D5DFB;
  --primary-dark: #5847E8;
  --dark: #111827;
  --text: #475569;
  --muted: #94A3B8;
  --background: #F8FAFC;
  --white: #FFFFFF;
  --border: #E2E8F0;
}
```

### Change the content

Edit the text in `index.html` to update the product name, descriptions, features, testimonials, and footer links.

### Use Lucide icons

Icons use Lucide's `data-lucide` attributes. For example:

```html
<i data-lucide="layout-dashboard"></i>
```

The page initializes Lucide with:

```html
<script>
  lucide.createIcons();
</script>
```

Lucide is loaded from a CDN, so an internet connection is required for the icons to load. Google Fonts also uses an external connection to load Inter.

## Responsive Design

The layout uses CSS Grid and Flexbox for flexible content placement. Media queries adjust the layout at tablet and mobile widths to keep the content readable and prevent horizontal overflow.