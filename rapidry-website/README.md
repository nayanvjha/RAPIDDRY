# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Waitlist Modal Submission Setup

The homepage waitlist modal sends submissions to an external form service (no backend required).

### Recommended (Form endpoint)

Set these variables in local `.env` and Vercel Project Environment Variables:

- `VITE_WAITLIST_FORM_ENDPOINT`: Your form POST endpoint URL (Formspree/Web3Forms proxy/Apps Script endpoint)
- `VITE_WAITLIST_FORM_BEARER_TOKEN` (optional): Bearer token if your endpoint requires auth

Payload fields sent:

- `name`
- `phone` (normalized Indian mobile)
- `sector`
- `source` (`Website Waitlist Modal`)
- `submitted_at` (ISO datetime)
- `page_url`

### Fallback (EmailJS)

If form endpoint is not set, the modal falls back to EmailJS when all of these are configured:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

### Validation and anti-spam

- Name required
- Sector required
- Phone validated and normalized to Indian 10-digit format
- Honeypot field (`company`) blocks basic bot submissions
- Minimum time-to-submit guard to reduce instant bot posts

### User experience behavior

- Modal opens after 3 seconds or on exit intent
- Submission success message is shown in modal
- Dismiss/submit state is stored in localStorage so repeat visitors are not repeatedly interrupted
