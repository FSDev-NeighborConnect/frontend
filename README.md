# NeighborConnect Frontend

This is the frontend for the **NeighborConnect** project, built with **React**, **Vite**, and styled using **Tailwind CSS**. It interfaces with a backend API to provide functionality such as user interactions and dynamic content.

> This repo contains only the frontend. The backend is expected to run separately, and can be found [here](https://github.com/FSDev-NeighborConnect/backend).


---

## Tech Stack

- **React** (JSX)
- **Vite** (frontend tooling)
- **Tailwind CSS** (styling)
- **Netlify** (deployment)


---

## Prerequisites

- **Node.js**: >=18.0.0  
  This project uses [Vite 6](https://vitejs.dev/) and [React 19](https://react.dev/), which require Node 18 or later

- **npm**: >=9.0.0  
  (Comes bundled with Node.js 18+)

You can check your versions by running:
```bash
node -v
npm -v
```


---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/FSDev-NeighborConnect/frontend.git

cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Copy the example environment file and edit it as needed

```bash
cp .env.example .env
```

### 4. Start the Development Server
```bash
npm run dev
```
The app should now be running at `http://localhost:3000`

> To use a different port, set `VITE_PORT` in your `.env` file


### 5. Build for Production
```bash
npm run build
```

### 6. Preview the Production Build
```bash
npm run preview
```


---

## 📁 Project Structure
```
src/
├── assets/       # Images and static assets
├── context/      # React context providers
├── firebase/     # Chat functionality
├── pages/        # Page-level React components (routes)
├── utils/        # Utility functions
├── App.jsx       # Root app component
├── main.jsx      # Entry point
```


---

## Deployment
The app is deployed via Netlify

Live URL: https://tiny-nasturtium-5c86d1.netlify.app/


---

## Notes
- Make sure your backend is running and accessible at the `VITE_API_URL`

- The frontend expects API responses to be properly CORS-enabled


---

## License
FSDev-NeighborConnect-frontend is licensed under the terms described in the [LICENSE](https://github.com/FSDev-NeighborConnect/frontend/blob/main/LICENSE) file
