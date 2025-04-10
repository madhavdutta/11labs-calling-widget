import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Widget.css'
import KnowledgeBase from './KnowledgeBase'
import { textToSpeech } from '../services/elevenlabsService'
import { queryKnowledgeBase } from '../services/knowledgeService'

const Widget = ({ 
  config = {
    theme: 'light',
    position: 'bottom-right',
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
    showBranding: true
  }
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false)
  const [knowledgeFiles, setKnowledgeFiles] = useState([])
  const [knowledgeUrls, setKnowledgeUrls] = useState([])
  const [widgetStyles, setWidgetStyles] = useState({})
  
  const audioRef = useRef(null)
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)
  
  // Apply custom styles based on config
  useEffect(() => {
    const styles = {
      '--primary-color': config.primaryColor,
      '--secondary-color': config.secondaryColor,
      '--font-family': config.fontFamily,
      '--widget-position': config.position,
      '--theme-background': config.theme === 'dark' ? '#2d2d2d' : 'white',
      '--theme-text': config.theme === 'dark' ? 'white' : '#333',
      '--theme-input-bg': config.theme === 'dark' ? '#3d3d3d' : '#f5f5f5',
    }
    setWidgetStyles(styles)
  }, [config])
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        
        setTranscript(transcript)
      }
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start()
        }
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isListening])
  
  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  
  const toggleWidget = () => {
    setIsOpen(!isOpen)
  }
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      
      if (transcript) {
        handleSendMessage(transcript)
      }
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      setTranscript('')
    }
  }
  
  const handleSendMessage = async (text) => {
    if (!text.trim()) return
    
    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setTranscript('')
    setIsLoading(true)
    
    try {
      // Query the knowledge base with the user's message
      const knowledgeResponse = await queryKnowledgeBase(text)
      
      let responseText = ''
      
      // If we have knowledge base results, use them
      if (knowledgeResponse.results && knowledgeResponse.results.length > 0) {
        const result = knowledgeResponse.results[0]
        responseText = `${result.content}\n\nSource: ${result.source}`
      } else {
        // If no knowledge base results, provide a fallback response
        responseText = "I don't have specific information about that in my knowledge base. Please try a different question or upload relevant documents."
      }
      
      const assistantMessage = { role: 'assistant', content: responseText }
      setMessages(prev => [...prev, assistantMessage])
      
      // Convert response to speech using Eleven Labs
      try {
        const audioBlob = await textToSpeech(responseText.split('\n\nSource:')[0]) // Don't speak the source citation
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play()
        }
      } catch (error) {
        console.error("Error with text-to-speech:", error)
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error("Error processing message:", error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request. Please try again later.' 
      }])
      setIsLoading(false)
    }
  }
  
  const handleTextSubmit = (e) => {
    e.preventDefault()
    if (transcript) {
      handleSendMessage(transcript)
    }
  }
  
  const toggleKnowledgeBase = () => {
    setShowKnowledgeBase(!showKnowledgeBase)
  }
  
  const handleFileUpload = (files) => {
    setKnowledgeFiles(prev => [...prev, ...files])
    setShowKnowledgeBase(false)
  }
  
  const handleUrlsAdd = (urls) => {
    setKnowledgeUrls(prev => [...prev, ...urls])
    setShowKnowledgeBase(false)
  }
  
  // Position class based on config
  const getPositionClass = () => {
    switch(config.position) {
      case 'bottom-left': return 'position-bottom-left'
      case 'top-right': return 'position-top-right'
      case 'top-left': return 'position-top-left'
      case 'bottom-right':
      default: return 'position-bottom-right'
    }
  }
  
  return (
    <>
      <div 
        className={`widget-container ${isOpen ? 'open' : ''} ${getPositionClass()} theme-${config.theme}`}
        style={widgetStyles}
      >
        <button 
          className="widget-toggle" 
          onClick={toggleWidget}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? config.widgetCloseIcon : (config.logoUrl ? <img src={config.logoUrl} alt="Chat" /> : config.widgetIcon)}
        </button>
        
        {isOpen && (
          <div className="widget-content">
            <div className="widget-header">
              {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="widget-logo" />}
              <h3>{config.widgetTitle}</h3>
              <button 
                className="knowledge-button" 
                onClick={toggleKnowledgeBase}
                aria-label="Open knowledge base"
              >
                {config.knowledgeButtonIcon} {config.knowledgeButtonText}
              </button>
            </div>
            
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="welcome-message">
                  <p>{config.welcomeMessage}</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.role}`}>
                    <div className="message-content">
                      {msg.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < msg.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="message assistant">
                  <div className="message-content loading">
                    {config.loadingIndicator.split('').map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="input-container">
              <form onSubmit={handleTextSubmit}>
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={config.placeholderText}
                  disabled={isListening}
                  aria-label="Message input"
                />
                <button 
                  type="submit" 
                  disabled={!transcript || isListening}
                  aria-label="Send message"
                >
                  {config.sendButtonText}
                </button>
              </form>
              
              <button 
                className={`mic-button ${isListening ? 'listening' : ''}`} 
                onClick={toggleListening}
                aria-label={isListening ? 'Stop speaking' : 'Start speaking'}
              >
                {isListening ? config.micButtonTextStop : config.micButtonTextStart}
              </button>
            </div>
            
            {(knowledgeFiles.length > 0 || knowledgeUrls.length > 0) && (
              <div className="knowledge-files">
                <h4>Connected Knowledge:</h4>
                {knowledgeFiles.length > 0 && (
                  <>
                    <h5>Files:</h5>
                    <ul>
                      {knowledgeFiles.map((file, index) => (
                        <li key={`file-${index}`}>{file.name}</li>
                      ))}
                    </ul>
                  </>
                )}
                {knowledgeUrls.length > 0 && (
                  <>
                    <h5>URLs:</h5>
                    <ul>
                      {knowledgeUrls.map((url, index) => (
                        <li key={`url-${index}`}>{url}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
            
            {config.showBranding && (
              <div className="widget-branding">
                Powered by Eleven Labs
              </div>
            )}
          </div>
        )}
      </div>
      
      {showKnowledgeBase && (
        <KnowledgeBase 
          onUpload={handleFileUpload} 
          onUrlsAdd={handleUrlsAdd}
          onClose={() => setShowKnowledgeBase(false)} 
          theme={config.theme}
          primaryColor={config.primaryColor}
        />
      )}
      
      <audio ref={audioRef} style={{ display: 'none' }} />
    </>
  )
}

export default Widget
