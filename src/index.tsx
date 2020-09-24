import React from "react";
import ReactDOM from "react-dom";
import { useChat } from "nlx-chat-sdk/lib/react-utils";
import marked from "marked";
import "./index.css";

const App: React.FC<{}> = () => {
  const chat = useChat({
    botUrl: "",
    headers: {
      "nlx-api-key": "",
    },
  });

  // Auto-focus input
  const inputRef = React.useCallback((node) => {
    node.focus();
  }, []);

  if (chat === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <div className="shadow-lg rounded max-w-xl m-auto">
        <div className="p-3 border-b border-gray-300">
          <p className="text-xl">My Widget</p>
        </div>
        <div
          style={{ height: 360 }}
          className="p-3 max-h-full overflow-y-auto space-y-2"
          ref={chat.messagesContainerRef}
        >
          {chat.messages.map((message, index) => {
            if (message.author === "bot") {
              return (
                <div
                  className="static bg-blue-600 text-white rounded px-2 py-1 self-start"
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: marked(message.text),
                  }}
                />
              );
            }
            if (message.author === "user" && message.payload.type === "text") {
              return (
                <div
                  className="bg-gray-200 rounded px-2 py-1 self-end"
                  key={index}
                >
                  {message.payload.text}
                </div>
              );
            }
            return null;
          })}
          {chat.waiting && <div>...</div>}
        </div>
        <div className="p-3 border-t border-gray-300">
          <input
            ref={inputRef}
            className="border px-2 py-1 border-gray-300 rounded block w-full"
            value={chat.inputValue}
            placeholder="Type your message"
            onChange={(ev) => {
              chat.setInputValue(ev.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                chat.conversationHandler.sendText(chat.inputValue);
                chat.setInputValue("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
