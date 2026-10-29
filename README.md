
# Forma UI

A minimal, white-first UI component foundation built with plain HTML, CSS, and JavaScript.

## Features

- No framework or build tools
- Responsive layouts
- Light and dark themes
- Reusable button, card, input, alert, dialog, and tab styles
- Copyable component examples
- Toast notifications
- Keyboard-accessible interactions
- CSS custom properties for easy customization
- Reduced-motion support

## Getting started

1. Keep `index.html`, `style.css`, and `script.js` in the same directory.
2. Open `index.html` in a modern browser.
3. Start copying and adapting the components.

No installation or compilation is required.

## Customize the design

Edit the CSS variables in `:root` inside `style.css`.

```css
:root {
  --bg: #fafaf9;
  --surface: #ffffff;
  --text: #20211f;
  --muted: #777971;
  --line: #e8e8e3;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
}
```

## Important notes

- Google Fonts requires an internet connection. System font fallbacks are provided.
- Theme persistence uses localStorage when available.
- The email field demonstrates client-side validation only.
  It does not send emails or store submitted data.
- Toasts and dialogs are local UI interactions.
- Copy buttons require clipboard access or a supported fallback.
- The library does not include a backend or external services.

## License

MIT: License under MIT.
