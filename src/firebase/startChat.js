
//  Import Firestore functions to interact with your Firebase database.
// src/firebase/startChat.js
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function startChat(currentUserId, targetUserId) {
  const chatRef = collection(db, "chats");

  // Generate a unique chat ID (sorted)
  const chatId = [currentUserId, targetUserId].sort().join('_');

  // Check if chat with this ID exists
  const q = query(chatRef, where("chatId", "==", chatId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  // Create new chat
  const newChat = await addDoc(chatRef, {
    chatId,
    users: [currentUserId, targetUserId]
  });

  return newChat.id;
}






// // src/firebase/startChat.js
// import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
// import { db } from "./firebase";

// export async function startChat(currentUserId, targetUserId) {
//   const chatRef = collection(db, "chats");

//   // Check if chat already exists (unordered user pair)
//   const q = query(chatRef, where("users", "array-contains", currentUserId));
//   const snapshot = await getDocs(q);

//   for (const doc of snapshot.docs) {
//     const users = doc.data().users;
//     if (users.includes(targetUserId)) {
//       return doc.id;
//     }
//   }

//   // Create new chat
//   const newChat = await addDoc(chatRef, {
//     users: [currentUserId, targetUserId]
//   });

//   return newChat.id;
// }
