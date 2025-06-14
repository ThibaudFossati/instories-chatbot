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
  }import React, { useState, useEffect, useRef } from "react";
import "./theme-apple.css";

const STORAGE_KEY = "instories-messages";

function App() {
  const [messages, setMessages] = useState(() => {
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

const sendMessage = async () => {n
  if (!input.trim()) return;n
n
  const keywords = ["devis", "projet", "tarif", "coût", "prix", "estimation"];n
  if (keywords.some((k) => input.toLowerCase().includes(k))) {n
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });n
    const offerMsg = {n
      role: "assistant",n
      content: "Nous créons des solutions IA sur mesure (images, vidéos). Pour un devis, envoyez un email à contact@instories.fr.",n
      timestamp: now,n
    };n
    setMessages((prev) => [...prev, offerMsg]);n
    setInput("");n
    return;n
  }n
n
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });n
  const userMsg = {n
    role: "user",n
    content: input,n
    timestamp: now,n
  };n
  setMessages((prev) => [...prev, userMsg]);n
  setInput("");n
n
  try {n
    const response = await fetch("/api/chat", {n
      method: "POST",n
      headers: { "Content-Type": "application/json" },n
      body: JSON.stringify({ message: input }),n
    });n
    const data = await response.json();n
    const assistantMsg = {n
      role: "assistant",n
      content: data.reply,n
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),n
    };n
    setMessages((prev) => [...prev, assistantMsg]);n
  } catch (error) {n
    console.error("Erreur côté client:", error);n
  }n
};