import express, { type Application } from 'express';
import path from 'path';

// Serves static frontend files for a single-page app (e.g., React/Vue)
export const serveStatic = (app: Application) => {
  const pathToFrontendBuild = path.resolve(__dirname, '../client/dist');
  app.use(express.static(pathToFrontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(pathToFrontendBuild, 'index.html'));
  });
};
