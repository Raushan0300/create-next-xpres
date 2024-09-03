# create-next-xpres

`create-next-xpres` is a CLI tool that helps you quickly set up a Next.js project integrated with an Express server. It simplifies the process of creating a full-stack JavaScript application by combining Next.js for the frontend, Express for the backend and MongoDB for Database preconfigured, with optional Tailwind CSS for styling.

## Features

- **Automatic Project Setup**: Automatically creates a Next.js app in a `client` folder and an Express server in the root directory.
- **Custom Project Name**: Allows you to specify the project name, or use the current directory if `.` is entered.
- **Tailwind CSS Support**: Optionally includes Tailwind CSS setup during the Next.js project creation.
- **Express Server**: Includes a basic Express server setup with routing, ready for customization.

## Installation

You can install `create-next-xpres` globally to use it as a CLI tool:

```bash
npm install -g create-next-xpres@latest
```

Or use it directly with `npx`:

```bash
npx create-next-xpres@latest
```

## Usage

1. **Run the CLI**: Start by running the CLI command:

   ```bash
   npx create-next-xpres@latest
   ```

2. **Project Name**: Enter the name of your project when prompted. If you don't enter a name, it will default to `next-xpres-app`. If you enter `.`, the files will be created in the current directory.

3. **Tailwind CSS**: Choose whether to include Tailwind CSS during the Next.js app setup.

4. **Project Structure**: The tool will create a project with the following structure:

   ```plaintext
   your-project-name/
   ├── client/            # Next.js app
   ├── index.js           # Express server
   ├── connection.js      # MongoDB Connection with Mongoose
   ├── package.json       # Root package.json with Express dependencies
   ├── tailwind.config.js # Tailwind configuration (if Tailwind CSS is selected)
   └── postcss.config.js  # PostCSS configuration (if Tailwind CSS is selected)
   ```

5. **Start the Project**: After setup, navigate to the project folder and start the development server:

   ```bash
   cd your-project-name
   npm run dev      # Starts the Next.js development server with express using nodemon
   npm start        # Starts the Next.js production server with express
   ```

## Example

```bash
$ npx create-next-xpres
? Enter the name of your project: my-app
? Do you want to use Tailwind CSS? Yes
Running: npx create-next-app@latest client --tailwind
...
Express server setup completed.
```

## Scripts

The `package.json` includes the following scripts:

- **`npm start`**: Starts the Next.js development server Express server.
- **`npm run dev`**: Starts the Next.js development server with Express server.

## License

MIT License

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Author

Raushan Kumar

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
