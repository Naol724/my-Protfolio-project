# Naol Gonfa — Personal Portfolio

A personal portfolio website for **Naol Gonfa**, Full-Stack Web Developer & AI Engineering Enthusiast, built on the [SnapFolio](https://bootstrapmade.com/snapfolio-bootstrap-portfolio-template/) Bootstrap template.

---

## Live Site

[https://naol.online](https://naol.online)

---

## Project Structure

```
├── index.html               # Main portfolio page
├── portfolio-details.html   # Individual project detail page
├── service-details.html     # Service detail page
├── starter-page.html        # Blank starter page
├── forms/
│   └── contact.php          # PHP contact form handler
└── assets/
    ├── css/
    │   └── main.css         # Compiled CSS
    ├── scss/
    │   ├── main.scss        # SCSS entry point
    │   ├── _variables.scss  # Color & font variables
    │   ├── _sections.scss   # Section imports
    │   ├── layouts/         # Header, footer, nav, etc.
    │   └── sections/        # Per-section SCSS files
    ├── js/
    │   └── main.js          # Main JavaScript
    ├── img/
    │   ├── profile/         # Profile photos (naol-1/2/3.png)
    │   └── portfolio/       # Project screenshots
    └── vendor/              # Third-party libraries
```

---

## Sections

- **Hero** — Name, typed role, description, and profile photo
- **About** — Bio, contact info, education, languages, and CTA buttons
- **Skills** — Icon grid across Frontend, Backend, Database, Middleware & Tooling, plus a scrolling tools marquee
- **Resume** — Education, experience, and technical skills summary
- **Portfolio** — Project cards with screenshots and filter support
- **Contact** — Contact form backed by `forms/contact.php`

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5, Tailwind CSS, React |
| Backend | Node.js, Java, C#, PHP |
| Database | MongoDB, MySQL, PostgreSQL, Firebase, Oracle, MSSQL |
| Styling | SCSS (compiled to CSS), Bootstrap Icons, Google Fonts |
| Animation | AOS, Typed.js, Swiper, GLightbox, PureCounter |
| Deployment | Vercel, Netlify |

---

## Getting Started

No build step is required to view the site. Just open `index.html` in a browser.

To edit styles, compile SCSS using the [Easy Compile](https://marketplace.visualstudio.com/items?itemName=refgd.easy-compile) VS Code extension or any SCSS compiler:

```bash
sass assets/scss/main.scss assets/css/main.css
```

---

## Contact Form Setup

The contact form uses PHP. To enable it:

1. Upload the project to a PHP-enabled server.
2. Open `forms/contact.php` and replace the receiving email:
   ```php
   $receiving_email_address = 'your@email.com';
   ```
3. Optionally configure SMTP by uncommenting the `$contact->smtp` block.

---

## Theme

Supports dark/light mode toggle. The selected theme is persisted in `localStorage` under the key `portfolio-theme`.

---

## Credits

- Template: [SnapFolio by BootstrapMade](https://bootstrapmade.com/snapfolio-bootstrap-portfolio-template/)
- Icons: [Bootstrap Icons](https://icons.getbootstrap.com/), [Devicons](https://devicon.dev/)
- Fonts: [Google Fonts](https://fonts.google.com/) — Roboto, Ubuntu, Nunito

---

## License

Template licensed under [BootstrapMade License](https://bootstrapmade.com/license/). Custom content © Naol Gonfa.
