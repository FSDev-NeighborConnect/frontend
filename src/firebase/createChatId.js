// import axios from 'axios';

// const loggedInUserId = async () => {
//   try {
//     const res = await axios.get('/api/users/me', {
//       withCredentials: true, // sends the cookie (JWT)
//     });

//     const userId = res.data.id;
//     const userRole = res.data.role;
//     // const csrfToken = res.data.csrfToken;
    
//     // Store userId and role
//     localStorage.setItem('userId', userId);
//     localStorage.setItem('userRole', userRole);
//     //Set CSRF token in React state if function provided
//     // if (csrfToken && setCsrfToken) {
//     //   setCsrfToken(csrfToken);
//     // }

//     console.log("Logged-in user ID:", userId);
//     return userId;

//   } catch (err) {
//     console.error("Failed to get logged-in user:", err.message);
//     return null;
//   }
// };

// const targetUserId = async () => {
//   try {
//     const csrfToken = localStorage.getItem('csrfToken');
//     const res = await axios.get(`/api/users/user/${targetUserId}`, {
//       withCredentials: true,
//       headers: {
//         'X-CSRF-Token': csrfToken
//       }
//     });

//     // Example structure based on backend response
//     const targetUser = res.data.id;

//     console.log("Target user info:", targetUser);
//     return targetUser;

//   } catch (err) {
//     console.error("Failed to fetch target user:", err.message);
//     return null;
//   }
// };



// //  To sort and join the unique user id retrieved from DB
// function createChatId (){
//     const loggedInUserId = loggedInUserId

//     if (currentUserId && targetUserId != null){
//     return [loggedInUserId, targetUserId].sort().join('_');
// }}

// // ....................


// import { startChat } from "../firebase/startChat";

// const handleStartChat = async () => {
//   const currentUserId = localStorage.getItem("userId"); // from logged-in user
//   const chatId = await startChat(currentUserId, targetUserId);
//   // redirect to chat screen with chatId
// };

// const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     setError("")

//     try {
//       const res = await axios.post(
//         "/api/login",
//         { email: email.trim(), password },
//         { withCredentials: true }
//       )
//       setCsrfToken(res.data.csrfToken) // Storing token in React state

//       navigate("/") // Add correct navigation when the page is added to the router.
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed")
//     }
//   }
