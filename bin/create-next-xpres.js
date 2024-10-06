#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  // console.log("Running:", createNextAppCommand);
  execSync("npx create-next-app@latest", { stdio: "inherit" });

  // Step 4: Create index.js in the root folder with Express server setup
  const serverJsContent = `
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const next = require('next');

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

require('./connection');

nextApp.prepare().then(() => {

    app.use('/_next', express.static('client/.next/static'));

    // Handle all other routes with Next.js
    app.get('*', (req, res) => {
        return handle(req, res);
    });
});

// add your API routes here
app.get('/api', (req, res) => {
  res.send('Hello from Express! Built with \`create-next-xpres\`');
});

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`;

  fs.writeFileSync(
    path.join(process.cwd(), "server.js"),
    serverJsContent.trim()
  );

  const connenctionJSContent = `
const mongoose = require('mongoose');

const Mongo_URI = process.env.MONGO_URI;

mongoose.connect(Mongo_URI).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

module.exports = mongoose;
`;

  fs.writeFileSync(
    path.join(process.cwd(), "connection.js"),
    connenctionJSContent.trim()
  );

  // Step 5: Create package.json in the root folder
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJsonContent = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  );

  // Update the dev and start commands
  packageJsonContent.scripts.start = "node server.js";
  packageJsonContent.scripts.dev = "nodemon server.js";

  // Write the updated package.json back to the file
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJsonContent, null, 2)
  );

  const envContent = `
MONGO_URI=mongodb://localhost:27017/${projectName}
NODE_ENV=development
`;

  fs.writeFileSync(path.join(process.cwd(), ".env"), envContent.trim());

  const readmeContent = `
# Project Name

This project was generated using \`create-next-xpres\`, a CLI tool that sets up a Next.js frontend and an Express backend with optional Tailwind CSS for styling.

## Project Structure

The project is organized as follows:

\`\`\`plaintext
project-name/
├── client/                 # Next.js app (frontend)
│   ├── app/                # Next.js app folder
│   ├── public/             # Public assets
│   ├── tailwind.config.js  # Tailwind CSS configuration (if selected)
│   ├── postcss.config.js   # PostCSS configuration (if selected)
│   └── ...                 # Other Next.js files and folders
├── index.js                # Express server (backend)
├── connection.js           # MongoDB connection preconfigured(backend)
├── package.json            # Root package.json with dependencies and scripts
└── node_modules/           # Node.js dependencies
\`\`\`

## Getting Started

Follow these steps to get your project up and running:

### 1. Install Dependencies

First, install the necessary dependencies for both the frontend (Next.js) and backend (Express):

\`\`\`bash
npm install
\`\`\`

If you have Tailwind CSS configured in your project, the installation of \`tailwindcss\`, \`postcss\`, and \`autoprefixer\` has already been done.

### 2. Run the Development Servers

To start the development environment use the following commands:

- **Start the development server** :

  \`\`\`bash
  npm run dev
  \`\`\`

  This will start the development server, and you can access the frontend and backend at \`http://localhost:3000\`.

- **Start the production server** :

  \`\`\`bash
  npm start
  \`\`\`

  This will start the Express server, and you can access it at \`http://localhost:3000\`.

## Tailwind CSS (Optional)

If you chose to include Tailwind CSS during setup, your project includes pre-configured \`tailwind.config.js\` and \`postcss.config.js\` files. You can customize your Tailwind setup as needed.

### Customization

- **Tailwind Configuration**: Modify the \`client/tailwind.config.js\` file to customize your Tailwind setup.
- **PostCSS Configuration**: Modify the \`client/postcss.config.js\` file to add or change PostCSS plugins.

## Scripts

The \`package.json\` file includes several useful scripts:

- **\`npm start\`**: Starts the production server.
- **\`npm run dev\`**: Starts the development server using nodemon.

## API Routes

The Express server includes a basic API route in \`index.js\`. You can add more routes as needed:

\`\`\`javascript
app.get('/api', (req, res) => {
  res.send('Hello from Express! 'Built with create-next-xpres'');
});
\`\`\`

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/) (if applicable)

`;
  fs.writeFileSync(path.join(process.cwd(), "README.md"), readmeContent);

  execSync("npm install express dotenv mongoose cors", { stdio: "inherit" });

  console.log("Express server setup completed.");
} catch (error) {
  console.error("Error during setup:", error);
}
