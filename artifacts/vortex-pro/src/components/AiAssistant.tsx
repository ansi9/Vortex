import { Bot, X, CheckCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppState } from "../context/AppContext";

type Message = {
  id: string;
  sender: "bot" | "user";
  text?: string;
  type?: "text" | "checklist";
  checklistItems?: { id: string; text: string; checked: boolean }[];
};

export function AiAssistant() {
  const { isAssistantOpen, setIsAssistantOpen, showNotifDot, setShowNotifDot } = useAppState();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", type: "text", text: "Hi! I'm here to keep you safe. How long is your trip today?" }
  ]);
  const [tripSelected, setTripSelected] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all pending timers (used on reset and unmount)
  const clearPendingTimers = () => {
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];
  };

  useEffect(() => {
    return () => clearPendingTimers();
  }, []);

  const toggleAssistant = () => {
    if (!isAssistantOpen) {
      setShowNotifDot(false);
    }
    setIsAssistantOpen(!isAssistantOpen);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTripSelect = (type: "short" | "long") => {
    setTripSelected(true);
    
    // User message
    const userMsg: Message = { 
      id: Date.now().toString(), 
      sender: "user", 
      type: "text", 
      text: type === "short" ? "Short (< 30m)" : "Long (> 1hr)" 
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    // Bot replies — track all timers so they can be cleared on reset/unmount
    const t1 = setTimeout(() => {
      const botReply1: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        type: "text",
        text: `I've prepared a safety checklist for your ${type} trip.`
      };
      setMessages(prev => [...prev, botReply1]);
      
      const t2 = setTimeout(() => {
        const checklistItems = type === "short" 
          ? ["Check Wallet/Pass", "Wear Comfortable Shoes", "Check Return Timings"]
          : ["Share Live Location", "Pack Power Bank", "Download Offline Map", "Carry Water Bottle", "Identify Safe Zones"];
          
        const checklistMsg: Message = {
          id: (Date.now() + 2).toString(),
          sender: "bot",
          type: "checklist",
          checklistItems: checklistItems.map((item, i) => ({ id: `chk-${i}`, text: item, checked: false }))
        };
        setMessages(prev => [...prev, checklistMsg]);
        
        const t3 = setTimeout(() => {
          const tip = type === "short" 
            ? "Safety Tip: Keep your bag zipped in front of you in crowds."
            : "Safety Tip: Set an alarm to check in with friends every hour.";
            
          const tipMsg: Message = {
            id: (Date.now() + 3).toString(),
            sender: "bot",
            type: "text",
            text: tip
          };
          setMessages(prev => [...prev, tipMsg]);
        }, 800);
        pendingTimers.current.push(t3);
      }, 600);
      pendingTimers.current.push(t2);
    }, 600);
    pendingTimers.current.push(t1);
  };

  const toggleChecklist = (msgId: string, itemId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== msgId || msg.type !== "checklist" || !msg.checklistItems) return msg;
      
      return {
        ...msg,
        checklistItems: msg.checklistItems.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      };
    }));
  };

  const resetChat = () => {
    clearPendingTimers();
    setMessages([{ id: Date.now().toString(), sender: "bot", type: "text", text: "Hi! I'm here to keep you safe. How long is your trip today?" }]);
    setTripSelected(false);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all z-40"
        data-testid="button-fab-assistant"
      >
        <Bot className="w-6 h-6" />
        {showNotifDot && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-slate-100 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Assistant Panel */}
      {isAssistantOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[340px] h-[480px] bg-slate-50 rounded-2xl shadow-2xl flex flex-col z-40 border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300"
          style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
        >
          {/* Header */}
          <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Bot className="w-5 h-5" />
              <span>Trip Assistant</span>
            </div>
            <button onClick={toggleAssistant} className="text-emerald-100 hover:text-white" data-testid="button-close-assistant">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-4 h-4 text-emerald-700" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.type === 'text' && <p className="text-sm">{msg.text}</p>}
                  
                  {msg.type === 'checklist' && msg.checklistItems && (
                    <div className="space-y-2">
                      {msg.checklistItems.map(item => (
                        <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                          <div className="mt-0.5 relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={item.checked}
                              onChange={() => toggleChecklist(msg.id, item.id)}
                              className="peer sr-only"
                            />
                            <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors"></div>
                            {item.checked && <CheckCircle className="w-3 h-3 text-white absolute" />}
                          </div>
                          <span className={`text-sm select-none transition-all ${item.checked ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-slate-900'}`}>
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

          {/* Bottom Actions */}
          <div className="p-4 bg-white border-t border-slate-200">
            {!tripSelected ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleActionSelect("short")}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2 px-3 rounded-lg border border-emerald-200 text-sm transition-colors"
                  data-testid="button-trip-short"
                >
                  Short (&lt; 30m)
                </button>
                <button 
                  onClick={() => handleActionSelect("long")}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2 px-3 rounded-lg border border-emerald-200 text-sm transition-colors"
                  data-testid="button-trip-long"
                >
                  Long (&gt; 1hr)
                </button>
              </div>
            ) : (
              <button 
                onClick={resetChat}
                className="w-full text-slate-500 hover:text-slate-700 font-medium py-2 text-sm transition-colors"
                data-testid="button-reset-assistant"
              >
                Reset Chat
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );

  function handleActionSelect(type: "short" | "long") {
    handleTripSelect(type);
  }
}
