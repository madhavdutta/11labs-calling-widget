import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import { getKnowledgeBase, clearKnowledgeBase } from '../services/knowledgeService'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('knowledge')
  const [knowledgeItems, setKnowledgeItems] = useState([])
  const [stats, setStats] = useState({
    totalInteractions: 0,
    averageResponseTime: 0,
    topQueries: [],
    knowledgeBaseSize: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Load knowledge base items
    const loadKnowledgeBase = async () => {
      setIsLoading(true)
      try {
        const items = await getKnowledgeBase()
        setKnowledgeItems(items)
        
        // Simulate loading stats
        setStats({
          totalInteractions: Math.floor(Math.random() * 1000),
          averageResponseTime: (Math.random() * 2 + 0.5).toFixed(2),
          topQueries: [
            'How do I reset my password?',
            'What are your business hours?',
            'Do you offer refunds?',
            'How can I contact support?',
            'What payment methods do you accept?'
          ],
          knowledgeBaseSize: items.length
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadKnowledgeBase()
  }, [])
  
  const handleClearKnowledgeBase = async () => {
    if (window.confirm('Are you sure you want to clear your entire knowledge base? This action cannot be undone.')) {
      try {
        await clearKnowledgeBase()
        setKnowledgeItems([])
        setStats(prev => ({
          ...prev,
          knowledgeBaseSize: 0
        }))
      } catch (error) {
        console.error('Error clearing knowledge base:', error)
      }
    }
  }
  
  const handleRemoveItem = (id) => {
    // In a real implementation, this would call an API to remove the item
    setKnowledgeItems(prev => prev.filter(item => item.id !== id))
    setStats(prev => ({
      ...prev,
      knowledgeBaseSize: prev.knowledgeBaseSize - 1
    }))
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>AI Assistant Dashboard</h1>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'knowledge' ? 'active' : ''}`}
          onClick={() => setActiveTab('knowledge')}
        >
          Knowledge Base
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      
      <div className="dashboard-content">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'knowledge' && (
              <div className="knowledge-tab">
                <div className="knowledge-header">
                  <h2>Knowledge Base Management</h2>
                  <button 
                    className="clear-button"
                    onClick={handleClearKnowledgeBase}
                    disabled={knowledgeItems.length === 0}
                  >
                    Clear Knowledge Base
                  </button>
                </div>
                
                {knowledgeItems.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>Your knowledge base is empty</h3>
                    <p>Add documents or URLs to help your AI assistant provide accurate responses.</p>
                  </div>
                ) : (
                  <div className="knowledge-list">
                    <div className="knowledge-list-header">
                      <span className="col-name">Name</span>
                      <span className="col-type">Type</span>
                      <span className="col-date">Added</span>
                      <span className="col-actions">Actions</span>
                    </div>
                    
                    {knowledgeItems.map(item => (
                      <div className="knowledge-item" key={item.id}>
                        <span className="col-name" title={item.name || item.url}>
                          {item.name || item.url}
                        </span>
                        <span className="col-type">
                          {item.url ? 'URL' : item.type.split('/')[1].toUpperCase()}
                        </span>
                        <span className="col-date">
                          {formatDate(item.added)}
                        </span>
                        <span className="col-actions">
                          <button 
                            className="remove-item-button"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label={`Remove ${item.name || item.url}`}
                          >
                            Remove
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="analytics-tab">
                <h2>Performance Analytics</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Interactions</h3>
                    <div className="stat-value">{stats.totalInteractions}</div>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Avg. Response Time</h3>
                    <div className="stat-value">{stats.averageResponseTime}s</div>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Knowledge Base Size</h3>
                    <div className="stat-value">{stats.knowledgeBaseSize} items</div>
                  </div>
                </div>
                
                <div className="top-queries">
                  <h3>Top Queries</h3>
                  <ul>
                    {stats.topQueries.map((query, index) => (
                      <li key={index}>{query}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="analytics-note">
                  <p>Note: In a production environment, this would display real analytics data from your AI assistant interactions.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h2>Widget Settings</h2>
                
                <div className="settings-section">
                  <h3>Appearance</h3>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Theme</label>
                      <select defaultValue="light">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Primary Color</label>
                      <input type="color" defaultValue="#5c6bc0" />
                    </div>
                    
                    <div className="form-group">
                      <label>Position</label>
                      <select defaultValue="bottom-right">
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Custom Logo URL</label>
                      <input type="url" placeholder="https://example.com/logo.png" />
                    </div>
                  </div>
                </div>
                
                <div className="settings-section">
                  <h3>Behavior</h3>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Welcome Message</label>
                      <input type="text" defaultValue="Hello! How can I help you today?" />
                    </div>
                    
                    <div className="form-group">
                      <label>Widget Title</label>
                      <input type="text" defaultValue="AI Assistant" />
                    </div>
                    
                    <div className="form-group checkbox">
                      <input type="checkbox" id="auto-open" defaultChecked={false} />
                      <label htmlFor="auto-open">Auto-open widget on page load</label>
                    </div>
                    
                    <div className="form-group checkbox">
                      <input type="checkbox" id="show-branding" defaultChecked={true} />
                      <label htmlFor="show-branding">Show "Powered by" branding</label>
                    </div>
                  </div>
                </div>
                
                <div className="settings-section">
                  <h3>Voice Settings</h3>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Voice</label>
                      <select defaultValue="default">
                        <option value="default">Default Voice</option>
                        <option value="male1">Male Voice 1</option>
                        <option value="female1">Female Voice 1</option>
                        <option value="female2">Female Voice 2</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Speech Rate</label>
                      <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
                    </div>
                    
                    <div className="form-group checkbox">
                      <input type="checkbox" id="auto-speak" defaultChecked={true} />
                      <label htmlFor="auto-speak">Auto-speak responses</label>
                    </div>
                  </div>
                </div>
                
                <div className="settings-actions">
                  <button className="save-button">Save Settings</button>
                  <button className="reset-button">Reset to Defaults</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
