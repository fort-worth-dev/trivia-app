# Tricia Trivia

A modern trivia game built with React, TypeScript, and Vite. Questions are dynamically generated using Claude AI (Anthropic).

## Features

- 🎯 **Multiple Categories**: Choose from 12 different trivia categories
- 🎚️ **Difficulty Levels**: Easy, Medium, and Hard difficulty settings
- 📊 **Customizable**: Select 5, 10, 15, or 20 questions per game
- ✨ **Modern UI**: Clean, dark-themed interface with smooth animations
- 🤖 **AI-Powered**: Questions generated on-demand using Claude AI

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Netlify Functions (serverless)
- **AI**: Anthropic Claude API
- **Styling**: CSS Modules
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tricia-trivia
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
```

### Running the Application

#### Local Development

For local development, you can run the Express server:

1. Start the backend server:
```bash
npm run server
```

The server will run on `http://localhost:3001`

2. In a separate terminal, start the frontend dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

#### Using Netlify CLI (Recommended)

Alternatively, you can use Netlify CLI to run the full stack locally:

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Start the local development environment:
```bash
netlify dev
```

This will start both the frontend and Netlify Functions locally.

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Deploying to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set the following environment variable in Netlify:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
4. Deploy!

The build command and publish directory are already configured in `netlify.toml`.

## Project Structure

```
tricia-trivia/
├── src/
│   ├── components/      # React components
│   ├── context/         # Game state management
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   └── types/           # TypeScript type definitions
├── netlify/
│   └── functions/       # Netlify serverless functions
├── server/              # Express backend (for local dev)
└── public/              # Static assets
```

## Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
