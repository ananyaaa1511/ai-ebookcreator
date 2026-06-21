AI eBook Creator 📖

A full-stack web application for writing, editing, and publishing eBooks — with AI-assisted content generation, cover image uploads, and one-click export to PDF and Word.

🔗 Live Demo: ai-ebookcreator.vercel.app
💻 Repository: github.com/ananyaaa1511/ai-ebookcreator

 Features
User authentication — secure registration and login with JWT-based sessions
Book management — create, edit, and delete books from a personal dashboard
AI-powered content generation — generate book outlines and chapter content using the Gemini API
Cover image uploads — personalize each book with a custom cover
Export — download books as PDF or Word (.docx) files
Responsive UI — built with React and Tailwind CSS

Frontend


React (Vite)
Tailwind CSS
React Router
Axios
React Hot Toast


Backend


Node.js / Express
<br>
MongoDB (Mongoose)
<br>
JWT authentication
<br>
Google Gemini API (AI content generation)


Deployment


Frontend: Vercel
<br>
Backend: Render
<br>
Database: MongoDB Atlas

Backend setup

bashcd backend
npm install

Create a .env file in backend/ with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
GEMINI_API_KEY=your_gemini_api_key

Run the backend:

bashnpm run dev

Frontend setup

bashcd frontend/ebookcreator
npm install
npm run dev

By default, the frontend expects the backend at http://localhost:5000. To override this, create a .env file in frontend/ebookcreator/ with:

VITE_API_URL=http://localhost:5000


Screenshots
<img width="1912" height="963" alt="image" src="https://github.com/user-attachments/assets/fbf44227-64b1-44f5-a4f3-a4ba7ca9c0c5" />
<img width="1917" height="812" alt="image" src="https://github.com/user-attachments/assets/25f50569-eaa5-4520-8074-bc7df30b960a" />
