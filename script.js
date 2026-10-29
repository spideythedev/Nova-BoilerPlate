
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const themeToggle = $("#themeToggle");
const themeIcon = $("#themeIcon");
const themeLabel = $("#themeLabel");
const sidebar = $("#sidebar");
const menuToggle = $("#menuToggle");
const toastRegion = $("#toastRegion");
const demoModal = $("#demoModal");

function readTheme() {
  try {
    return localStorage.getItem("forma-theme");
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("forma-theme", theme);
  } catch {
    // The theme still works when storage is unavailable.
  }
}

function applyTheme(theme) {
  const dark = theme === "dark";

  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeIcon.textContent = dark ? "☼" : "◐";
  themeLabel.textContent = dark ? "Switch to light" : "Switch to dark";
  themeToggle.setAttribute("aria-label", themeLabel.textContent);

  const themeColor = $('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.content = dark ? "#151614" : "#fafaf9";
  }
}

const savedTheme = readTheme();
applyTheme(
  savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : "light"
);

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark"
    ? "light"
    : "dark";

  applyTheme(next);
  saveTheme(next);
});

// Mobile navigation

function closeMenu() {
  sidebar.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
  menuToggle.textContent = isOpen ? "×" : "☰";
});

$$(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    closeMenu();

    $$(".nav-link").forEach(item => {
      item.classList.toggle("active", item === link);
    });
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
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

  const heading = document.createElement("strong");
  heading.textContent = title;

  const description = document.createElement("p");
  description.textContent = message;

  const dismiss = document.createElement("button");
  dismiss.className = "toast-dismiss";
  dismiss.type = "button";
  dismiss.textContent = "×";
  dismiss.setAttribute("aria-label", "Dismiss notification");

  content.append(heading, description);
  toast.append(icon, content, dismiss);
  toastRegion.append(toast);

  let timer;

  function removeToast() {
    clearTimeout(timer);

    if (!toast.isConnected) return;

    toast.classList.add("toast-out");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true
    });

    // Also remove if transitions are disabled.
    setTimeout(() => toast.remove(), 250);
  }

  dismiss.addEventListener("click", removeToast);
  timer = setTimeout(removeToast, 4000);
}

$$("[data-toast]").forEach(button => {
  button.addEventListener("click", () => {
    showToast(button.dataset.toast);
  });
});

// Email input validation

const demoEmail = $("#demoEmail");
const emailMessage = $("#emailMessage");

$("#emailSubmit").addEventListener("click", () => {
  const email = demoEmail.value.trim();

  emailMessage.className = "field-message";

  if (!email) {
    emailMessage.textContent = "Please enter your email address.";
    emailMessage.classList.add("error");
    demoEmail.setAttribute("aria-invalid", "true");
    demoEmail.focus();
    return;
  }

  if (!demoEmail.validity.valid) {
    emailMessage.textContent = "Please enter a valid email address.";
    emailMessage.classList.add("error");
    demoEmail.setAttribute("aria-invalid", "true");
    demoEmail.focus();
    return;
  }

  emailMessage.textContent = "Valid email format. No data was submitted.";
  emailMessage.classList.add("success");
  demoEmail.removeAttribute("aria-invalid");
});

demoEmail.addEventListener("input", () => {
  emailMessage.textContent = "";
  emailMessage.className = "field-message";
  demoEmail.removeAttribute("aria-invalid");
});

// Native dialog

function openModal() {
  if (typeof demoModal.showModal === "function") {
    demoModal.showModal();
  }
}

function closeModal() {
  if (demoModal.open) demoModal.close();
}

$("#openModal").addEventListener("click", openModal);
$("#closeModal").addEventListener("click", closeModal);
$("#cancelModal").addEventListener("click", closeModal);

$("#confirmModal").addEventListener("click", () => {
  closeModal();
  showToast("You confirmed the example action.");
});

demoModal.addEventListener("click", event => {
  if (event.target === demoModal) closeModal();
});

// Tabs

$$(".tabs").forEach(tabList => {
  const tabs = $$('[role="tab"]', tabList);
  const panelIds = tabs.map(tab => tab.getAttribute("aria-controls"));
  const panels = panelIds.map(id => document.getElementById(id));

  function activateTab(index, moveFocus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;

      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;

      panels[i].hidden = !active;
    });

    if (moveFocus) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(index));

    tab.addEventListener("keydown", event => {
      let nextIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(nextIndex, true);
    });
  });
});

// Copyable component snippets

const snippets = {
  button: `<button class="button button-primary" type="button">
  Save changes →
</button>

<button class="button button-secondary" type="button">
  Cancel
</button>

<button class="button button-quiet" type="button">
  Learn more
</button>`,

  card: `<article class="sample-card">
  <div class="sample-card-icon" aria-hidden="true">✳</div>
  <div>
    <span class="sample-kicker">A LITTLE MORE CLARITY</span>
    <h4>Space to think.</h4>
    <p>Good design gives the content room to breathe.</p>
  </div>
</article>`,

  input: `<div class="preview-form">
  <label for="email">Email address</label>
  <input id="email" type="email"
    placeholder="you@example.com"
    autocomplete="email">
</div>`,

  alert: `<div class="alert alert-success" role="status">
  <span class="alert-icon" aria-hidden="true">✓</span>
  <div>
    <strong>All changes saved</strong>
    <p>Your work is up to date.</p>
  </div>
</div>`,

  modal: `<dialog class="modal" id="myDialog">
  <h2 id="dialogTitle">Confirm your action</h2>
  <p>Review the details before continuing.</p>
  <button class="button button-secondary"
    onclick="this.closest('dialog').close()">
    Cancel
  </button>
</dialog>

<button class="button button-primary"
  onclick="document.querySelector('#myDialog').showModal()">
  Open dialog
</button>`,

  tabs: `<div class="tabs" role="tablist" aria-label="Sections">
  <button class="tab active" role="tab"
    aria-selected="true">Overview</button>
  <button class="tab" role="tab"
    aria-selected="false">Details</button>
</div>`
};

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard access is unavailable.");
  }
}

$$("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const snippet = snippets[button.dataset.copy];

    if (!snippet) {
      showToast("This example is not available.", "Unable to copy");
      return;
    }

    try {
      await copyText(snippet);
      showToast("Component HTML copied to clipboard.");
    } catch {
      showToast("Allow clipboard access or copy the code manually.", "Unable to copy");
    }
  });
});

$("#copyStarter").addEventListener("click", async () => {
  const code = `<link rel="stylesheet" href="style.css">
<script src="script.js" defer><\/script>

<button class="button button-primary"
  data-toast="Hello, world!">
  Get started →
</button>`;

  try {
    await copyText(code);
    showToast("Starter markup copied to clipboard.");
  } catch {
    showToast("Clipboard access is unavailable.", "Unable to copy");
  }
});

// Keep navigation highlighting aligned with the current section.

if ("IntersectionObserver" in window) {
  const sections = $$("main section[id]");

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    $$(".nav-link").forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });
  }, {
    rootMargin: "-15% 0px -65% 0px",
    threshold: [0, 0.25, 0.5]
  });

  sections.forEach(section => observer.observe(section));
}
