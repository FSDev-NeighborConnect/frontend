// src/firebase/sendMessage.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function sendMessage(chatId, senderId, text) {
  const msgRef = collection(db, "chats", chatId, "messages");
  await addDoc(msgRef, {
    senderId,
    text,
    timestamp: serverTimestamp()
  });
}
