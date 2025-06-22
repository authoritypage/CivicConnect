import express, { type Application } from 'express'; // Make sure 'Application' is imported here if it's not
import path from 'path'; // Make sure 'path' is imported here if it's not

// ... (keep any other imports or functions in your vite.ts file above this) ...

export const serveStatic = (app: Application) => {
  // This calculates the correct path to your built frontend files.
  // It assumes your frontend code (e.g., React/Vue) is in a 'client' folder
  // and that when it builds, it creates a 'dist' folder *inside* that 'client' folder.
  // Example: your_project_root/client/dist/index.html
  const pathToFrontendBuild = path.resolve(__dirname, '../client/dist');

  // This tells Express to serve all static files (HTML, CSS, JS, images)
  // from that 'dist' folder.
  app.use(express.static(pathToFrontendBuild));

  // This is crucial for Single Page Applications (like React/Vue).
  // It ensures that if the user navigates directly to a path like
  // 'yourdomain.com/some/route', your 'index.html' is served,
  // and then your frontend router takes over.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(pathToFrontendBuild, 'index.html'));
  });
};

// ... (keep any other functions in your vite.ts file below this) ...