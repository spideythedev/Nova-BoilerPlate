
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const themeToggle = $("#themeToggle");
const themeLabel = $("#themeLabel");
const themeIcon = $("#themeIcon");
const sidebar = $("#sidebar");
const menuToggle = $("#menuToggle");
const dialog = $("#demoDialog");
const toastRegion = $("#toastRegion");

function getSavedTheme() {
  try {
    return localStorage.getItem("ui-library-theme");
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  const dark = theme === "dark";

  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeLabel.textContent = dark ? "Dark appearance" : "Light appearance";
  themeIcon.textContent = dark ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} appearance`);

  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = dark ? "#11141a" : "#ffffff";
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);

  try {
    localStorage.setItem("ui-library-theme", next);
  } catch {
    // Appearance still changes when storage is unavailable.
  }
}

applyTheme(getSavedTheme() === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", toggleTheme);
$("#footerTheme").addEventListener("click", toggleTheme);

// Mobile navigation

function closeMenu() {
  sidebar.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuToggle.textContent = open ? "×" : "☰";

  if (open) $(".side-link", sidebar).focus();
});

$$(".side-link").forEach(link => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) closeMenu();
});

// Toast notifications

function showToast(message, title = "Done") {
  const toast = document.createElement("div");
  toast.className = "toast";

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.textContent = "✓";
  icon.setAttribute("aria-hidden", "true");

  const content = document.createElement("div");
  content.className = "toast-content";

  const heading = document.createElement("strong");
  heading.textContent = title;

  const description = document.createElement("p");
  description.textContent = message;

  const close = document.createElement("button");
  close.className = "toast-close";
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Dismiss notification");

  content.append(heading, description);
  toast.append(icon, content, close);
  toastRegion.append(toast);

  let timer;

  function remove() {
    clearTimeout(timer);
    if (!toast.isConnected) return;

    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 220);
  }

  close.addEventListener("click", remove);
  timer = setTimeout(remove, 4000);
}

$$("[data-toast]").forEach(button => {
  button.addEventListener("click", () => {
    showToast(button.dataset.toast);
  });
});

// Demonstration input: validates format, does not submit data.

const emailInput = $("#sampleEmail");
const emailFeedback = $("#inputFeedback");

$("#sampleSubmit").addEventListener("click", () => {
  emailFeedback.className = "input-feedback";

  if (!emailInput.value.trim()) {
    emailFeedback.textContent = "Please enter your email.";
    emailFeedback.classList.add("error");
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.focus();
    return;
  }

  if (!emailInput.validity.valid) {
    emailFeedback.textContent = "Enter a valid email address.";
    emailFeedback.classList.add("error");
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.focus();
    return;
  }

  emailFeedback.textContent = "Valid format. Nothing was submitted.";
  emailFeedback.classList.add("success");
  emailInput.removeAttribute("aria-invalid");
});

emailInput.addEventListener("input", () => {
  emailFeedback.textContent = "";
  emailFeedback.className = "input-feedback";
  emailInput.removeAttribute("aria-invalid");
});

// Native accessible dialog

$("#openModal").addEventListener("click", () => {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else showToast("Your browser does not support native dialogs.", "Not supported");
});

function closeDialog() {
  if (dialog.open) dialog.close();
}

$("#closeModal").addEventListener("click", closeDialog);
$("#cancelModal").addEventListener("click", closeDialog);

$("#confirmModal").addEventListener("click", () => {
  closeDialog();
  showToast("You confirmed the example action.");
});

dialog.addEventListener("click", event => {
  if (event.target === dialog) closeDialog();
});

// Keyboard-accessible tabs

$$('[role="tablist"]').forEach(tabList => {
  const tabs = $$('[role="tab"]', tabList);

  function activate(index, focus = false) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));

      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;

      if (panel) panel.hidden = !selected;
    });

    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(index));

    tab.addEventListener("keydown", event => {
      let next = index;

      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;

      event.preventDefault();
      activate(next, true);
    });
  });
});

// Copyable component examples

const snippets = {
  buttons: `<button class="button button-primary" type="button">
  Primary action →
</button>

<button class="button button-soft" type="button">
  Secondary
</button>

<button class="button button-outline" type="button">
  Ghost
</button>`,

  cards: `<article class="sample-card">
  <div class="sample-art" aria-hidden="true">◈</div>
  <div class="sample-copy">
    <strong>Modern design</strong>
    <span>Clean, simple and elegant.</span>
  </div>
  <span class="sample-arrow" aria-hidden="true">↗</span>
</article>`,

  inputs: `<label for="email">Your email</label>
<input id="email" type="email"
  placeholder="name@example.com"
  autocomplete="email">`,

  alerts: `<div class="alert alert-success" role="status">
  <span class="alert-mark" aria-hidden="true">✓</span>
  <div>
    <strong>Success!</strong>
    <p>Your changes have been saved.</p>
  </div>
</div>`,

  modals: `<dialog class="dialog" id="myDialog">
  <h2>Ready to continue?</h2>
  <p>Review the details before continuing.</p>
  <button class="button button-primary"
    onclick="this.closest('dialog').close()">
    Continue
  </button>
</dialog>

<button class="button button-primary"
  onclick="document.querySelector('#myDialog').showModal()">
  Open dialog
</button>`,

  navigation: `<nav class="sample-nav" aria-label="Example">
  <strong>Studio</strong>
  <a href="#home">Home</a>
  <a href="#components">Docs</a>
  <a href="#about">About</a>
</nav>`,

  badges: `<span class="badge badge-green">New</span>
<span class="badge badge-blue">Pro</span>
<span class="badge badge-neutral">Beta</span>`,

  tabs: `<div class="tabs" role="tablist" aria-label="Sections">
  <button class="tab active" role="tab"
    aria-selected="true">Overview</button>
  <button class="tab" role="tab"
    aria-selected="false">Details</button>
</div>`
};

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.readOnly = true;
  textarea.style.cssText = "position:fixed;left:-9999px;top:0";
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Clipboard unavailable");
}

$$("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const snippet = snippets[button.dataset.copy];
    if (!snippet) return;

    try {
      await copyText(snippet);
      showToast("Component markup copied to clipboard.");
    } catch {
      showToast("Clipboard access was unavailable.", "Unable to copy");
    }
  });
});

$("#copyStarter").addEventListener("click", async () => {
  const source = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer><\/script>
</head>
<body>
  <button class="button button-primary" type="button">
    Build something good →
  </button>
</body>
</html>`;

  try {
    await copyText(source);
    showToast("Starter HTML copied to clipboard.");
  } catch {
    showToast("Clipboard access was unavailable.", "Unable to copy");
  }
});

// Keep sidebar state aligned with the visible section.

if ("IntersectionObserver" in window) {
  const sections = $$("main section[id]");
  const observer = new IntersectionObserver(entries => {
    const current = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!current) return;

    $$(".side-link").forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current.target.id}`
      );
    });
  }, {
    rootMargin: "-15% 0px -70% 0px",
    threshold: [0, 0.2, 0.5]
  });

  sections.forEach(section => observer.observe(section));
}
