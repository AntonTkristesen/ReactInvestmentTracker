import { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/aiService';

export default function AIChat({ investmentContext }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hej! Jeg er din AI investeringsassistent. Hvordan kan jeg hjælpe dig i dag?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isRequestInProgress = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    // Prevent multiple simultaneous requests
    if (!input.trim() || loading || isRequestInProgress.current) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message immediately
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);
    isRequestInProgress.current = true;

    try {
      // Pass conversation history (excluding system message) for context
      // Only pass actual conversation, not the initial greeting
      const conversationHistory = updatedMessages.slice(1); // Skip initial greeting
      const response = await chatWithAI(userMessage, investmentContext, conversationHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error chatting with AI:', error);
      const errorMessage = error.message || 'Beklager, der opstod en fejl. Prøv igen senere.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMessage },
      ]);
    } finally {
      setLoading(false);
      isRequestInProgress.current = false;
    }
  };

  const suggestedQuestions = [
    'Hvad er min forventede profit?',
    'Hvornår når jeg mit mål?',
    'Er min strategi god?',
    'Hvordan kan jeg forbedre min ROI?',
  ];

  // Check if we should show rate limit warning
  const showRateLimitWarning = messages.some(msg => 
    msg.content && msg.content.includes('Rate limit')
  );

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>Chat med AI</h3>
        {showRateLimitWarning && (
          <div className="rate-limit-warning">
            Gratis tier: Max 3 anmodninger per minut
          </div>
        )}
      </div>
      
      <div className="ai-chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`ai-chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="ai-chat-message-content">{message.content}</div>
          </div>
        ))}
        {loading && (
          <div className="ai-chat-message assistant-message">
            <div className="ai-chat-message-content">
              <span className="ai-typing">Skriver...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-suggestions">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            className="ai-suggestion-button"
            onClick={() => setInput(question)}
          >
            {question}
          </button>
        ))}
      </div>

      <form className="ai-chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          className="ai-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Spørg om dine investeringer..."
          disabled={loading}
        />
        <button 
          type="submit" 
          className="ai-chat-send-button"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

