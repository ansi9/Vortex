import { X, CheckCircle, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppState } from "../context/AppContext";

type Message = {
  id: string;
  sender: "bot" | "user";
  text?: string;
  type?: "text" | "checklist";
  checklistItems?: { id: string; text: string; checked: boolean }[];
};

const QUICK_ACTIONS = [
  { label: "Build Bucketlist", prompt: "Help me build a safe Bucketlist for today." },
  { label: "Check Safety", prompt: "What's the current safety status of my area?" },
  { label: "Find Pharmacy", prompt: "Find the nearest open pharmacy to me." },
];

const QUICK_REPLIES: Record<string, string> = {
  "Build Bucketlist":
    "The downtown area currently has an 88/100 Safety Index. Crowds are moderate (40%). It is safe, but I recommend avoiding the North Gate exit due to construction. Here's a curated list:",
  "Check Safety":
    "Your current area has a Safety Score of 88/100. Crowd density is 40% — moderate. No incidents reported in the last 2 hours. ✅",
  "Find Pharmacy":
    "Nearest open pharmacy: MedPlus, Station Road (0.3 km). Open 24/7. Walking route is safe — crowd at 18%.",
};

const BUCKETLIST = [
  "Sunrise walk at City Park",
  "Try the new café on 5th Street",
  "Visit the Heritage Museum",
  "Rooftop sunset viewing",
  "Night market food trail",
];

export function AiAssistant() {
  const { isAssistantOpen, setIsAssistantOpen, showNotifDot, setShowNotifDot } = useAppState();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      type: "text",
      text: "Hi! I'm Aira, your smart safety assistant. I can help you check crowd safety, build a trip bucketlist, or find safe amenities nearby. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [actionsUsed, setActionsUsed] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearPendingTimers = () => {
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];
  };

  useEffect(() => () => clearPendingTimers(), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleAssistant = () => {
    if (!isAssistantOpen) setShowNotifDot(false);
    setIsAssistantOpen(!isAssistantOpen);
  };

  const addBotMessage = (text: string, delay = 700) => {
    const t = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "bot", type: "text", text },
      ]);
    }, delay);
    pendingTimers.current.push(t);
  };

  const addBotChecklist = (items: string[], delay = 900) => {
    const t = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          type: "checklist",
          checklistItems: items.map((text, i) => ({ id: `chk-${i}`, text, checked: false })),
        },
      ]);
    }, delay);
    pendingTimers.current.push(t);
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[number]) => {
    if (actionsUsed.has(action.label)) return;
    setActionsUsed((s) => new Set([...s, action.label]));

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      type: "text",
      text: action.prompt,
    };
    setMessages((prev) => [...prev, userMsg]);

    addBotMessage(QUICK_REPLIES[action.label]);

    if (action.label === "Build Bucketlist") {
      addBotChecklist(BUCKETLIST, 1400);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", type: "text", text },
    ]);

    addBotMessage(
      "Thanks for reaching out! I've noted your query. For emergencies, tap the I'M STUCK button in the sidebar."
    );
  };

  const toggleChecklist = (msgId: string, itemId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId || msg.type !== "checklist" || !msg.checklistItems) return msg;
        return {
          ...msg,
          checklistItems: msg.checklistItems.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  };

  const resetChat = () => {
    clearPendingTimers();
    setActionsUsed(new Set());
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        type: "text",
        text: "Hi! I'm Aira, your smart safety assistant. I can help you check crowd safety, build a trip bucketlist, or find safe amenities nearby. How can I help?",
      },
    ]);
  };

  const availableActions = QUICK_ACTIONS.filter((a) => !actionsUsed.has(a.label));

  return (
    <>
      {/* FAB */}
      <button
        onClick={toggleAssistant}
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all z-40"
        data-testid="button-fab-assistant"
        aria-label="Open Aira Assistant"
      >
        {/* Custom Aira dot avatar */}
        <span className="relative flex items-center justify-center w-6 h-6">
          <span className="w-3 h-3 rounded-full bg-white block absolute"></span>
          <Sparkles className="w-6 h-6 text-white" />
        </span>
        {showNotifDot && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-slate-100 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Assistant Panel */}
      {isAssistantOpen && (
        <div
          className="fixed bottom-36 md:bottom-24 right-6 w-[340px] h-[500px] bg-slate-50 rounded-2xl shadow-2xl flex flex-col z-40 border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300"
          style={{ transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
        >
          {/* Header */}
          <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Aira Assistant</span>
            </div>
            <button
              onClick={toggleAssistant}
              className="text-emerald-100 hover:text-white"
              data-testid="button-close-assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.type === "text" && <p className="text-sm leading-relaxed">{msg.text}</p>}

                  {msg.type === "checklist" && msg.checklistItems && (
                    <div className="space-y-2">
                      {msg.checklistItems.map((item) => (
                        <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                          <div className="mt-0.5 relative flex items-center justify-center flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleChecklist(msg.id, item.id)}
                              className="peer sr-only"
                            />
                            <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors"></div>
                            {item.checked && <CheckCircle className="w-3 h-3 text-white absolute" />}
                          </div>
                          <span
                            className={`text-sm select-none transition-all ${
                              item.checked
                                ? "line-through text-slate-400"
                                : "text-slate-700 group-hover:text-slate-900"
                            }`}
                          >
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          {availableActions.length > 0 && (
            <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-slate-100 bg-white">
              {availableActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 transition-colors border border-slate-200"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message Aira…"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Reset */}
          <div className="text-center pb-2 bg-white">
            <button
              onClick={resetChat}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              data-testid="button-reset-assistant"
            >
              Reset Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
