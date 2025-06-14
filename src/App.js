  const keywords = ["devis", "projet", "tarif", "coût", "prix", "estimation"];
  if (keywords.some((k) => input.toLowerCase().includes(k))) {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const offerMsg = {
      role: "assistant",
      content: "Nous créons des solutions IA sur mesure (images, vidéos). Pour un devis, envoyez un email à contact@instories.fr.",
      timestamp: now,
    };
    setMessages((prev) => [...prev, offerMsg]);
    setInput("");
  }import React, { useState, useEffect, useRef } from "react";
import "./theme-apple.css";
import IntroForm from "./components/IntroForm";
const STORAGE_KEY = "instories-messages";

function App() {
  const [introDone, setIntroDone] = useState(false);  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            content:
              "Bonjour, je suis **InStories**, votre assistant conversationnel dédié à la création haut de gamme. Posez-moi vos questions, je suis à votre écoute.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

const sendMessage = async () => {
  if (!input.trim()) return;

  const keywords = ["devis", "projet", "tarif", "coût", "prix", "estimation"];
  if (keywords.some((k) => input.toLowerCase().includes(k))) {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const offerMsg = {
      role: "assistant",
      content: "Nous créons des solutions IA sur mesure (images, vidéos). Pour un devis, envoyez un email à contact@instories.fr.",
      timestamp: now,
    };
    setMessages((prev) => [...prev, offerMsg]);
    setInput("");
    return;
  }

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const userMsg = {
    role: "user",
    content: input,
    timestamp: now,
  };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    const assistantMsg = {
      role: "assistant",
      content: data.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, assistantMsg]);
  } catch (error) {
    console.error("Erreur côté client:", error);
  }
};