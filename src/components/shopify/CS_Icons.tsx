const CS_ICON = "h-5 w-5 shrink-0 text-[#4a4a4a]";

export function CS_ShopifyLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-[10px] bg-[#303030] text-white ${className}`}
    >
      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
        <path d="M10.2 2.5c-.9 0-1.7.4-2.2 1.1L3.5 4.2c-.3.1-.5.4-.5.7v11.6c0 .6.5 1 1 1h12c.6 0 1-.4 1-1V4.9c0-.3-.2-.6-.5-.7l-4.5-.6c-.5-.7-1.3-1.1-2.2-1.1h-.1zm-.2 1.2h.1c.4 0 .8.2 1 .5l.2.3H8.8l.2-.3c.2-.3.6-.5 1-.5zM5 6.2h10v9.3H5V6.2z" />
      </svg>
    </div>
  );
}

export function CS_NavIcon({ name }: { name: string }) {
  switch (name) {
    case "home":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10.6 3.5 16 8.2V16a1 1 0 0 1-1 1h-3.5v-4.5H8.5V17H5a1 1 0 0 1-1-1V8.2l5.4-4.7a1 1 0 0 1 1.2 0z" />
        </svg>
      );
    case "orders":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M6 3h8l1 2h2v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5h2l1-2zm1.2 2 5.6.1L11.5 4H7.2l0 1zm-2.2 3v7h10V8H5z" />
        </svg>
      );
    case "products":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M11.5 3a1.5 1.5 0 0 1 1.4 1l.6 2H16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2.5l.6-2A1.5 1.5 0 0 1 8.5 3h3zm-3 2h3l-.4-1.3a.5.5 0 0 0-.5-.4h-1.2a.5.5 0 0 0-.5.4L8.5 5z" />
        </svg>
      );
    case "customers":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.5 7.5a5.5 5.5 0 0 1 11 0H4.5z" />
        </svg>
      );
    case "growth":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10 3a7 7 0 1 0 7 7h-1.5a5.5 5.5 0 1 1-5.5-5.5V3zm0 3.5 3.2 3.2-1.1 1-1.6-1.6V16H9V7.1L7.4 8.7l-1.1-1L10 6.5z" />
        </svg>
      );
    case "discounts":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M12.2 3 17 7.8l-6.4 6.4a2 2 0 0 1-2.8 0L3 9.4a2 2 0 0 1 0-2.8L9.4 3a2 2 0 0 1 2.8 0zM7.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
      );
    case "content":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5 4h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm1.5 2v8h7V6h-7zm1 1h5v1.5h-5V7zm0 2.5h5V11h-5V9.5z" />
        </svg>
      );
    case "markets":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5.6 6H13a12 12 0 0 0-1.2-4.3A5.5 5.5 0 0 1 15.6 9zM10 4.5c.8 1.1 1.4 2.6 1.6 4.5H8.4c.2-1.9.8-3.4 1.6-4.5zM6.4 4.7A12 12 0 0 0 5.2 9H3.4a5.5 5.5 0 0 1 3-4.3zM3.4 11H5.2c.3 1.6.9 3 1.7 4.2A5.5 5.5 0 0 1 3.4 11zm4.6 4.8c-.8-1.2-1.4-2.6-1.6-4.3h3.2c-.2 1.7-.8 3.1-1.6 4.3zm4 0c-.8-1.2-1.4-2.6-1.6-4.3h3.2c-.2 1.7-.8 3.1-1.6 4.3zm1.8-6.3c.3-1.6.9-3 1.7-4.2A5.5 5.5 0 0 1 16.6 11H14.8a12 12 0 0 0-1.6-4.5z" />
        </svg>
      );
    case "finances":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5 4h10v2H5V4zm0 4h10v8H5V8zm2 2v4h6v-4H7zm1 1h1.5v2H8v-2zm2.5 0H12v2h-1.5v-2z" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5 15V9h2v6H5zm4-4V5h2v6H9zm4 2V7h2v6h-2z" />
        </svg>
      );
    case "online-store":
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M4 8 5.5 5h9L16 8v8H4V8zm1.3 0H6l-.5 1.2h-.2L5.3 8zm8.4 0h.7l-.5 1.2h-1.1L13.7 8zM6 9.5v5.5h8V9.5H6z" />
        </svg>
      );
    default:
      return (
        <svg className={CS_ICON} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <circle cx="10" cy="10" r="2.5" />
        </svg>
      );
  }
}

export function CS_ChevronRight({ className = "h-4 w-4 text-[#8a8a8a]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M8 5.5 12.5 10 8 14.5V5.5z" />
    </svg>
  );
}

export function CS_TrendUp({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 2 10 6H7v4H5V6H2l4-4z" />
    </svg>
  );
}
