import { GoogleGenerativeAI } from '@google/generative-ai';
import { ToolCall, ChatMessage } from './types';
import { BrowserTools } from './tools';

export class GeminiChatbot {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chatHistory: ChatMessage[] = [];
  private isInitialized = false;

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

When users ask about specific sections, use the available tools to navigate and highlight.
Be conversational and helpful.

Available sections:
about, experience, skills, testimonials, contact

Use tools when appropriate, but never mention the tool system.`
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

    this.chatHistory.push({
      role: 'user',
      content: userQuery,
      timestamp: new Date()
    });

    const currentPageContext =
      pageContext || BrowserTools.getPageSummary().data || '';

    const availableTools = BrowserTools.getAvailableTools();
    const toolsDescription = availableTools
      .map(
        tool =>
          `${tool.name}: ${tool.description} (params: ${JSON.stringify(
            tool.parameters
          )})`
      )
      .join('\n');

    const prompt = `
Current Page Context:
${currentPageContext}

User Query: "${userQuery}"

Available Tools:
${toolsDescription}

Chat History (last 5 messages):
${this.getRecentHistory(5)}

Instructions:
1. Generate a tool call if navigation or interaction is required
2. Answer directly if information is already available
3. Be conversational and concise
4. Tool response format: {"name": "...", "parameters": {...}}

Response:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();

      const toolCall = this.extractToolCall(responseText);

      let cleanResponse = responseText;

      // ✅ FIXED: ES2018-safe regex (NO /s FLAG)
      if (toolCall) {
        cleanResponse = responseText
          .replace(/\{[\s\S]*?\}/, '')
          .trim();
      }

      if (!cleanResponse && toolCall) {
        cleanResponse = this.getDefaultResponseForTool(toolCall);
      }

      this.chatHistory.push({
        role: 'assistant',
        content: cleanResponse,
        timestamp: new Date(),
        toolCalls: toolCall ? [toolCall] : undefined
      });

      if (this.chatHistory.length > 20) {
        this.chatHistory = this.chatHistory.slice(-20);
      }

      return {
        response: cleanResponse,
        toolCall,
        actions: toolCall ? [toolCall.name] : undefined
      };
    } catch (error) {
      console.error('Gemini processing error:', error);
      return {
        response:
          'I ran into an issue while processing your request. Please try again.',
        toolCall: undefined
      };
    }
  }

  private extractToolCall(response: string): ToolCall | undefined {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return undefined;

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed?.name || !parsed?.parameters) return undefined;

      const availableTools = BrowserTools.getAvailableTools();
      const toolExists = availableTools.some(
        tool => tool.name === parsed.name
      );

      return toolExists ? (parsed as ToolCall) : undefined;
    } catch {
      return undefined;
    }
  }

  private getDefaultResponseForTool(toolCall: ToolCall): string {
    switch (toolCall.name) {
      case 'scroll_to_section':
        return `Scrolling to the ${toolCall.parameters.sectionId} section.`;
      case 'highlight_element':
        return `Highlighting the requested element.`;
      case 'click_element':
        return `Clicking the specified element.`;
      case 'extract_content':
        return `Extracting content from the page.`;
      case 'fill_form':
        return `Filling the ${toolCall.parameters.field} field.`;
      case 'navigate_to':
        return `Navigating to the requested page.`;
      default:
        return `Done.`;
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
