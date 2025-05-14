// src/firebase/listenToMessages.js
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function listenToMessages(chatId, callback) {
  const msgRef = collection(db, "chats", chatId, "messages");
  const q = query(msgRef, orderBy("timestamp"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
}
