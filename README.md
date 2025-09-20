# MattyChat-chat-chat

Simple real-time chat application

## Description {#description}

MattyChat-chat-chat is a simple SPA and real-time chat application built with [NextJS](https://nextjs.org/) and [Firebase](https://firebase.google.com/). Users can create new rooms, edit room names and delete rooms. Users can log in using Firebase's authentication for more personalization with messages.

## Installation and Setup {#installation}

### Firebase setup {#firebase-setup}

In order to run this application locally, a Firebase account is needed.

1. Navigate to <https://console.firebase.google.com>
2. Create a new Firebase project
3. Once project is created, select **Build** from the menu on the left hand side.
4. From the Build menu, select Realtime Database
5. Create the database

### Environment variables {#environment-variables}

Environment variables from Firebase will be needed to run this application.

Add a `.env` file to the root directory if one is not present already.

1. In the Firebase console, navigate to Project Overview (top left corner) and click the settings icon.
2. From the menu select Project Settings
3. In the `Your apps` section, locate the block for `firebaseConfig`.
4. Use these values to populate the necessary environment variables in a `.env` file.

Example:

```text

NEXT_PUBLIC_FIREBASE_API_KEY=firebaseConfig.apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=firebaseConfig.authDomain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=firebaseConfig.databaseUrl
NEXT_PUBLIC_FIREBASE_PROJECT_ID=firebaseConfig.projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firebaseConfig.storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=firebaseConfig.messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=firebaseConfig.appId
```

### Clone the repository {#clone-repo}

`git clone https://github.com/mattandbucs34/mattychat-nextjs.git`

then

`cd mattychat-nextjs`

### Install packages {#install-packages}

This application uses pnpm. If pnpm is not installed:

`npm install - pnpm`

Once pnpm is installed or if it is already installed:

`pnpm install`

### Run locally {#run-locally}

`pnpm run dev`

then visit <http://localhost:3000> in your browser.

## Key Features {#key-features}

- Real-time messaging
- Chat room creation, editing and deletion
- Firebase authentication

## Tech Stack {#tech-stack}

- NextJS
- Typescript
- Tailwind CSS
- Material UI
- Firebase
