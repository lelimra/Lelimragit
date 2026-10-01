"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/lib/navigation";
import {
  Sparkles,
  Bot,
  X,
  Send,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  Building2,
  Gauge,
  ShieldCheck,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAIAssistant } from "@/context/AiAssistantContext";
import { getGeneralWhatsAppUrl } from "@/utils/whatsapp";

/* =========================================================
   TYPES
========================================================= */

interface RecommendedProduct {
  id: string;
  name: string;
  slug: string;
  sweep?: string;
  category?: string;
  model?: string;
}

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
  recommendedProducts?: RecommendedProduct[];
}

interface SuggestionChip {
  label: string;
  prompt: string;
  icon: React.ElementType;
}

/* =========================================================
   COMPONENT
========================================================= */

export const AIAssistantModal: React.FC = () => {
  const t = useTranslations("AIAssistant");

  const {
    isOpen,
    closeAssistant,
    openAssistant,
    initialPrompt,
    setInitialPrompt,
  } = useAIAssistant();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* =========================================================
     INITIAL MESSAGE
  ========================================================= */

  const createInitialMessage = useCallback((): Message => {
    return {
      id: "welcome-1",
      role: "model",
      content: t("welcome.message"),
      timestamp: new Date(),
    };
  }, [t]);

  /* =========================================================
     SUGGESTION CHIPS
  ========================================================= */

  const suggestionChips: SuggestionChip[] = [
    {
      label: t("suggestions.roomSizeTelugu"),
      prompt: t("suggestions.roomSizeTeluguPrompt"),
      icon: Sparkles,
    },
    {
      label: t("suggestions.roomSizeHindi"),
      prompt: t("suggestions.roomSizeHindiPrompt"),
      icon: Sparkles,
    },
    {
      label: t("suggestions.roomSize"),
      prompt: t("suggestions.roomSizePrompt"),
      icon: HelpCircle,
    },
    {
      label: t("suggestions.superStockist"),
      prompt: t("suggestions.superStockistPrompt"),
      icon: Building2,
    },
    {
      label: t("suggestions.highestRpm"),
      prompt: t("suggestions.highestRpmPrompt"),
      icon: Gauge,
    },
    {
      label: t("suggestions.warranty"),
      prompt: t("suggestions.warrantyPrompt"),
      icon: ShieldCheck,
    },
  ];

  /* =========================================================
     INITIALIZE MESSAGES
  ========================================================= */

  useEffect(() => {
    setMessages((currentMessages) => {
      if (currentMessages.length === 0) {
        return [createInitialMessage()];
      }

      return currentMessages;
    });
  }, [createInitialMessage]);

  /* =========================================================
     SCROLL TO BOTTOM
  ========================================================= */

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    scrollToBottom();

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, messages, scrollToBottom]);

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend ?? inputQuery).trim();

      if (!query || isLoading) {
        return;
      }

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: query,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInputQuery("");
      setIsLoading(true);

      try {
        /*
         * Convert conversation history into the format
         * expected by the backend.
         */
        const historyPayload = updatedMessages.map((message) => ({
          role: message.role,
          content: message.content,
        }));

        /*
         * Detect current website language.
         *
         * Example:
         * en
         * hi
         * te
         * ur
         */
        const currentLanguage =
          typeof document !== "undefined"
            ? document.documentElement.lang || "en"
            : "en";

        /*
         * Send request to your backend.
         *
         * If your backend is hosted separately, replace
         * this URL with your NEXT_PUBLIC_API_URL endpoint.
         */
        const apiUrl = "/api/ai-assistant";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: historyPayload,
            language: currentLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `AI Assistant API error: ${response.status}`
          );
        }

        const data = await response.json();

        /*
         * Backend response expected:
         *
         * {
         *   text: "...",
         *   recommendedProducts: [
         *     {
         *       id: "...",
         *       name: "...",
         *       slug: "...",
         *       sweep: "1200 mm"
         *     }
         *   ]
         * }
         *
         * Product data comes from backend.
         * No static product catalog is used here.
         */

        const recommendedProducts: RecommendedProduct[] =
          Array.isArray(data.recommendedProducts)
            ? data.recommendedProducts
                .filter(
                  (product: unknown): product is RecommendedProduct => {
                    if (
                      !product ||
                      typeof product !== "object"
                    ) {
                      return false;
                    }

                    const item =
                      product as Partial<RecommendedProduct>;

                    return (
                      typeof item.id === "string" &&
                      typeof item.name === "string" &&
                      typeof item.slug === "string"
                    );
                  }
                )
                .slice(0, 3)
            : [];

        const botReply: Message = {
          id: `bot-${Date.now()}`,
          role: "model",
          content:
            typeof data.text === "string" && data.text.trim()
              ? data.text
              : t("fallback.ready"),
          timestamp: new Date(),
          recommendedProducts,
        };

        setMessages((previousMessages) => [
          ...previousMessages,
          botReply,
        ]);
      } catch (error) {
        console.error("Limra AI Assistant error:", error);

        const fallbackReply: Message = {
          id: `bot-error-${Date.now()}`,
          role: "model",
          content: t("fallback.connection"),
          timestamp: new Date(),
        };

        setMessages((previousMessages) => [
          ...previousMessages,
          fallbackReply,
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputQuery, isLoading, messages, t]
  );

  /* =========================================================
     EXTERNAL INITIAL PROMPT
  ========================================================= */

  useEffect(() => {
    if (!initialPrompt || !isOpen) {
      return;
    }

    handleSendMessage(initialPrompt);
    setInitialPrompt(undefined);
  }, [
    initialPrompt,
    isOpen,
    handleSendMessage,
    setInitialPrompt,
  ]);

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    setMessages([createInitialMessage()]);
    setInputQuery("");
    setIsLoading(false);
  };

  /* =========================================================
     INLINE MARKDOWN
  ========================================================= */

  const renderInlineFormatting = (text: string) => {
    /*
     * Supports:
     *
     * **bold text**
     */
    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      if (
        part.startsWith("**") &&
        part.endsWith("**") &&
        part.length >= 4
      ) {
        return (
          <strong
            key={index}
            className="font-semibold text-slate-900"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  /* =========================================================
     MESSAGE FORMATTING
  ========================================================= */

  const renderFormattedText = (content: string) => {
    const lines = content.split("\n");

    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, index) => {
          const trimmed = line.trim();

          /*
           * ### Heading
           */
          if (trimmed.startsWith("### ")) {
            return (
              <p
                key={index}
                className="font-bold text-slate-900 text-sm pt-1"
              >
                {renderInlineFormatting(
                  trimmed.replace(/^###\s+/, "")
                )}
              </p>
            );
          }

          /*
           * ## Heading
           */
          if (trimmed.startsWith("## ")) {
            return (
              <p
                key={index}
                className="font-bold text-slate-900 text-sm pt-1"
              >
                {renderInlineFormatting(
                  trimmed.replace(/^##\s+/, "")
                )}
              </p>
            );
          }

          /*
           * Bullet points
           *
           * - item
           * • item
           * * item
           */
          if (
            trimmed.startsWith("- ") ||
            trimmed.startsWith("• ") ||
            trimmed.startsWith("* ")
          ) {
            const itemText = trimmed.replace(
              /^[-•*]\s+/,
              ""
            );

            return (
              <div
                key={index}
                className="flex items-start gap-1.5 pl-1"
              >
                <span className="text-[#e31e24] font-bold">
                  •
                </span>

                <span>
                  {renderInlineFormatting(itemText)}
                </span>
              </div>
            );
          }

          /*
           * Numbered list
           *
           * 1. item
           * 2. item
           */
          const numberedMatch = trimmed.match(
            /^(\d+)\.\s+(.+)$/
          );

          if (numberedMatch) {
            return (
              <div
                key={index}
                className="flex items-start gap-1.5 pl-1"
              >
                <span className="font-bold text-[#091a32]">
                  {numberedMatch[1]}.
                </span>

                <span>
                  {renderInlineFormatting(
                    numberedMatch[2]
                  )}
                </span>
              </div>
            );
          }

          /*
           * Empty line
           */
          if (!trimmed) {
            return (
              <div
                key={index}
                className="h-1"
              />
            );
          }

          /*
           * Normal paragraph
           */
          return (
            <p key={index}>
              {renderInlineFormatting(line)}
            </p>
          );
        })}
      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          FLOATING LAUNCHER
      ===================================================== */}

      {!isOpen && (
        <button
          type="button"
          onClick={() => openAssistant()}
          className="
            fixed
            bottom-24 right-4
            sm:bottom-6 sm:right-6
            z-[2147483645]
            flex items-center gap-1
            bg-[#091a32]
            hover:bg-[#0c2344]
            text-white
            px-2 py-2
            rounded-full
            shadow-xl
            border border-slate-700/50
            hover:shadow-2xl
            transition-all duration-300
            transform hover:-translate-y-0.5
            group
            focus:outline-none
            focus:ring-4 focus:ring-blue-500/20
          "
          aria-label={t("launcher.ariaLabel")}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e31e24] to-red-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>

            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#091a32] animate-pulse" />
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight">
                {t("launcher.title")}
              </span>

              <span className="bg-[#e31e24] text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full text-white">
                {t("launcher.badge")}
              </span>
            </div>

            <p className="text-[10px] text-slate-300 leading-tight">
              {t("launcher.subtitle")}
            </p>
          </div>

          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
        </button>
      )}

      {/* =====================================================
          ASSISTANT MODAL
      ===================================================== */}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end sm:p-6 bg-black/40 backdrop-blur-xs sm:bg-transparent pointer-events-auto">
          <div
            className="
              w-full
              sm:w-[380px]
              sm:max-w-[380px]
              h-[85vh]
              sm:h-[540px]
              max-h-[90vh]
              bg-white
              rounded-t-2xl
              sm:rounded-2xl
              shadow-2xl
              border border-slate-200
              flex flex-col
              overflow-hidden
              animate-in
              fade-in
              slide-in-from-bottom-6
              duration-200
            "
            role="dialog"
            aria-modal="true"
            aria-label={t("modal.ariaLabel")}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bg-gradient-to-r from-[#091a32] via-[#0e274b] to-[#091a32] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e31e24] to-red-500 flex items-center justify-center text-white shadow-inner">
                    <Bot className="w-5 h-5" />
                  </div>

                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#091a32]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-tight">
                      {t("header.title")}
                    </span>

                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {t("header.online")}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-amber-400" />

                    <span>
                      {t("header.languages")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title={t("header.reset")}
                  aria-label={t("header.reset")}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closeAssistant}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title={t("header.close")}
                  aria-label={t("header.close")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* =================================================
                QUICK CONTEXT BAR
            ================================================= */}

            <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5 text-slate-600 min-w-0">
                <span className="inline-block px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-extrabold shrink-0">
                  🇮🇳 {t("context.allLanguages")}
                </span>

                <span className="truncate">
                  {t("context.languageHint")}
                </span>
              </span>

              <Link
                href="/dealers"
                onClick={closeAssistant}
                className="text-[#091a32] font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <span>{t("context.applications")}</span>

                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* =================================================
                CHAT BODY
            ================================================= */}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((message) => {
                const isUser = message.role === "user";

                const recommendedFans =
                  !isUser
                    ? message.recommendedProducts ?? []
                    : [];

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      isUser
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div className="flex items-start gap-2 max-w-[88%]">
                      {!isUser && (
                        <div className="w-6 h-6 rounded-full bg-[#091a32] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-3.5 py-2.5 shadow-xs ${
                          isUser
                            ? "bg-[#091a32] text-white rounded-tr-xs"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                        }`}
                      >
                        {isUser ? (
                          <p className="text-xs sm:text-[13px] whitespace-pre-wrap">
                            {message.content}
                          </p>
                        ) : (
                          renderFormattedText(
                            message.content
                          )
                        )}
                      </div>
                    </div>

                    {/* =================================================
                        BACKEND RECOMMENDED PRODUCTS
                    ================================================= */}

                    {recommendedFans.length > 0 && (
                      <div className="mt-2 ml-8 flex flex-wrap gap-1.5 max-w-[85%]">
                        {recommendedFans
                          .slice(0, 3)
                          .map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={closeAssistant}
                              className="
                                inline-flex
                                items-center
                                gap-1
                                px-2.5
                                py-1
                                rounded-full
                                bg-blue-50
                                border
                                border-blue-200
                                text-blue-900
                                text-[11px]
                                font-semibold
                                hover:bg-blue-100
                                transition-colors
                              "
                            >
                              <span>
                                {product.name}

                                {product.sweep
                                  ? ` (${product.sweep})`
                                  : ""}
                              </span>

                              <ExternalLink className="w-2.5 h-2.5 text-blue-600" />
                            </Link>
                          ))}
                      </div>
                    )}

                    {/* =================================================
                        MESSAGE TIME
                    ================================================= */}

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                );
              })}

              {/* =================================================
                  TYPING INDICATOR
              ================================================= */}

              {isLoading && (
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="w-6 h-6 rounded-full bg-[#091a32] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#e31e24] rounded-full animate-bounce [animation-delay:-0.3s]" />

                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />

                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />

                      <span className="text-[11px] text-slate-500 font-medium ml-1.5">
                        {t("thinking")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* =================================================
                SUGGESTION CHIPS
            ================================================= */}

            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-white border-t border-slate-100 shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#e31e24]" />

                  {t("suggestions.title")}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {suggestionChips.map(
                    (chip, index) => {
                      const Icon = chip.icon;

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            handleSendMessage(
                              chip.prompt
                            )
                          }
                          disabled={isLoading}
                          className="
                            text-left
                            text-[11px]
                            bg-slate-100
                            hover:bg-slate-200
                            text-slate-700
                            font-medium
                            px-2.5
                            py-1
                            rounded-full
                            border
                            border-slate-200
                            transition-colors
                            flex
                            items-center
                            gap-1
                            disabled:opacity-50
                          "
                        >
                          <Icon className="w-3 h-3 text-[#091a32] shrink-0" />

                          <span>{chip.label}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                INPUT
            ================================================= */}

            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(event) =>
                    setInputQuery(event.target.value)
                  }
                  placeholder={t(
                    "input.placeholder"
                  )}
                  disabled={isLoading}
                  className="
                    flex-1
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    px-3.5
                    py-2.5
                    text-xs
                    sm:text-sm
                    text-slate-900
                    placeholder:text-slate-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#091a32]
                    focus:bg-white
                    disabled:opacity-50
                    transition-all
                  "
                />

                <button
                  type="submit"
                  disabled={
                    !inputQuery.trim() ||
                    isLoading
                  }
                  className="
                    bg-[#e31e24]
                    hover:bg-[#c4181d]
                    text-white
                    p-2.5
                    rounded-xl
                    shadow-xs
                    transition-colors
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    shrink-0
                  "
                  aria-label={t("input.send")}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* =================================================
                  HUMAN ESCALATION
              ================================================= */}

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {t("humanAssistance.label")}
                </span>

                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />

                  <span>
                    {t("humanAssistance.whatsapp")}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantModal;