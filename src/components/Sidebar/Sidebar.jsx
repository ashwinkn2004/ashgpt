import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { Menu, Plus, MessageSquare, CircleHelp, History, Settings } from 'lucide-react'
import { Context } from '../../context/Context'

const Sidebar = () => {

    const [extended, setExtended] = useState(true);
    const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt)
        await onSent(prompt)
    }
    return (
        <div className='sidebar'>
            <div className="top">
                <div className="top-item">
                    <div className="drawer">
                        <Menu className="icon menu-icon" onClick={() => setExtended(prev => !prev)} strokeWidth={1.5} />
                        {extended ? <h1 className="fade-in">AshGPT</h1> : null}
                    </div>
                    <div className="new-chat" onClick={() => newChat()}>
                        <Plus className="icon plus-icon" />
                        {extended ? <p className="fade-in">New Chat</p> : null}
                    </div>
                    {extended ?
                        <div className="recent fade-in">
                            <p className="recent-title">Recent</p>
                            {prevPrompts.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                                        <MessageSquare className="icon message-icon" />
                                        <p>{item.slice(0, 18)} ...</p>
                                    </div>
                                )
                            })}
                        </div>
                        : null}
                </div>
            </div>

            <div className="bottom">
                <div className="divider">
                    <hr />
                </div>
                <div className="bottom-item">
                    <CircleHelp className="icon" />
                    {extended ? <p className="fade-in">questions</p> : null}
                </div>
                <div className="bottom-item">
                    <History className="icon" />
                    {extended ? <p className="fade-in">history</p> : null}
                </div>
                <div className="bottom-item">
                    <Settings className="icon" />
                    {extended ? <p className="fade-in">settings</p> : null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar