import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import "./AIAssistant.css";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

type Position = {
  x: number;
  y: number;
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [position, setPosition] = useState<Position>({
    x: 28,
    y: 28,
  });

  const [isDragging, setIsDragging] = useState(false);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  const hasMoved = useRef(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Salom! 👋 Sizga qanday yordam beray?",
      sender: "ai",
    },
  ]);

  const handleSend = () => {
    const text = message.trim();

    if (!text) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setMessage("");

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: `Savolingizni oldim: "${text}". Hozircha AI API ulanmagan.`,
        sender: "ai",
      };

      setMessages((current) => [
        ...current,
        aiMessage,
      ]);
    }, 500);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleMouseDown = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    dragOffset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    hasMoved.current = false;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      hasMoved.current = true;

      const buttonSize = 64;
      const margin = 10;

      const nextLeft =
        event.clientX -
        dragOffset.current.x;

      const nextTop =
        event.clientY -
        dragOffset.current.y;

      const maxLeft =
        window.innerWidth -
        buttonSize -
        margin;

      const maxTop =
        window.innerHeight -
        buttonSize -
        margin;

      const left = Math.max(
        margin,
        Math.min(nextLeft, maxLeft),
      );

      const top = Math.max(
        margin,
        Math.min(nextTop, maxTop),
      );

      setPosition({
        x: window.innerWidth - left - buttonSize,
        y: window.innerHeight - top - buttonSize,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener(
      "mousemove",
      handleMouseMove,
    );

    document.addEventListener(
      "mouseup",
      handleMouseUp,
    );

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove,
      );

      document.removeEventListener(
        "mouseup",
        handleMouseUp,
      );
    };
  }, [isDragging]);

  const handleLauncherClick = () => {
    if (hasMoved.current) {
      hasMoved.current = false;
      return;
    }

    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {isOpen && (
        <div
          className="ai-window"
          style={{
            right: `${position.x}px`,
            bottom: `${position.y + 80}px`,
          }}
        >
          <div className="ai-header">
            <div className="ai-title">
              <span className="ai-mini-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
                  <path d="M19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" />
                </svg>
              </span>

              <div>
                <strong>AI Assistant</strong>
                <small>Online yordamchi</small>
              </div>
            </div>

            <button
              type="button"
              className="ai-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="ai-body">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`ai-message ${
                  item.sender === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
              >
                {item.sender === "ai" && (
                  <div className="message-icon">
                    ✦
                  </div>
                )}

                <div className="message-text">
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div className="ai-input-area">
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Savolingizni yozing..."
            />

            <button
              type="button"
              className="ai-send"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <svg viewBox="0 0 24 24">
                <path d="M21 3L10 14" />
                <path d="M21 3l-7 18-4-7 18-7Z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`ai-launcher ${
          isOpen ? "active" : ""
        } ${isDragging ? "dragging" : ""}`}
        style={{
          right: `${position.x}px`,
          bottom: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleLauncherClick}
      >
        <span className="ai-launcher-glow" />

        <svg viewBox="0 0 64 64">
          <rect
            x="14"
            y="17"
            width="36"
            height="31"
            rx="12"
          />

          <path d="M32 17V10" />

          <circle
            cx="32"
            cy="8"
            r="3"
          />

          <circle
            cx="25"
            cy="31"
            r="3"
          />

          <circle
            cx="39"
            cy="31"
            r="3"
          />

          <path d="M24 40c4 3 12 3 16 0" />
        </svg>
      </button>
    </>
  );
}

