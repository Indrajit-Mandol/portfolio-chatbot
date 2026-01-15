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
      systemInstruction: `
You are a co-browsing assistant for Swoyam Siddharth's portfolio website.

Responsibilities:
- Answer questions about experience, skills, projects, and education
- Navigate, scroll, highlight, and interact with the page
- Extract and summarize content

Available sections:
about, experience, skills, testimonials, contact

Use tools when required. Never mention internal tool systems.
`
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

User Query:
"${userQuery}"

Available Tools:
${toolsDescription}

Chat History:
${this.getRecentHistory(5)}

Instructions:
- Generate a tool call only when interaction is needed
- Otherwise respond normally
- Tool JSON format: {"name":"tool","parameters":{}}

Response:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();

      const toolCall = this.extractToolCall(responseText);

      let cleanResponse = responseText;

      // ✅ SAFE REGEX — NO dotAll flag
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
      console.error('Gemini error:', error);
      return {
        response: 'An error occurred. Please try again.',
        toolCall: undefined
      };
    }
  }

  private extractToolCall(response: string): ToolCall | undefined {
    try {
      const match = response.match(/\{[\s\S]*\}/);
      if (!match) return undefined;

      const parsed = JSON.parse(match[0]);
      if (!parsed?.name || !parsed?.parameters) return undefined;

      const availableTools = BrowserTools.getAvailableTools();
      const isValid = availableTools.some(t => t.name === parsed.name);

      return isValid ? (parsed as ToolCall) : undefined;
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
