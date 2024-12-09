# 🍕 Pizza App
Pizza App is a feature-rich Next.js application for managing pizzas and their toppings.
Users can add, delete, and customize pizzas with a variety of toppings. This application is built using Next.js, React, and Supabase, ensuring scalability, performance, and seamless database interactions.

# 📖 Overview
This project demonstrates a robust architecture using modern web development practices. Key technical choices include:

Next.js: Leveraged for its ability to quickly deploy full-stack applications. Its built-in support for API routes simplifies backend development, and its standardized approach to frontend development accelerates the development process.

React: Provides a component-based architecture for building reusable and maintainable user interfaces.

Supabase: Offers an easy-to-use backend solution with a PostgreSQL database and API endpoints.

Testing Tools: Jest and React Testing Library ensure a reliable and maintainable codebase.

# 🌐 Demo
You can explore the live application here: Pizza App Demo

# 🚀 Features
Add and manage pizzas.

Customize pizzas with toppings.

View and delete existing pizzas.

API-backed by Supabase for seamless data management.

# 🛠️ Getting Started
Follow these instructions to set up the project on your local machine for development and testing.

# Prerequisites
Supabase Account: Sign up at Supabase.

Project Setup

Install dependencies:
npm install

## Set up environment variables:
Create a .env.local file in the root directory.

Add the following:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Setup
Log in to your Supabase dashboard and create a new project.

Under the API section, copy your Project URL and Anon Key.

### Use the SQL editor in Supabase to create tables:

CREATE TABLE pizzas (
id SERIAL PRIMARY KEY,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
name TEXT
);

CREATE TABLE pizza_toppings (
id SERIAL PRIMARY KEY,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
pizza_id INTEGER REFERENCES pizzas(id),
topping TEXT
);

# Start the Development Server
Run the server:

npm run dev

Open your browser and navigate to http://localhost:3000.

# 🧪 Running Tests
This project includes an automated test suite to ensure code quality. Test coverage is provided using Jest. Additional setup for more in-depth testing can be configured in the jest.config.js file.

Run tests using:

npm test

# 📜 API Documentation
This project includes an API reference document, Pizza-API-Docs.html, which provides detailed information on the available API endpoints, request parameters, and responses. The documentation serves as a guide for understanding the Pizza API functionality and usage, similar to Swagger-style documentation. Key features include:

Endpoint descriptions: Information about each API route, such as /api/pizzas and /api/pizzas/{id}.

Request and response formats: Detailed examples for each method (GET, POST, DELETE) with schemas and status codes.

Interactive layout: Organized sections for pizzas, toppings, and schema definitions.

# 🏗️ Deployment
This application can be easily deployed on Vercel or any similar platform.

Create a Vercel Account: Sign up if you don't already have one.

Import the Project: Link the repository directly to your Vercel account.

Set Environment Variables: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the project settings.

Deploy: Vercel automatically builds and deploys the application.

# 📂 Project Structure
src/components/: Reusable React components.

src/hooks/: Custom hooks for application logic.

src/lib/: Utilities and Supabase client setup.

src/pages/: Application pages and API routes.

src/styles/: CSS modules and global styles.

src/__tests__/: Unit and integration tests.

# ✨ Thought Process
Rapid Development and Deployment: Next.js was chosen for its ability to quickly deploy full-stack applications. Its built-in support for API routes simplifies backend development, and its standardized approach to frontend development accelerates the development process.
Integrated Testing: Next.js natively supports Jest, making it an excellent choice for maintaining code quality. React Testing Library complements this by focusing on testing user interactions and components in isolation.
Scalable Backend: Supabase was selected for its seamless integration with modern web applications, providing a scalable and feature-rich backend.