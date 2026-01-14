import { ContentExtractor } from './content-extractor';
import { ToolCall, ActionResponse } from './types';

export class BrowserTools {
  static executeToolCall(toolCall: ToolCall): ActionResponse {
    try {
      switch (toolCall.name) {
        case 'scroll_to_section':
          return this.scrollToSection(toolCall.parameters.sectionId);
        case 'highlight_element':
          return this.highlightElement(toolCall.parameters.selector);
        case 'click_element':
          return this.clickElement(toolCall.parameters.selector);
        case 'extract_content':
          return this.extractContent();
        case 'fill_form':
          return this.fillForm(
            toolCall.parameters.field,
            toolCall.parameters.value
          );
        case 'get_page_summary':
          return this.getPageSummary();
        case 'navigate_to':
          return this.navigateTo(toolCall.parameters.url);
        default:
          return {
            success: false,
            message: `Unknown tool: ${toolCall.name}`
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error executing tool: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static scrollToSection(sectionId: string): ActionResponse {
    const element = document.getElementById(sectionId);
    if (!element) {
      // Try to find by content
      const found = ContentExtractor.findElementByContent(sectionId);
      if (!found) {
        return {
          success: false,
          message: `Section "${sectionId}" not found`
        };
      }
      found.element.scrollIntoView({ behavior: 'smooth' });
      return {
        success: true,
        message: `Scrolled to element containing "${sectionId}"`
      };
    }

    element.scrollIntoView({ behavior: 'smooth' });
    return {
      success: true,
      message: `Scrolled to ${sectionId} section`
    };
  }

  static highlightElement(selector: string, duration: number = 3000): ActionResponse {
    let element: Element | null;
    
    try {
      element = document.querySelector(selector);
    } catch (error) {
      return {
        success: false,
        message: `Invalid selector: ${selector}`
      };
    }

    if (!element) {
      return {
        success: false,
        message: `Element not found with selector: ${selector}`
      };
    }

    const originalStyle = {
      border: element.style.border,
      boxShadow: element.style.boxShadow,
      transition: element.style.transition
    };

    element.style.border = '3px solid #3b82f6';
    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
    element.style.transition = 'all 0.3s ease';
    element.classList.add('animate-pulse-glow');

    setTimeout(() => {
      element!.style.border = originalStyle.border;
      element!.style.boxShadow = originalStyle.boxShadow;
      element!.style.transition = originalStyle.transition;
      element!.classList.remove('animate-pulse-glow');
    }, duration);

    return {
      success: true,
      message: `Highlighted element: ${selector}`,
      data: { selector, duration }
    };
  }

  static clickElement(selector: string): ActionResponse {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      return {
        success: false,
        message: `Element not found: ${selector}`
      };
    }

    element.click();
    return {
      success: true,
      message: `Clicked element: ${selector}`
    };
  }

  static extractContent(): ActionResponse {
    const content = ContentExtractor.extractVisibleContent();
    return {
      success: true,
      message: 'Extracted page content',
      data: content
    };
  }

  static fillForm(field: string, value: string): ActionResponse {
    let element: HTMLInputElement | HTMLTextAreaElement | null;
    
    // Try different selectors
    const selectors = [
      `[name="${field}"]`,
      `#${field}`,
      `[id*="${field}"]`,
      `[name*="${field}"]`,
      `input[placeholder*="${field}"]`,
      `textarea[placeholder*="${field}"]`
    ];

    for (const selector of selectors) {
      element = document.querySelector(selector);
      if (element) break;
    }

    if (!element) {
      return {
        success: false,
        message: `Form field "${field}" not found`
      };
    }

    element.value = value;
    
    // Trigger input event
    const event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);

    return {
      success: true,
      message: `Filled ${field} with "${value}"`,
      data: { field, value }
    };
  }

  static getPageSummary(): ActionResponse {
    const summary = ContentExtractor.getPageSummary();
    return {
      success: true,
      message: 'Page summary generated',
      data: summary
    };
  }

  static navigateTo(url: string): ActionResponse {
    if (url.startsWith('/') || url.startsWith('#')) {
      window.location.href = url;
      return {
        success: true,
        message: `Navigating to ${url}`
      };
    }
    
    return {
      success: false,
      message: 'Only relative URLs are allowed for navigation'
    };
  }

  static getAvailableTools(): Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }> {
    return [
      {
        name: 'scroll_to_section',
        description: 'Scroll to a specific section of the page',
        parameters: {
          sectionId: 'string - The ID of the section to scroll to'
        }
      },
      {
        name: 'highlight_element',
        description: 'Highlight an element on the page',
        parameters: {
          selector: 'string - CSS selector for the element',
          duration: 'number - Highlight duration in milliseconds (optional)'
        }
      },
      {
        name: 'click_element',
        description: 'Click on an element',
        parameters: {
          selector: 'string - CSS selector for the element'
        }
      },
      {
        name: 'extract_content',
        description: 'Extract visible content from the page',
        parameters: {}
      },
      {
        name: 'fill_form',
        description: 'Fill a form field with a value',
        parameters: {
          field: 'string - Name or ID of the form field',
          value: 'string - Value to fill'
        }
      },
      {
        name: 'get_page_summary',
        description: 'Get a summary of the page content',
        parameters: {}
      },
      {
        name: 'navigate_to',
        description: 'Navigate to a different page or section',
        parameters: {
          url: 'string - URL or section ID to navigate to'
        }
      }
    ];
  }
}