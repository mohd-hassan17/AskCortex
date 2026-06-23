# AskCortex

AskCortex is an AI-powered chat platform that enables users to interact with multiple Large Language Models (LLMs) through a single, unified interface. Users can switch between different AI models, chat with their documents using Retrieval-Augmented Generation (RAG), and receive context-aware responses in real time.

## 🚀 Live Demo

🔗 **Live URL:** [https://askcortex.vercel.app/]

## ✨ Features

* 🤖 Chat with multiple AI models from a single interface
* 📄 Upload documents and chat with them using RAG
* ⚡ Real-time streaming responses
* 🕒 Conversation history management
* 🔍 Semantic search powered by embeddings
* 🔐 Secure authentication and user management
* 📱 Responsive and modern UI

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend & Database

* PostgreSQL
* Supabase
* Drizzle ORM

### AI Stack

* OpenAI API / Gemini API / Claude API
* LangChain
* Embeddings
* Vector Search
* Retrieval-Augmented Generation (RAG)

## 📸 Screenshots

### Dashboard / Chat Interface

![Dashboard Screenshot](<img width="1919" height="946" alt="ask1" src="https://github.com/user-attachments/assets/f40876c2-ab8c-4d09-99f1-0cc5b73a5e2b" />)

### Document Upload & RAG

![RAG Screenshot](<img width="1917" height="937" alt="image" src="https://github.com/user-attachments/assets/aa58dc71-1e29-43ea-9f0d-02c3e9f2bf59" />)

### Multi-Model Chat Experience

![Chat Screenshot](<img width="1500" height="892" alt="image" src="https://github.com/user-attachments/assets/a462f1a2-dbf9-46ad-9cd7-19256ee37c0f" />)

## 🏗️ Architecture

1. Users authenticate and access the platform.
2. Documents are uploaded and processed.
3. Text is chunked and converted into embeddings.
4. Embeddings are stored in a vector database.
5. During chat, relevant context is retrieved and passed to the selected LLM.
6. Responses are streamed back to users in real time.

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/askcortex.git
```

### Navigate to the project

```bash
cd askcortex
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file and add:

```env
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

### Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 🎯 What I Learned

Building AskCortex helped me gain practical experience in:

* Designing and shipping AI products
* Building Retrieval-Augmented Generation (RAG) systems
* Working with embeddings and vector search
* Handling streaming AI responses
* Managing real-world deployment challenges

## 📄 License

This project is licensed under the MIT License.
