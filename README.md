# adapi-admin-dashboard
ADapi internal system administration dashboard web application

## Getting Started

The `.env.local.template` file should be copied to a local `.env.local` file. Secret environment variable values need to be filled in locally. Any non-secret environment variables can be added to the `.env` file, which is tracked in source control.

For VS Code configuration, the `launch.json.template` file under `.vscode` should be copied to your local `launch.json`.

## Available Scripts

In the project driectory, you can run:

### `npm start`

This runs the local development server and launches the app at [http://localhost:3000](http://localhost:3000). To debug in VS Code, press F5 to run with the "Chrome" launch configuration.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
