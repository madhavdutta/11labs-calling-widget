/**
 * Utility to generate embeddable code snippets for the AI Assistant widget
 */

/**
 * Generate embeddable code snippet based on configuration
 * @param {Object} config - Widget configuration
 * @returns {string} HTML code snippet
 */
export const generateEmbedCode = (config = {}) => {
  const {
    apiKey = '',
    position = 'bottom-right',
    theme = 'light',
    primaryColor = '#5c6bc0',
    widgetTitle = 'AI Assistant',
    welcomeMessage = 'Hello! How can I help you today?',
    showBranding = true,
    autoOpen = false,
    logoUrl = null
  } = config;
  
  // Create a sanitized config object with only the essential properties
  const sanitizedConfig = {
    apiKey,
    position,
    theme,
    primaryColor,
    widgetTitle,
    welcomeMessage,
    showBranding,
    autoOpen
  };
  
  // Add logoUrl only if it exists
  if (logoUrl) {
    sanitizedConfig.logoUrl = logoUrl;
  }
  
  // Convert config to JSON string with proper indentation
  const configString = JSON.stringify(sanitizedConfig, null, 2)
    .replace(/\n/g, '\n  ') // Add extra indentation for nested content
    .replace(/"/g, '\\"'); // Escape double quotes
  
  return `<!-- AI Assistant Widget -->
<script>
  window.AIAssistantConfig = {
    apiKey: "${apiKey}",
    position: "${position}",
    theme: "${theme}",
    primaryColor: "${primaryColor}",
    widgetTitle: "${widgetTitle}",
    welcomeMessage: "${welcomeMessage}",
    showBranding: ${showBranding},
    autoOpen: ${autoOpen}${logoUrl ? `,
    logoUrl: "${logoUrl}"` : ''}
  };
</script>
<script src="https://your-widget-host.com/widget-loader.js"></script>
<!-- End AI Assistant Widget -->`;
};

/**
 * Generate React component code for embedding the widget
 * @param {Object} config - Widget configuration
 * @returns {string} React component code
 */
export const generateReactComponentCode = (config = {}) => {
  const {
    apiKey = '',
    position = 'bottom-right',
    theme = 'light',
    primaryColor = '#5c6bc0',
    widgetTitle = 'AI Assistant',
    welcomeMessage = 'Hello! How can I help you today?',
    showBranding = true,
    autoOpen = false,
    logoUrl = null
  } = config;
  
  return `import { useEffect } from 'react';

const AIAssistantWidget = () => {
  useEffect(() => {
    // Define configuration
    window.AIAssistantConfig = {
      apiKey: "${apiKey}",
      position: "${position}",
      theme: "${theme}",
      primaryColor: "${primaryColor}",
      widgetTitle: "${widgetTitle}",
      welcomeMessage: "${welcomeMessage}",
      showBranding: ${showBranding},
      autoOpen: ${autoOpen}${logoUrl ? `,
      logoUrl: "${logoUrl}"` : ''}
    };
    
    // Load widget script
    const script = document.createElement('script');
    script.src = "https://your-widget-host.com/widget-loader.js";
    script.async = true;
    document.body.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
      // Remove widget container if it exists
      const container = document.getElementById('ai-assistant-widget-container');
      if (container) {
        document.body.removeChild(container);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default AIAssistantWidget;`;
};

/**
 * Generate WordPress plugin code for embedding the widget
 * @param {Object} config - Widget configuration
 * @returns {string} WordPress plugin code
 */
export const generateWordPressPluginCode = (config = {}) => {
  const {
    apiKey = '',
    position = 'bottom-right',
    theme = 'light',
    primaryColor = '#5c6bc0',
    widgetTitle = 'AI Assistant',
    welcomeMessage = 'Hello! How can I help you today?',
    showBranding = true,
    autoOpen = false,
    logoUrl = null
  } = config;
  
  return `<?php
/**
 * Plugin Name: AI Assistant Widget
 * Description: Adds an AI Assistant powered by Eleven Labs to your WordPress site
 * Version: 1.0.0
 * Author: Your Name
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Add widget script to footer
function ai_assistant_enqueue_script() {
    ?>
    <script>
        window.AIAssistantConfig = {
            apiKey: "<?php echo esc_attr('${apiKey}'); ?>",
            position: "<?php echo esc_attr('${position}'); ?>",
            theme: "<?php echo esc_attr('${theme}'); ?>",
            primaryColor: "<?php echo esc_attr('${primaryColor}'); ?>",
            widgetTitle: "<?php echo esc_attr('${widgetTitle}'); ?>",
            welcomeMessage: "<?php echo esc_attr('${welcomeMessage}'); ?>",
            showBranding: <?php echo ${showBranding} ? 'true' : 'false'; ?>,
            autoOpen: <?php echo ${autoOpen} ? 'true' : 'false'; ?>${logoUrl ? `,
            logoUrl: "<?php echo esc_url('${logoUrl}'); ?>"` : ''}
        };
    </script>
    <script src="https://your-widget-host.com/widget-loader.js"></script>
    <?php
}
add_action('wp_footer', 'ai_assistant_enqueue_script');

// Add settings page
function ai_assistant_add_settings_page() {
    add_options_page(
        'AI Assistant Settings',
        'AI Assistant',
        'manage_options',
        'ai-assistant',
        'ai_assistant_settings_page'
    );
}
add_action('admin_menu', 'ai_assistant_add_settings_page');

// Settings page content
function ai_assistant_settings_page() {
    ?>
    <div class="wrap">
        <h1>AI Assistant Widget Settings</h1>
        <form method="post" action="options.php">
            <?php
            // Output settings fields
            settings_fields('ai_assistant_options');
            do_settings_sections('ai-assistant');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings
function ai_assistant_register_settings() {
    register_setting('ai_assistant_options', 'ai_assistant_options');
    
    add_settings_section(
        'ai_assistant_main',
        'Widget Configuration',
        'ai_assistant_section_callback',
        'ai-assistant'
    );
    
    add_settings_field(
        'api_key',
        'Eleven Labs API Key',
        'ai_assistant_api_key_callback',
        'ai-assistant',
        'ai_assistant_main'
    );
    
    // Add more settings fields here
}
add_action('admin_init', 'ai_assistant_register_settings');

// Section callback
function ai_assistant_section_callback() {
    echo '<p>Configure your AI Assistant widget settings below:</p>';
}

// API key field callback
function ai_assistant_api_key_callback() {
    $options = get_option('ai_assistant_options');
    $api_key = isset($options['api_key']) ? $options['api_key'] : '';
    ?>
    <input type="text" name="ai_assistant_options[api_key]" value="<?php echo esc_attr($api_key); ?>" class="regular-text">
    <?php
}
`;
};
