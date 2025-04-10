# AI Assistant with Eleven Labs Integration

This project implements a customizable AI assistant widget that can be embedded on any website. It features voice interactions powered by Eleven Labs text-to-speech technology and a robust knowledge base system.

## Features

### Core Functionality
- 💬 Interactive chat interface
- 🎤 Voice input using browser's Speech Recognition API
- 🔊 Voice output using Eleven Labs text-to-speech API
- 📚 Knowledge base integration with document and URL support
- 🌐 Embeddable on any website

### Advanced Features
- 🎨 Comprehensive personalization options
  - Custom branding (colors, logos, fonts)
  - Configurable chat behaviors
  - Adjustable UI components
- 📊 Dashboard interface
  - Document upload capabilities
  - Knowledge base management
  - Analytics and usage statistics
- 🧩 Multiple embed options
  - HTML snippet
  - React component
  - WordPress plugin

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Eleven Labs API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Eleven Labs API key:
   ```
   VITE_ELEVENLABS_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

### Embedding on a Website

To embed the widget on any website, add the following code snippet to your HTML:

```html
<!-- AI Assistant Widget -->
<script>
  window.AIAssistantConfig = {
    apiKey: "your_eleven_labs_api_key",
    position: "bottom-right",
    theme: "light",
    primaryColor: "#5c6bc0",
    widgetTitle: "AI Assistant",
    welcomeMessage: "Hello! How can I help you today?",
    showBranding: true
  };
</script>
<script src="https://your-widget-host.com/widget-loader.js"></script>
<!-- End AI Assistant Widget -->
```

### Knowledge Base Integration

The widget supports connecting to various knowledge sources:

1. **Document Upload**: PDF, DOCX, and TXT files
2. **URL Integration**: Web pages, blogs, and documentation sites

In a production environment, you would implement:
- Document processing and text extraction
- Embedding generation using an embedding model
- Vector database storage for efficient retrieval
- Semantic search functionality for accurate responses

### Customization Options

The widget can be customized with the following options:

- **Appearance**
  - Theme (light/dark)
  - Position on the page
  - Primary and secondary colors
  - Custom logo
  - Font family

- **Behavior**
  - Welcome message
  - Widget title
  - Auto-open settings
  - Branding visibility

- **Voice Settings**
  - Voice selection
  - Speech rate
  - Auto-speak responses

## Implementation Details

### Knowledge Base System

The knowledge base system is designed to:
- Use only real data from authorized sources
- Never generate simulated or fabricated responses
- Maintain accuracy and relevance to user queries

This is achieved through:
1. Document processing and chunking
2. Embedding generation for semantic understanding
3. Vector similarity search for relevant context retrieval
4. Source citation in responses

### Voice Interaction

Voice interactions are powered by:
- Browser's Web Speech API for speech recognition
- Eleven Labs API for realistic text-to-speech

### Dashboard Interface

The dashboard provides:
- Document upload and management
- Knowledge base organization
- Performance analytics
- Widget configuration

## Security Considerations

- The Eleven Labs API key should be kept secure
- In a production environment, API calls should be proxied through a backend service
- User data and conversations should be handled according to privacy regulations

## License

[MIT License](LICENSE)
