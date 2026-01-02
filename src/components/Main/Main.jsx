import React, { useContext, useEffect, useRef } from 'react'
import './Main.css'
import { Lightbulb, PlaneTakeoff, StickyNote, Code, SendHorizontal } from 'lucide-react';
import Footer from '../Footer/Footer';
import { Context } from '../../context/Context';
import { assets } from '../../assets/assets';

const Main = () => {

  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, messages } = useContext(Context);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showResult, loading]); // Update scroll dependency to messages

  return (
    <div className="main">
      {!showResult ? (
        <div className="welcome-container">
          <div className="ashgpt-intro">
            <img src="../../../favicon.png" alt="AshGPT Logo" className='logo' />
            <h1>Welcome to AshGPT</h1>
            <p>How can I help you today?</p>
          </div>
          <div className="text-input" style={{ marginBottom: '30px' }}>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Message AshGPT..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSent();
                }
              }}
            />
            <div className="send-btn" onClick={() => onSent()}>
              <SendHorizontal size={20} color="#3b82f6" />
            </div>
          </div>
          <div className="sample-input">
            <div className="input" onClick={() => { setInput("Write a Python script"); onSent("Write a Python script"); }}>
              <Code className='code-icon' />
              <p>Write a Python script</p>
            </div>
            <div className="input" onClick={() => { setInput("Summarize this text"); onSent("Summarize this text"); }}>
              <StickyNote className='summary-icon' />
              <p>Summarize this text</p>
            </div>
            <div className="input" onClick={() => { setInput("Plan a trip to Tokyo"); onSent("Plan a trip to Tokyo"); }}>
              <PlaneTakeoff className='plane-icon' />
              <p>Plan a trip to Tokyo</p>
            </div>
            <div className="input" onClick={() => { setInput("Brainstorm ideas"); onSent("Brainstorm ideas"); }}>
              <Lightbulb className='lightbulb-icon' />
              <p>Brainstorm ideas</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="result">
          {messages.map((msg, index) => {
            if (msg.role === 'user') {
              return (
                <div key={index} className="result-title">
                  <img src="../../../favicon.png" alt="" className='user-icon-chat' />
                  <p>{msg.content}</p>
                </div>
              );
            } else {
              return (
                <div key={index} className="result-data">
                  <img src={assets.gemini_icon} alt="" />
                  <p dangerouslySetInnerHTML={{ __html: msg.content }}></p>
                </div>
              );
            }
          })}

          {loading && (
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              <div className="loader">
                <hr />
                <hr />
                <hr />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {showResult && (
        <div className="text-input chat-input">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Message AshGPT..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSent();
              }
            }}
          />
          <div className="send-btn" onClick={() => onSent()}>
            <SendHorizontal size={20} color="#3b82f6" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Main