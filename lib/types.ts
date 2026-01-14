export interface WebsiteSection {
  id: string;
  title: string;
  content: string;
  elementType: string;
  position: { top: number; height: number };
  selectors: string[];
}

export interface ToolCall {
  name: string;
  parameters: Record<string, any>;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface PortfolioData {
  sections: Record<string, WebsiteSection>;
  skills: Array<{
    category: string;
    name: string;
    level: number;
  }>;
  experiences: Array<{
    role: string;
    company: string;
    period: string;
    description: string;
    achievements: string[];
  }>;
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
    rating: number;
  }>;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  data?: any;
}