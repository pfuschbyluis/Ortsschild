(function () {
  "use strict";

  const DEFAULT_DURATION_MS = 8000;
  const SIREN_ICON_SVG = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 16h14v2c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-2z" fill="currentColor" opacity="0.85"/>
      <path d="M7 16V9c0-2.76 2.24-5 5-5s5 2.24 5 5v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M9 16V9.5a3 3 0 0 1 6 0V16" fill="currentColor" opacity="0.9"/>
      <path d="M12 4V2M8.5 5.5L7 4M15.5 5.5L17 4M6.5 8.5L5 8M17.5 8.5L19 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
      <ellipse cx="12" cy="10" rx="2.2" ry="2.8" fill="currentColor" opacity="0.35"/>
    </svg>
  `;

  let activeNotification = null;
  let hideTimer = null;
  let removeTimer = null;

  function isFiveMNui() {
    return typeof window.GetParentResourceName === "function";
  }

  function createIconElement() {
    const icon = document.createElement("span");
    icon.className = "zone-notification__icon";
    icon.innerHTML = SIREN_ICON_SVG;
    return icon;
  }

  function buildNotificationElement(title, subtitle) {
    const notification = document.createElement("div");
    notification.className = "zone-notification";
    notification.setAttribute("role", "status");
    notification.setAttribute("aria-live", "polite");
    notification.setAttribute("aria-atomic", "true");

    const stripeLeft = document.createElement("div");
    stripeLeft.className = "zone-notification__stripe zone-notification__stripe--left";

    const content = document.createElement("div");
    content.className = "zone-notification__content";

    const titleRow = document.createElement("div");
    titleRow.className = "zone-notification__title-row";

    const titleEl = document.createElement("h2");
    titleEl.className = "zone-notification__title";
    titleEl.textContent = title;

    titleRow.appendChild(createIconElement());
    titleRow.appendChild(titleEl);
    titleRow.appendChild(createIconElement());

    const subtitleEl = document.createElement("p");
    subtitleEl.className = "zone-notification__subtitle";
    subtitleEl.textContent = subtitle;

    content.appendChild(titleRow);
    content.appendChild(subtitleEl);

    const stripeRight = document.createElement("div");
    stripeRight.className = "zone-notification__stripe zone-notification__stripe--right";

    notification.appendChild(stripeLeft);
    notification.appendChild(content);
    notification.appendChild(stripeRight);

    return notification;
  }

  function clearTimers() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    if (removeTimer) {
      clearTimeout(removeTimer);
      removeTimer = null;
    }
  }

  function hideZoneNotification() {
    clearTimers();

    if (!activeNotification) {
      return;
    }

    const notification = activeNotification;
    activeNotification = null;

    notification.classList.remove("zone-notification--visible");
    notification.classList.add("zone-notification--hiding");

    removeTimer = setTimeout(() => {
      if (notification.isConnected) {
        notification.remove();
      }
      removeTimer = null;
    }, 400);
  }

  function showZoneNotification(title, subtitle, durationMs = DEFAULT_DURATION_MS) {
    if (!title) {
      return null;
    }

    clearTimers();

    if (activeNotification) {
      activeNotification.remove();
      activeNotification = null;
    }

    const notification = buildNotificationElement(title, subtitle || "");
    document.body.appendChild(notification);
    activeNotification = notification;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notification.classList.add("zone-notification--visible");
      });
    });

    if (durationMs > 0) {
      hideTimer = setTimeout(() => {
        hideZoneNotification();
        hideTimer = null;
      }, durationMs);
    }

    return notification;
  }

  function handleNuiMessage(event) {
    const data = event.data;
    if (!data || typeof data !== "object") {
      return;
    }

    if (data.action === "showZoneNotification") {
      showZoneNotification(data.title, data.subtitle, data.duration);
      return;
    }

    if (data.action === "hideZoneNotification") {
      hideZoneNotification();
    }
  }

  function init() {
    window.addEventListener("message", handleNuiMessage);
    document.documentElement.classList.add(isFiveMNui() ? "nui-mode" : "browser-mode");
  }

  window.showZoneNotification = showZoneNotification;
  window.hideZoneNotification = hideZoneNotification;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
