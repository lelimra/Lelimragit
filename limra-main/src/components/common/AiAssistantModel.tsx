import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  Truck,
  ExternalLink,
  ChevronDown,
  Globe,
} from "lucide-react";
import { useAIAssistant } from "@/context/AiAssistantContext";
import { products } from "@/data/products";
import { getGeneralWhatsAppUrl } from "@/utils/whatsapp";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    role: "model",
    content:
      "👋 Hello! I am **Limra AI**, your official technical fan advisor from **LE LIMRA (LIMRA INDUSTRIES, Hyderabad)**.\n\n🇮🇳 **I understand and speak ALL Indian languages fluently!**\nYou can chat with me in **English, हिंदी (Hindi), తెలుగు (Telugu), اردو (Urdu), தமிழ் (Tamil), ಕನ್ನಡ (Kannada), मराठी (Marathi), বাংলা (Bengali), ગુજરાતી (Gujarati)** or conversational Hinglish / Tenglish.\n\nAsk me about:\n- 💡 **Fan sizing** for your room or hall dimensions\n- ⚡ **RPM, air delivery (CMM) & power consumption**\n- 🏢 **Applications for Super Stockist, Distributor & Dealership**\n- 🛡️ **2-Year Warranty & factory dispatch from Hyderabad**\n\nHow can I help you today? / మీకు ఏ సమాచారం కావాలి? / आपको क्या सहायता चाहिए?",
    timestamp: new Date(),
  },
];

const SUGGESTION_CHIPS = [
  {
    label: "తెలుగు: 12x12 గదికి ఏ ఫ్యాన్ బాగుంటుంది?",
    prompt: "12x12 గదికి ఏ సీలింగ్ ఫ్యాన్ బాగుంటుంది?",
    icon: Sparkles,
  },
  {
    label: "हिंदी: 12x12 कमरे के लिए कौन सा पंखा बेस्ट है?",
    prompt: "12x12 कमरे के लिए कौन सा सीलिंग पंखा सबसे अच्छा है?",
    icon: Sparkles,
  },
  {
    label: "Recommend fan for room size",
    prompt: "Which fan size is recommended for my room dimensions?",
    icon: HelpCircle,
  },
  {
    label: "Apply for Super Stockist",
    prompt: "How can I apply for Super Stockist or Distributor partnership?",
    icon: Building2,
  },
  {
    label: "Highest RPM & Air Delivery",
    prompt: "Which LE LIMRA fans have the highest RPM and maximum air delivery?",
    icon: Gauge,
  },
  {
    label: "2-Year Warranty Coverage",
    prompt: "What is covered under the LE LIMRA 2-Year Manufacturer Warranty?",
    icon: ShieldCheck,
  },
];

export const AIAssistantModal: React.FC = () => {
  const { isOpen, closeAssistant, openAssistant, initialPrompt, setInitialPrompt } =
    useAIAssistant();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  // Handle external initial prompt if passed
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
      setInitialPrompt(undefined);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const botReply: Message = {
        id: `bot-${Date.now()}`,
        role: "model",
        content:
          data.text ||
          "I am ready to assist you. Could you please specify your requirement or connect directly with our sales team?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      console.error("AI Assistant error:", err);
      const fallbackReply: Message = {
        id: `bot-err-${Date.now()}`,
        role: "model",
        content:
          "I encountered a temporary connection issue. For immediate assistance with technical details or dealership inquiries, you can also reach our Hyderabad team directly on WhatsApp or phone.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const findMatchingProducts = (text: string) => {
    const t = text.toLowerCase();
    return products.filter((p) => {
      const nameKey = p.name.toLowerCase();
      if (t.includes("enticer") && nameKey.includes("enticer")) return true;
      if (t.includes("aero prime") && nameKey.includes("aero prime")) return true;
      if (t.includes("storm pro") && nameKey.includes("storm pro")) return true;
      if (t.includes("breeze") && nameKey.includes("breeze")) return true;
      if (t.includes("royal deco") && nameKey.includes("royal deco")) return true;
      if (t.includes("coolair") && nameKey.includes("coolair")) return true;
      if (t.includes("hurricane") && nameKey.includes("hurricane")) return true;
      return false;
    });
  };

  // Helper to render markdown-like text
  const renderFormattedText = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith("### ")) {
            return (
              <p key={idx} className="font-bold text-slate-900 text-sm pt-1">
                {trimmed.replace("### ", "")}
              </p>
            );
          }

          if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
            const itemText = trimmed.replace(/^[-•*]\s+/, "");
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-[#e31e24] font-bold">•</span>
                <span>{renderInlineFormatting(itemText)}</span>
              </div>
            );
          }

          if (/^\d+\.\s+/.test(trimmed)) {
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
            if (numMatch) {
              return (
                <div key={idx} className="flex items-start gap-1.5 pl-1">
                  <span className="font-bold text-[#091a32]">{numMatch[1]}.</span>
                  <span>{renderInlineFormatting(numMatch[2])}</span>
                </div>
              );
            }
          }

          if (trimmed === "") {
            return <div key={idx} className="h-1" />;
          }

          return <p key={idx}>{renderInlineFormatting(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineFormatting = (text: string) => {
    // Bold parsing **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => openAssistant()}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 2147483645,
          }}
          className="flex items-center gap-2.5 bg-[#091a32] hover:bg-[#0c2344] text-white px-4 py-3 rounded-full shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 group focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e31e24] to-red-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#091a32] animate-pulse" />
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight">AI Assistant</span>
              <span className="bg-[#e31e24] text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full text-white">
                New
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight">Ask Fan &amp; Trade Advisor</p>
          </div>

          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
        </button>
      )}

      {/* Assistant Modal / Drawer */}
{isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end sm:p-6 bg-black/40 backdrop-blur-xs sm:bg-transparent pointer-events-auto">
          <div
            className="w-full sm:w-[380px] sm:max-w-[380px] h-[85vh] sm:h-[540px] max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="LE LIMRA AI Fan Advisor"
          >
            {/* Header */}
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
                    <span className="font-bold text-sm tracking-tight">Limra AI Assistant</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-amber-400" />
                    <span>Speaks all Indian Languages (తెలుగు, हिंदी, اردو...)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={closeAssistant}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Close Assistant"
                  aria-label="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Context Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="inline-block px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[10px] font-extrabold">🇮🇳 All Languages</span>
                <span>Type in English, Telugu, Hindi, Tamil, Urdu...</span>
              </span>

              <Link
                href="/dealers"
                onClick={closeAssistant}
                className="text-[#091a32] font-semibold hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Applications</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((message) => {
                const isUser = message.role === "user";
                const recommendedFans = !isUser ? findMatchingProducts(message.content) : [];

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
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
                          renderFormattedText(message.content)
                        )}
                      </div>
                    </div>

                    {/* Associated Product Chips */}
                    {recommendedFans.length > 0 && (
                      <div className="mt-2 ml-8 flex flex-wrap gap-1.5 max-w-[85%]">
                        {recommendedFans.slice(0, 3).map((prod) => (
                          <Link
                            key={prod.id}
                            href={`/products/${prod.slug}`}
                            onClick={closeAssistant}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-semibold hover:bg-blue-100 transition-colors"
                          >
                            <span>{prod.name.split(" ")[0]} ({prod.specifications.sweep})</span>
                            <ExternalLink className="w-2.5 h-2.5 text-blue-600" />
                          </Link>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}

              {/* Loading Typing Indicator */}
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
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-white border-t border-slate-100 shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#e31e24]" />
                  Suggested Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTION_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.prompt)}
                      disabled={isLoading}
                      className="text-left text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <chip.icon className="w-3 h-3 text-[#091a32] shrink-0" />
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input & Action Bar */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask in any language (English, తెలుగు, हिंदी, اردو, தமிழ்...)"
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#091a32] focus:bg-white disabled:opacity-50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="bg-[#e31e24] hover:bg-[#c4181d] text-white p-2.5 rounded-xl shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* WhatsApp Human Escalation Link */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Prefer human assistance?</span>
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp Trade Team</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
