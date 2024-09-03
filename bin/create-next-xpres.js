#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

// Step 1: Prompt the user for the project name and whether to use Tailwind CSS
inquirer
  .prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the name of your project:",
      default: "next-xpres-app",
    },
    {
      type: "confirm",
      name: "useTailwind",
      message: "Do you want to use Tailwind CSS?",
      default: false,
    },
  ])
  .then((answers) => {
    let { projectName, useTailwind } = answers;

    // Step 2: Handle project directory based on user input
    let projectPath = process.cwd();

    if (projectName !== ".") {
      projectPath = path.join(process.cwd(), projectName);
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
      }
      process.chdir(projectPath); // Change directory to the new project folder
    }

    // Step 3: Run npx create-next-app with the provided project name
    const createNextAppCommand = useTailwind
      ? `npx create-next-app@latest client --tailwind`
      : `npx create-next-app@latest client`;

    try {
      console.log("Running:", createNextAppCommand);
      execSync(createNextAppCommand, { stdio: "inherit" });

      // Step 4: Create index.js in the root folder with Express server setup
      const indexJsContent = `
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const next = require('next');

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev, dir:'./client'});
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
  res.send('Hello from Express!\nBuilt with 'create-next-xpres'');
});

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`;

      fs.writeFileSync(
        path.join(process.cwd(), "index.js"),
        indexJsContent.trim()
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
      const packageJsonContent = {
        name: projectName !== "." ? projectName : path.basename(process.cwd()),
        version: "1.0.0",
        main: "index.js",
        scripts: {
          start: "cd client && npm run build && cd .. && node index.js",
          dev: `nodemon index.js`,
        },
        dependencies: {
          express: "^4.18.2",
          cors: "^2.8.5",
          dotenv: "^16.4.5",
          mongoose: "^8.5.3",
          next: "^14.2.7",
        },
        devDependencies: {
          autoprefixer: "^10.4.20",
          postcss: "^8.4.41",
          tailwindcss: "^3.4.10",
        },
      };

      fs.writeFileSync(
        path.join(process.cwd(), "package.json"),
        JSON.stringify(packageJsonContent, null, 2)
      );

      const tailwindConfigContent = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

`;

      const envContent = `
MONGO_URI=mongodb://localhost:27017/${projectName}
NODE_ENV=development
`;

      fs.writeFileSync(path.join(process.cwd(), ".env"), envContent.trim());

      const gitignoreContent = `
node_modules
.env
`;

      fs.writeFileSync(path.join(process.cwd(), ".gitignore"), gitignoreContent);

      // Step 6: If Tailwind CSS is selected, initialize Tailwind and PostCSS in root
      if (useTailwind) {
        console.log("Initializing Tailwind CSS and PostCSS in root...");
        execSync("npm install tailwindcss postcss autoprefixer", {
          stdio: "inherit",
        });
        execSync("npx tailwindcss init -p", { stdio: "inherit" });

        fs.writeFileSync(
          path.join(process.cwd(), "tailwind.config.js"),
          tailwindConfigContent.trim()
        );

        console.log("Tailwind CSS and PostCSS initialized in the root folder.");
      }
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
      
      execSync("npm install", { stdio: "inherit" });

      console.log("Express server setup completed.");
    } catch (error) {
      console.error("Error during setup:", error);
    }
  })
  .catch((error) => {
    console.error("Error during prompt:", error);
  });
