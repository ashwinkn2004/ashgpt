import React from 'react'
import './Main.css'
import { Lightbulb, PlaneTakeoff, StickyNote, Code, SendHorizontal } from 'lucide-react';
import Footer from '../Footer/Footer';

const Main = () => {
  return (
    <div className="main">
      <div className="center-logo">
        <img src="../../../favicon.png" alt="AshGPT Logo" className='logo' />
      </div>
      <div className="ashgpt-intro">
        <h1>Welcome to AshGPT</h1>
        <p>How can I help you today?</p>
      </div>
      <div className="text-input">
        <input type="text" placeholder="Message AshGPT..." />
        <div className="send-btn">
          <SendHorizontal size={20} color="#3b82f6" />
        </div>
      </div>
      <div className="sample-input">
        <div className="input">
          <Code className='code-icon' />
          <p>Write a Python script</p>
        </div>
        <div className="input">
          <StickyNote className='summary-icon' />
          <p>Summarize this text</p>
        </div>
        <div className="input">
          <PlaneTakeoff className='plane-icon' />
          <p>Plan a trip to Tokyo</p>
        </div>
        <div className="input">
          <Lightbulb className='lightbulb-icon' />
          <p>Brainstorm ideas</p>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Main