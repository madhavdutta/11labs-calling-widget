import React, { useState } from 'react'
import './App.css'
import Widget from './components/Widget'
import Dashboard from './components/Dashboard'
import { generateEmbedCode, generateReactComponentCode, generateWordPressPluginCode } from './utils/embedCodeGenerator'

function App() {
  const [activeTab, setActiveTab] = useState('demo')
  const [widgetConfig, setWidgetConfig] = useState({
    theme: 'light',
    position: 'bottom-right',
    primaryColor: '#5c6bc0',
    secondaryColor: '#3f51b5',
    widgetTitle: 'AI Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    showBranding: true
  })
  const [embedCodeType, setEmbedCodeType] = useState('html')
  
  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target
    setWidgetConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const getEmbedCode = () => {
    switch (embedCodeType) {
      case 'react':
        return generateReactComponentCode(widgetConfig)
      case 'wordpress':
        return generateWordPressPluginCode(widgetConfig)
      case 'html':
      default:
        return generateEmbedCode(widgetConfig)
    }
  }
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Assistant with Eleven Labs</h1>
        <nav className="main-nav">
          <button 
            className={`nav-button ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            Demo
          </button>
          <button 
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-button ${activeTab === 'embed' ? 'active' : ''}`}
            onClick={() => setActiveTab('embed')}
          >
            Embed Code
          </button>
        </nav>
      </header>
      
      <main className="app-content">
        {activeTab === 'demo' && (
          <div className="demo-container">
            <div className="demo-content">
              <h2>AI Assistant Demo</h2>
              <p>This page demonstrates how the AI calling widget can be embedded on any website. Click the chat icon in the bottom right corner to interact with the assistant.</p>
              
              <div className="demo-features">
                <div className="feature-card">
                  <div className="feature-icon">🔊</div>
                  <h3>Voice Interactions</h3>
                  <p>Speak to the assistant and hear responses using Eleven Labs' realistic voice technology.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">📚</div>
                  <h3>Knowledge Base</h3>
                  <p>Connect documents and URLs to provide accurate, source-based responses.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">🎨</div>
                  <h3>Customizable</h3>
                  <p>Personalize the appearance and behavior to match your brand and requirements.</p>
                </div>
              </div>
              
              <div className="demo-instructions">
                <h3>Try It Out:</h3>
                <ol>
                  <li>Click the chat icon in the bottom right</li>
                  <li>Ask a question by typing or using voice input</li>
                  <li>Connect knowledge sources using the Knowledge button</li>
                </ol>
              </div>
            </div>
            
            {/* The widget is rendered here */}
            <Widget config={widgetConfig} />
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}
        
        {activeTab === 'embed' && (
          <div className="embed-container">
            <h2>Embed on Your Website</h2>
            <p>Configure your widget and get the code to embed it on your website.</p>
            
            <div className="embed-content">
              <div className="config-panel">
                <h3>Widget Configuration</h3>
                
                <div className="config-form">
                  <div className="form-group">
                    <label htmlFor="theme">Theme</label>
                    <select 
                      id="theme" 
                      name="theme" 
                      value={widgetConfig.theme}
                      onChange={handleConfigChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="position">Position</label>
                    <select 
                      id="position" 
                      name="position" 
                      value={widgetConfig.position}
                      onChange={handleConfigChange}
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="primaryColor">Primary Color</label>
                    <input 
                      type="color" 
                      id="primaryColor" 
                      name="primaryColor" 
                      value={widgetConfig.primaryColor}
                      onChange={handleConfigChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="widgetTitle">Widget Title</label>
                    <input 
                      type="text" 
                      id="widgetTitle" 
                      name="widgetTitle" 
                      value={widgetConfig.widgetTitle}
                      onChange={handleConfigChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="welcomeMessage">Welcome Message</label>
                    <input 
                      type="text" 
                      id="welcomeMessage" 
                      name="welcomeMessage" 
                      value={widgetConfig.welcomeMessage}
                      onChange={handleConfigChange}
                    />
                  </div>
                  
                  <div className="form-group checkbox">
                    <input 
                      type="checkbox" 
                      id="showBranding" 
                      name="showBranding" 
                      checked={widgetConfig.showBranding}
                      onChange={handleConfigChange}
                    />
                    <label htmlFor="showBranding">Show "Powered by" branding</label>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="logoUrl">Custom Logo URL (optional)</label>
                    <input 
                      type="url" 
                      id="logoUrl" 
                      name="logoUrl" 
                      value={widgetConfig.logoUrl || ''}
                      onChange={handleConfigChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
              </div>
              
              <div className="code-panel">
                <div className="code-type-selector">
                  <button 
                    className={embedCodeType === 'html' ? 'active' : ''}
                    onClick={() => setEmbedCodeType('html')}
                  >
                    HTML
                  </button>
                  <button 
                    className={embedCodeType === 'react' ? 'active' : ''}
                    onClick={() => setEmbedCodeType('react')}
                  >
                    React
                  </button>
                  <button 
                    className={embedCodeType === 'wordpress' ? 'active' : ''}
                    onClick={() => setEmbedCodeType('wordpress')}
                  >
                    WordPress
                  </button>
                </div>
                
                <div className="code-display">
                  <pre>
                    <code>{getEmbedCode()}</code>
                  </pre>
                  <button 
                    className="copy-button"
                    onClick={() => {
                      navigator.clipboard.writeText(getEmbedCode());
                      alert('Code copied to clipboard!');
                    }}
                  >
                    Copy Code
                  </button>
                </div>
                
                <div className="embed-instructions">
                  <h4>Installation Instructions:</h4>
                  {embedCodeType === 'html' && (
                    <p>Add this code to the HTML of your website, preferably just before the closing body tag.</p>
                  )}
                  {embedCodeType === 'react' && (
                    <p>Create a new component file with this code and import it in your main App component.</p>
                  )}
                  {embedCodeType === 'wordpress' && (
                    <p>Create a new plugin file with this code and upload it to your WordPress site's plugins directory.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Powered by Eleven Labs API • <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer">elevenlabs.io</a></p>
      </footer>
    </div>
  )
}

export default App
