import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    // Helper for safe JSON parsing
    const safeParse = (key, fallback) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : fallback;
        } catch (e) {
            console.error(`Error parsing ${key} from localStorage`, e);
            return fallback;
        }
    };

    // UI State
    const [input, setInput] = useState(() => localStorage.getItem("ashgpt_input") || "");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState(() => safeParse("ashgpt_prevPrompts", []));

    // Chat History
    const [messages, setMessages] = useState(() => safeParse("ashgpt_currentMessages", []));

    const [showResult, setShowResult] = useState(() => {
        return messages.length > 0;
    });

    const [loading, setLoading] = useState(false);

    // Save history to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("ashgpt_prevPrompts", JSON.stringify(prevPrompts));
        localStorage.setItem("ashgpt_currentMessages", JSON.stringify(messages));
        localStorage.setItem("ashgpt_input", input);
    }, [prevPrompts, messages, input]);


    const onSent = async (prompt) => {
        const currentPrompt = prompt !== undefined ? prompt : input;
        if (!currentPrompt) return;

        setRecentPrompt(currentPrompt);
        setLoading(true);
        setShowResult(true);
        setInput("");

        // Add user message to UI immediately
        setMessages(prev => [...prev, { role: 'user', content: currentPrompt }]);

        // Prepare history for Gemini (excluding the current prompt which sendMessage handles, 
        // OR better: runChat expects history *before* current prompt)
        // Gemini format: { role: "user" | "model", parts: [{ text: "..." }] }
        const historyForGemini = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        try {
            const response = await runChat(currentPrompt, historyForGemini);

            // Format response (bolding, line breaks)
            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let formattedResponse = newResponse.split("*").join("</br>");

            // Add model response to UI
            // Note: Typing effect is hard with a list of messages unless we handle the "last" message specially.
            // For simplicity and robustness in multi-turn, I'll append the full message. 
            // If typing effect is desired, I'd need a separate 'currentStreamingMessage' state.
            // Given "convo should continue", standard append is safer.
            setMessages(prev => [...prev, { role: 'model', content: formattedResponse }]);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Error: Something went wrong." }]);
        } finally {
            setLoading(false);
        }
    }

    const newChat = () => {
        // Save the FIRST prompt of the session to history, if it exists
        if (messages.length > 0) {
            const firstUserMessage = messages.find(m => m.role === 'user');
            if (firstUserMessage) {
                setPrevPrompts(prev => [firstUserMessage.content, ...prev]);
            }
        }
        setLoading(false);
        setShowResult(false);
        setMessages([]); // Clear current chat session
        setRecentPrompt("");
        setInput(""); // Clear input draft
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        messages, // Export messages instead of resultData
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
