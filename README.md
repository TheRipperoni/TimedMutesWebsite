# Timed Mutes Website

A React-based web application for managing timed mutes and word mutes on the AT Protocol (Bluesky).

## Overview

Timed Mutes Website allows users to authenticate via OAuth and manage their mutes with expiration times. It also includes features for Ozone swarm integration and repository exporting.

## Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Material UI (MUI)](https://mui.com/)
- **AT Protocol**: [@atproto/api](https://github.com/bluesky-social/atproto), [@atproto/oauth-client-browser](https://github.com/bluesky-social/atproto)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Package Manager**: [Yarn](https://yarnpkg.com/) (v1.22.22)

## Requirements

- [Node.js](https://nodejs.org/) (version compatible with Vite/React 18)
- [Yarn](https://yarnpkg.com/)

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd TimedMutesWebsite
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file in the root directory and populate it with the required variables (see [Environment Variables](#environment-variables) section).

## Available Scripts

In the project directory, you can run:

- `yarn dev`: Runs the app in development mode with HMR.
- `yarn build`: Compiles TypeScript and builds the app for production to the `dist` folder.
- `yarn lint`: Runs ESLint to check for code quality issues.
- `yarn preview`: Locally previews the production build.

## Environment Variables

The following environment variables are used by the application:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_HOST` | Backend API host for mute management | `https://mutes.ripperoni.com/api` |
| `VITE_API_OZONE_HOST` | API host for Ozone integration | `https://ozoneswarm.ripperoni.com/api` |
| `VITE_BASE_PATH` | Base path for the React Router | `/ui` |
| `VITE_OAUTH_CLIENT_ID` | OAuth Client ID or metadata URL | `mutes.ripperoni.com` |
| `VITE_OAUTH_REDIRECT_URI` | OAuth redirect URI | `https://mutes.ripperoni.com/ui/oauth/callback` |
| `VITE_OAUTH_SCOPE` | Requested OAuth scopes | `atproto transition:generic` |

## Project Structure

```text
├── public/              # Static assets and metadata (e.g., client-metadata.json)
├── src/
│   ├── assets/          # Images and other static assets
│   ├── components/      # Reusable React components (Sidebar, Buttons, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── locales/         # Translation files (i18n)
│   ├── pages/           # Page-level components (OzoneSwarm)
│   ├── App.tsx          # Main App component and routing
│   ├── agent.ts         # AT Protocol agent and OAuth configuration
│   ├── i18n.ts          # Internationalization setup
│   ├── main.tsx         # Application entry point
│   ├── theme.tsx        # MUI theme configuration
│   └── ...              # Other logic and VO (Value Object) files
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Deployment

This project can be deployed in several ways:

### Docker

You can build a Docker image and run it on your server.

1. **Build the image**:
   ```bash
   docker build \
     --build-arg VITE_API_HOST=https://mutes.ripperoni.com/api \
     --build-arg VITE_BASE_PATH=/ui \
     -t timed-mutes-website .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 8080:80 timed-mutes-website
   ```
   The app will be available at `http://localhost:8080/ui`.

### GitHub Actions

A CI/CD workflow is provided in `.github/workflows/deploy.yml`. It automatically builds the project on every push to `main` or `master`.

To enable automatic deployment:
1. Go to your GitHub repository settings.
2. Add the following secrets:
   - `VITE_API_HOST`: Your backend API host.
   - `SSH_PRIVATE_KEY`: Private key to access your server.
   - `SSH_HOST`: Your server's IP or domain.
   - `SSH_USER`: The username for the server.
   - `REMOTE_DIR`: The path on the server where the files should be uploaded.
3. Uncomment the "Deploy to Server" step in `.github/workflows/deploy.yml`.

### Manual Deployment

1. **Build the project**:
   ```bash
   yarn build
   ```
2. **Copy the `dist` folder** to your web server (e.g., Nginx, Apache).
   Ensure your server is configured to serve the files from the base path (default is `/ui`) and redirects all requests to `index.html` for React Router compatibility.

## Tests

TODO: Add testing framework and write tests. Currently, there are no automated tests configured in this repository.

## License

TODO: Add license information (e.g., MIT, Apache-2.0). No LICENSE file found in root.
