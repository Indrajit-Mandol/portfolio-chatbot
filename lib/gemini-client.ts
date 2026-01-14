import { GoogleGenerativeAI } from '@google/generative-ai';
import { ToolCall, ChatMessage } from './types';
import { BrowserTools } from './tools';

export class GeminiChatbot {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chatHistory: ChatMessage[] = [];
  private isInitialized: boolean = false;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      systemInstruction: `You are a co-browsing assistant for Swoyam Siddharth's portfolio website.
      
      Your primary role is to help users explore the portfolio by:
      1. Answering questions about Swoyam's experience, skills, projects, and education
      2. Performing actions on the website like scrolling, highlighting, and clicking
      3. Extracting and summarizing content from different sections
      
      Key facts about Swoyam:
      - AI Engineer at Sarvam AI (working on India's sovereign LLM)
      - Former AI Intern at Oracle NetSuite, FixIt, and Sarvam AI
      - Computer Science graduate from IIIT Bhubaneswar
      - Skills: Agentic AI (90%), Python (90%), FastAPI (85%), React/Next.js (85%)
      - Experience in building voice agents, NLP solutions, and full-stack applications
      
      When users ask about specific sections, use the available tools to navigate and highlight.
      Be conversational and helpful. If you need more information, ask clarifying questions.
      
      Available sections on the website:
      1. about - Personal introduction and education
      2. experience - Professional work experience
      3. skills - Technical skills and proficiency levels
      4. testimonials - Feedback from colleagues and mentors
      5. contact - Contact form and social links
      
      Use tools when appropriate, but don't mention the tool system to users.`
    });
    this.isInitialized = true;
  }

  async processQuery(
    userQuery: string, 
    pageContext?: string
  ): Promise<{ response: string; toolCall?: ToolCall; actions?: string[] }> {
    if (!this.isInitialized) {
      throw new Error('Chatbot not initialized');
    }

    // Add user message to history
    this.chatHistory.push({
      role: 'user',
      content: userQuery,
      timestamp: new Date()
    });

    // Get page context if not provided
    const currentPageContext = pageContext || BrowserTools.getPageSummary().data || '';

    // Prepare tools information
    const availableTools = BrowserTools.getAvailableTools();
    const toolsDescription = availableTools.map(tool => 
      `${tool.name}: ${tool.description} (params: ${JSON.stringify(tool.parameters)})`
    ).join('\n');

    // Construct the prompt
    const prompt = `
      Current Page Context:
      ${currentPageContext}
      
      User Query: "${userQuery}"
      
      Available Tools:
      ${toolsDescription}
      
      Chat History (last 5 messages):
      ${this.getRecentHistory(5)}
      
      Instructions:
      1. If the user wants to navigate, scroll, highlight, or interact with the page, generate a tool call
      2. If asking about content that exists on the page, either answer directly or use tools to find/show it
      3. Be conversational and helpful
      4. When using tools, respond with a JSON object like: {"name": "tool_name", "parameters": {...}}
      5. Always maintain context of being a portfolio assistant
      
      Examples:
      - User: "Show me the experience section" → {"name": "scroll_to_section", "parameters": {"sectionId": "experience"}}
      - User: "What are Swoyam's skills?" → Answer based on skills section content
      - User: "Highlight the testimonials" → {"name": "highlight_element", "parameters": {"selector": "[data-section=\\"testimonials\\"]"}}
      - User: "Go to contact section and fill the form" → Multiple tool calls
      
      Your response should be either:
      1. A direct answer to the user's question
      2. A tool call JSON object
      3. A combination of answer and tool call
      
      Response:`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Parse tool call if present
      const toolCall = this.extractToolCall(responseText);
      
      // Clean response text (remove JSON if present)
      let cleanResponse = responseText;
      if (toolCall) {
        cleanResponse = responseText.replace(/\{.*\}/s, '').trim();
      }
      
      // If no clean response but we have tool call, provide default response
      if (!cleanResponse && toolCall) {
        cleanResponse = this.getDefaultResponseForTool(toolCall);
      }
      
      // Add assistant response to history
      this.chatHistory.push({
        role: 'assistant',
        content: cleanResponse,
        timestamp: new Date(),
        toolCalls: toolCall ? [toolCall] : undefined
      });
      
      // Limit history size
      if (this.chatHistory.length > 20) {
        this.chatHistory = this.chatHistory.slice(-20);
      }
      
      return {
        response: cleanResponse,
        toolCall,
        actions: toolCall ? [toolCall.name] : undefined
      };
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        response: 'I apologize, but I encountered an error processing your request. Please try again.',
        toolCall: undefined
      };
    }
  }

  private extractToolCall(response: string): ToolCall | undefined {
    try {
      // Look for JSON pattern in response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate tool call structure
        if (parsed.name && parsed.parameters) {
          // Validate against available tools
          const availableTools = BrowserTools.getAvailableTools();
          const toolExists = availableTools.some(tool => tool.name === parsed.name);
          
          if (toolExists) {
            return parsed as ToolCall;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to parse tool call:', error);
    }
    return undefined;
  }

  private getDefaultResponseForTool(toolCall: ToolCall): string {
    switch (toolCall.name) {
      case 'scroll_to_section':
        return `I'll scroll to the ${toolCall.parameters.sectionId} section for you.`;
      case 'highlight_element':
        return `Highlighting the requested element.`;
      case 'click_element':
        return `Clicking on the specified element.`;
      case 'extract_content':
        return `Let me get the content from the page for you.`;
      case 'fill_form':
        return `I'll fill in the ${toolCall.parameters.field} field.`;
      case 'get_page_summary':
        return `Here's a summary of the page content:`;
      case 'navigate_to':
        return `Navigating to ${toolCall.parameters.url}.`;
      default:
        return `I'll help with that.`;
    }
  }

  private getRecentHistory(count: number): string {
    return this.chatHistory
      .slice(-count)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  clearHistory(): void {
    this.chatHistory = [];
  }

  getHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }
}