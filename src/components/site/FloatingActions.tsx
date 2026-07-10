import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { inquiryUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-end px-4 sm:bottom-6 sm:px-6">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full glass text-ink shadow-soft transition-all duration-300",
            show ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2",
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
        <a
          href={inquiryUrl()}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="group flex items-center gap-2 rounded-full bg-[var(--whatsapp)] px-4 py-3 text-sm font-semibold text-white shadow-royal transition-transform hover:scale-[1.04]"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Chat with us</span>
        </a>
      </div>
    </div>
  );
}