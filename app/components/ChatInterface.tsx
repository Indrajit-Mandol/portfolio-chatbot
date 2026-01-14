'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, Bot, User, Navigation, X, Maximize2, Minimize2, 
  Sparkles, MousePointerClick, Eye, ScrollText 
} from 'lucide-react';
import { GeminiChatbot } from '@/lib/gemini-client';
import { BrowserTools } from '@/lib/tools';
import { ToolCall } from '@/lib/types';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  actions?: string[];
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your co-browsing assistant for Swoyam\'s portfolio. I can help you navigate the site, answer questions about his experience and skills, highlight sections, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatbot, setChatbot] = useState<GeminiChatbot | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chatbot
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not found');
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: 'API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.',
        timestamp: new Date()
      }]);
      return;
    }

    try {
      const bot = new GeminiChatbot(apiKey);
      setChatbot(bot);
      setIsInitialized(true);
      
      // Extract initial page content
      setTimeout(() => {
        const summary = BrowserTools.getPageSummary();
        if (summary.success) {
          console.log('Page content extracted successfully');
        }
      }, 1000);
    } catch (error) {
      console.error('Failed to initialize chatbot:', error);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chatbot || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);

    try {
      // Get current page context
      const pageContext = BrowserTools.getPageSummary().data;
      
      // Process query
      const result = await chatbot.processQuery(userMessage, pageContext);
      
      // Add assistant response
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        toolCalls: result.toolCall ? [result.toolCall] : undefined,
        actions: result.actions
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      
      // Execute tool call if present
      if (result.toolCall) {
        executeToolCall(result.toolCall);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, chatbot, isLoading]);

  const executeToolCall = (toolCall: ToolCall) => {
    const result = BrowserTools.executeToolCall(toolCall);
    
    if (result.success) {
      console.log('Tool executed:', toolCall.name, result.message);
      
      // Show success feedback
      if (toolCall.name === 'highlight_element') {
        // Visual feedback already handled by BrowserTools
      }
    } else {
      console.error('Tool failed:', result.message);
      
      // Add error message
      const errorMsg: Message = {
        id: (Date.now() + 3).toString(),
        role: 'assistant',
        content: `I couldn't complete that action: ${result.message}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const quickActions = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: 'Show Skills',
      action: 'What are Swoyam\'s technical skills?'
    },
    {
      icon: <ScrollText className="w-4 h-4" />,
      label: 'View Experience',
      action: 'Show me the experience section'
    },
    {
      icon: <MousePointerClick className="w-4 h-4" />,
      label: 'Highlight Testimonials',
      action: 'Highlight the testimonials section'
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: 'About Me',
      action: 'Tell me about Swoyam\'s background'
    }
  ];

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {line}
      </p>
    ));
  };

  return (
    <>
      {/* Minimized Chat Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300 z-50 animate-pulse-glow"
          aria-label="Open chat assistant"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Interface */}
      {isExpanded && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[480px] md:h-[680px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Co-Browsing Assistant</h3>
                  <p className="text-sm text-blue-100 opacity-90">Ask me to navigate, highlight, or explain</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-200'
                  }`}>
                    <div className="mb-1">
                      {formatMessage(msg.content)}
                    </div>
                    
                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <div className="flex items-center gap-1 text-xs opacity-90">
                          <Sparkles className="w-3 h-3" />
                          <span>Action performed: {msg.toolCalls[0].name.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Actions */}
          <div className="px-4 pt-3 pb-1 border-t bg-white">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={isInitialized ? "Ask about projects, experience, or request actions..." : "Initializing assistant..."}
                disabled={!isInitialized || isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !isInitialized || isLoading}
                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Try: "Scroll to skills" • "Highlight experience" • "What projects are showcased?"
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}