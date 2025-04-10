import React, { useState, useRef } from 'react'
import './KnowledgeBase.css'
import { addDocumentsToKnowledgeBase, addUrlsToKnowledgeBase } from '../services/knowledgeService'

const KnowledgeBase = ({ onUpload, onUrlsAdd, onClose, theme = 'light', primaryColor = '#5c6bc0' }) => {
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState([])
  const [newUrl, setNewUrl] = useState('')
  const [activeTab, setActiveTab] = useState('files')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [error, setError] = useState('')
  
  const fileInputRef = useRef(null)
  const dropAreaRef = useRef(null)
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} exceeds the 10MB limit.`)
        return false
      }
      return true
    })
    
    setFiles(prev => [...prev, ...selectedFiles])
    setError('')
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('drag-over')
    }
  }
  
  const handleDragLeave = () => {
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('drag-over')
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    handleDragLeave()
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const fileType = file.type
      // Check if file type is allowed
      if (!fileType.includes('pdf') && !fileType.includes('word') && !fileType.includes('text/plain')) {
        setError(`File ${file.name} is not a supported format (PDF, DOCX, TXT).`)
        return false
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} exceeds the 10MB limit.`)
        return false
      }
      return true
    })
    
    setFiles(prev => [...prev, ...droppedFiles])
    if (droppedFiles.length > 0) {
      setError('')
    }
  }
  
  const handleUrlAdd = () => {
    if (newUrl.trim()) {
      try {
        // Validate URL
        new URL(newUrl.trim())
        setUrls(prev => [...prev, newUrl.trim()])
        setNewUrl('')
        setError('')
      } catch (e) {
        setError('Please enter a valid URL.')
      }
    }
  }
  
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleRemoveUrl = (index) => {
    setUrls(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleSubmit = async () => {
    setIsProcessing(true)
    setError('')
    
    try {
      if (files.length > 0) {
        setProcessingStatus('Processing documents...')
        const processedFiles = await addDocumentsToKnowledgeBase(files)
        onUpload(processedFiles)
      }
      
      if (urls.length > 0) {
        setProcessingStatus('Processing URLs...')
        const processedUrls = await addUrlsToKnowledgeBase(urls)
        onUrlsAdd(processedUrls)
      }
      
      onClose()
    } catch (error) {
      console.error('Error processing knowledge base:', error)
      setError('An error occurred while processing your knowledge base. Please try again.')
      setIsProcessing(false)
    }
  }
  
  return (
    <div className={`knowledge-base-overlay theme-${theme}`}>
      <div className="knowledge-base-modal" style={{ '--primary-color': primaryColor }}>
        <div className="knowledge-base-header">
          <h3>Connect Knowledge Base</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="knowledge-base-tabs">
          <button 
            className={`tab-button ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            Upload Files
          </button>
          <button 
            className={`tab-button ${activeTab === 'urls' ? 'active' : ''}`}
            onClick={() => setActiveTab('urls')}
          >
            Add URLs
          </button>
        </div>
        
        <div className="knowledge-base-content">
          {error && <div className="error-message">{error}</div>}
          
          {isProcessing ? (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>{processingStatus}</p>
            </div>
          ) : (
            <>
              {activeTab === 'files' && (
                <div className="files-tab">
                  <div 
                    ref={dropAreaRef}
                    className="file-upload-area"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-icon">📄</div>
                    <div>
                      <strong>Choose files</strong> or drag them here
                    </div>
                    <div className="file-types">PDF, DOCX, TXT (Max 10MB)</div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      multiple 
                      accept=".pdf,.docx,.doc,.txt" 
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  {files.length > 0 && (
                    <div className="selected-files">
                      <h4>Selected Files:</h4>
                      <ul>
                        {files.map((file, index) => (
                          <li key={index}>
                            <div className="file-info">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button 
                              className="remove-button"
                              onClick={() => handleRemoveFile(index)}
                              aria-label={`Remove ${file.name}`}
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'urls' && (
                <div className="urls-tab">
                  <div className="url-input-container">
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="Enter URL (e.g., https://example.com/docs)"
                      onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
                    />
                    <button onClick={handleUrlAdd}>Add</button>
                  </div>
                  
                  <div className="url-info">
                    <p>Add URLs to web pages, blog posts, or documentation that contain relevant information.</p>
                  </div>
                  
                  {urls.length > 0 && (
                    <div className="selected-urls">
                      <h4>Added URLs:</h4>
                      <ul>
                        {urls.map((url, index) => (
                          <li key={index}>
                            <div className="url-display" title={url}>
                              {url.length > 40 ? `${url.substring(0, 37)}...` : url}
                            </div>
                            <button 
                              className="remove-button"
                              onClick={() => handleRemoveUrl(index)}
                              aria-label={`Remove ${url}`}
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="knowledge-base-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button 
            className="connect-button"
            onClick={handleSubmit}
            disabled={isProcessing || (files.length === 0<xbeshArtifact id="enhanced-ai-chat-system-continued" title="Enhanced AI Chat System with Knowledge Base Integration (Continued)">
<xbeshAction type="file" filePath="src/components/KnowledgeBase.jsx">
import React, { useState, useRef } from 'react'
import './KnowledgeBase.css'
import { addDocumentsToKnowledgeBase, addUrlsToKnowledgeBase } from '../services/knowledgeService'

const KnowledgeBase = ({ onUpload, onUrlsAdd, onClose, theme = 'light', primaryColor = '#5c6bc0' }) => {
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState([])
  const [newUrl, setNewUrl] = useState('')
  const [activeTab, setActiveTab] = useState('files')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [error, setError] = useState('')
  
  const fileInputRef = useRef(null)
  const dropAreaRef = useRef(null)
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} exceeds the 10MB limit.`)
        return false
      }
      return true
    })
    
    setFiles(prev => [...prev, ...selectedFiles])
    setError('')
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('drag-over')
    }
  }
  
  const handleDragLeave = () => {
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('drag-over')
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    handleDragLeave()
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const fileType = file.type
      // Check if file type is allowed
      if (!fileType.includes('pdf') && !fileType.includes('word') && !fileType.includes('text/plain')) {
        setError(`File ${file.name} is not a supported format (PDF, DOCX, TXT).`)
        return false
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} exceeds the 10MB limit.`)
        return false
      }
      return true
    })
    
    setFiles(prev => [...prev, ...droppedFiles])
    if (droppedFiles.length > 0) {
      setError('')
    }
  }
  
  const handleUrlAdd = () => {
    if (newUrl.trim()) {
      try {
        // Validate URL
        new URL(newUrl.trim())
        setUrls(prev => [...prev, newUrl.trim()])
        setNewUrl('')
        setError('')
      } catch (e) {
        setError('Please enter a valid URL.')
      }
    }
  }
  
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleRemoveUrl = (index) => {
    setUrls(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleSubmit = async () => {
    setIsProcessing(true)
    setError('')
    
    try {
      if (files.length > 0) {
        setProcessingStatus('Processing documents...')
        const processedFiles = await addDocumentsToKnowledgeBase(files)
        onUpload(processedFiles)
      }
      
      if (urls.length > 0) {
        setProcessingStatus('Processing URLs...')
        const processedUrls = await addUrlsToKnowledgeBase(urls)
        onUrlsAdd(processedUrls)
      }
      
      onClose()
    } catch (error) {
      console.error('Error processing knowledge base:', error)
      setError('An error occurred while processing your knowledge base. Please try again.')
      setIsProcessing(false)
    }
  }
  
  return (
    <div className={`knowledge-base-overlay theme-${theme}`}>
      <div className="knowledge-base-modal" style={{ '--primary-color': primaryColor }}>
        <div className="knowledge-base-header">
          <h3>Connect Knowledge Base</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="knowledge-base-tabs">
          <button 
            className={`tab-button ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            Upload Files
          </button>
          <button 
            className={`tab-button ${activeTab === 'urls' ? 'active' : ''}`}
            onClick={() => setActiveTab('urls')}
          >
            Add URLs
          </button>
        </div>
        
        <div className="knowledge-base-content">
          {error && <div className="error-message">{error}</div>}
          
          {isProcessing ? (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>{processingStatus}</p>
            </div>
          ) : (
            <>
              {activeTab === 'files' && (
                <div className="files-tab">
                  <div 
                    ref={dropAreaRef}
                    className="file-upload-area"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-icon">📄</div>
                    <div>
                      <strong>Choose files</strong> or drag them here
                    </div>
                    <div className="file-types">PDF, DOCX, TXT (Max 10MB)</div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      multiple 
                      accept=".pdf,.docx,.doc,.txt" 
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  {files.length > 0 && (
                    <div className="selected-files">
                      <h4>Selected Files:</h4>
                      <ul>
                        {files.map((file, index) => (
                          <li key={index}>
                            <div className="file-info">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button 
                              className="remove-button"
                              onClick={() => handleRemoveFile(index)}
                              aria-label={`Remove ${file.name}`}
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'urls' && (
                <div className="urls-tab">
                  <div className="url-input-container">
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="Enter URL (e.g., https://example.com/docs)"
                      onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
                    />
                    <button onClick={handleUrlAdd}>Add</button>
                  </div>
                  
                  <div className="url-info">
                    <p>Add URLs to web pages, blog posts, or documentation that contain relevant information.</p>
                  </div>
                  
                  {urls.length > 0 && (
                    <div className="selected-urls">
                      <h4>Added URLs:</h4>
                      <ul>
                        {urls.map((url, index) => (
                          <li key={index}>
                            <div className="url-display" title={url}>
                              {url.length > 40 ? `${url.substring(0, 37)}...` : url}
                            </div>
                            <button 
                              className="remove-button"
                              onClick={() => handleRemoveUrl(index)}
                              aria-label={`Remove ${url}`}
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="knowledge-base-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button 
            className="connect-button"
            onClick={handleSubmit}
            disabled={isProcessing || (files.length === 0 && urls.length === 0)}
          >
            {isProcessing ? 'Processing...' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeBase
