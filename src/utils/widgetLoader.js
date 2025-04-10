/**
 * This script can be used to load the AI Assistant widget on any website
 * It dynamically injects the widget into the DOM
 */

(function() {
  // Configuration - can be overridden by window.AIAssistantConfig
  const defaultConfig = {
    apiKey: '', // Eleven Labs API key
    position: 'bottom-right', // Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    theme: 'light', // Options: 'light', 'dark'
    primaryColor: '#5c6bc0',
    secondaryColor: '#3f51b5',
    fontFamily: 'Inter, system-ui, sans-serif',
    logoUrl: null,
    welcomeMessage: 'Hello! How can I help you today?',
    widgetTitle: 'AI Assistant',
    widgetIcon: '💬',
    widgetCloseIcon: '✕',
    knowledgeButtonIcon: '📚',
    knowledgeButtonText: 'Knowledge',
    placeholderText: 'Type your message...',
    sendButtonText: 'Send',
    micButtonTextStart: '🎤 Speak',
    micButtonTextStop: '🔴 Stop',
    loadingIndicator: '...',
    showBranding: true,
    autoOpen: false
  };
  
  // Merge default config with user config
  const config = {
    ...defaultConfig,
    ...(window.AIAssistantConfig || {})
  };
  
  // Create widget container
  const createWidgetContainer = () => {
    const container = document.createElement('div');
    container.id = 'ai-assistant-widget-container';
    document.body.appendChild(container);
    return container;
  };
  
  // Load widget styles
  const loadStyles = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://your-widget-host.com/widget.css'; // Replace with actual URL
    document.head.appendChild(link);
    
    // Add custom font if needed
    if (config.fontFamily.includes('Inter')) {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
      document.head.appendChild(fontLink);
    }
  };
  
  // Load widget script
  const loadScript = () => {
    const script = document.createElement('script');
    script.src = 'https://your-widget-host.com/widget.js'; // Replace with actual URL
    script.onload = () => {
      // Initialize widget with config
      window.AIAssistant.init(config);
    };
    document.body.appendChild(script);
  };
  
  // Generate embeddable code snippet
  const generateEmbedCode = () => {
    return `
<!-- AI Assistant Widget -->
<script>
  window.AIAssistantConfig = {
    apiKey: "${config.apiKey}",
    position: "${config.position}",
    theme: "${config.theme}",
    primaryColor: "${config.primaryColor}",
    widgetTitle: "${config.widgetTitle}",
    welcomeMessage: "${config.welcomeMessage}",
    showBranding: ${config.showBranding}
  };
</script>
<script src="https://your-widget-host.com/widget-loader.js"></script>
<!-- End AI Assistant Widget -->
    `.trim();
  };
  
  // Initialize
  const init = () => {
    createWidgetContainer();
    loadStyles();
    loadScript();
    
    // Auto-open widget if configured
    if (config.autoOpen) {
      setTimeout(() => {
        window.AIAssistant.open();
      }, 1000);
    }
    
    // Expose embed code generator
    window.AIAssistant = window.AIAssistant || {};
    window.AIAssistant.getEmbedCode = generateEmbedCode;
  };
  
  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
