import { WebsiteSection } from './types';

export class ContentExtractor {
  static extractVisibleContent(): WebsiteSection[] {
    const sections: WebsiteSection[] = [];
    
    // Extract main sections
    const sectionElements = document.querySelectorAll('section[id], div[id]');
    
    sectionElements.forEach((el, index) => {
      const id = el.id;
      if (!id || id === 'home') return;
      
      const textContent = this.getTextContent(el);
      if (textContent.length < 50) return;
      
      const rect = el.getBoundingClientRect();
      if (rect.height < 100) return;
      
      const title = this.extractSectionTitle(el);
      const selectors = this.generateSelectors(el);
      
      sections.push({
        id,
        title,
        content: textContent.substring(0, 1000),
        elementType: el.tagName.toLowerCase(),
        position: {
          top: rect.top + window.scrollY,
          height: rect.height
        },
        selectors
      });
    });
    
    // Extract specific components
    this.extractExperiences(sections);
    this.extractSkills(sections);
    this.extractTestimonials(sections);
    
    return sections.sort((a, b) => a.position.top - b.position.top);
  }
  
  private static getTextContent(element: Element): string {
    // Remove script and style elements
    const clone = element.cloneNode(true) as Element;
    clone.querySelectorAll('script, style').forEach(el => el.remove());
    return clone.textContent?.trim() || '';
  }
  
  private static extractSectionTitle(element: Element): string {
    // Look for headings
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      return headings[0].textContent?.trim() || element.id;
    }
    
    // Check for data attributes
    const dataTitle = element.getAttribute('data-title');
    if (dataTitle) return dataTitle;
    
    return element.id.charAt(0).toUpperCase() + element.id.slice(1);
  }
  
  private static generateSelectors(element: Element): string[] {
    const selectors: string[] = [];
    const id = element.id;
    
    if (id) {
      selectors.push(`#${id}`);
    }
    
    // Add class-based selectors
    const classes = element.className.split(' ').filter(c => c && !c.includes(':'));
    classes.forEach(className => {
      selectors.push(`.${className}`);
    });
    
    // Add data attribute selectors
    selectors.push(`[data-section="${id}"]`);
    
    return selectors;
  }
  
  private static extractExperiences(sections: WebsiteSection[]) {
    const experienceElements = document.querySelectorAll('[data-section="experience"]');
    experienceElements.forEach((el, index) => {
      const content = this.getTextContent(el);
      if (content.length > 100) {
        sections.push({
          id: `experience-${index}`,
          title: `Experience ${index + 1}`,
          content,
          elementType: 'div',
          position: el.getBoundingClientRect(),
          selectors: [`[data-section="experience"][data-index="${index}"]`]
        });
      }
    });
  }
  
  private static extractSkills(sections: WebsiteSection[]) {
    const skillElements = document.querySelectorAll('[data-skill]');
    skillElements.forEach((el) => {
      const skillName = el.getAttribute('data-skill');
      const skillLevel = el.getAttribute('data-level');
      if (skillName && skillLevel) {
        sections.push({
          id: `skill-${skillName}`,
          title: `Skill: ${skillName}`,
          content: `${skillName} - ${skillLevel}% proficiency`,
          elementType: 'div',
          position: el.getBoundingClientRect(),
          selectors: [`[data-skill="${skillName}"]`]
        });
      }
    });
  }
  
  private static extractTestimonials(sections: WebsiteSection[]) {
    const testimonialElements = document.querySelectorAll('[data-section="testimonials"]');
    testimonialElements.forEach((el, index) => {
      const content = this.getTextContent(el);
      if (content.length > 50) {
        sections.push({
          id: `testimonial-${index}`,
          title: `Testimonial ${index + 1}`,
          content,
          elementType: 'div',
          position: el.getBoundingClientRect(),
          selectors: [`[data-section="testimonials"][data-index="${index}"]`]
        });
      }
    });
  }
  
  static findElementByContent(searchText: string): { element: Element; selector: string } | null {
    const elements = document.querySelectorAll('*');
    
    for (const el of Array.from(elements)) {
      const text = el.textContent?.toLowerCase();
      if (text && text.includes(searchText.toLowerCase())) {
        const selector = this.generateSelector(el);
        return { element: el, selector };
      }
    }
    
    return null;
  }
  
  private static generateSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    
    // Try to create a unique selector
    const path: string[] = [];
    let current: Element | null = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      }
      
      if (current.className) {
        const classes = current.className.split(' ').filter(c => c).join('.');
        if (classes) {
          selector += `.${classes}`;
        }
      }
      
      // Add nth-child if needed
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
      
      path.unshift(selector);
      current = parent;
    }
    
    return path.join(' > ');
  }
  
  static getPageSummary(): string {
    const sections = this.extractVisibleContent();
    return sections.map(s => 
      `[${s.title}]: ${s.content.substring(0, 200)}...`
    ).join('\n\n');
  }
}