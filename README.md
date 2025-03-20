# SignRaise

SignRaise is an AI-powered accessibility platform designed to bridge communication gaps between deaf and hearing communities. Our solution offers:

- **Real-time sign language translation during video calls**
- **Live camera translation for on-the-go interactions**
- **AI-driven transcription of uploaded audio/video content**

With a modern UI and robust backend APIs powered by advanced AI models and third-party services, SignRaise makes everyday communication more inclusive and accessible for everyone.

## Technologies Used

### Frontend
- **Nuxt.js:** Building a dynamic, responsive web application.
- **Tailwind CSS:** Rapid UI development with a custom design using our purple-heart color palette.
- **Web Speech API:** Utilizes `window.SpeechRecognition || window.webkitSpeechRecognition` for native speech recognition.
- **EmailJS:** Handling the Contact Us page and sending emails directly from the frontend.

### Backend
- **Express.js:** Building RESTful API endpoints.
- **Prisma:** Database modeling and querying.
- **bcryptjs & jsonwebtoken:** Secure password hashing and authentication.
- **dotenv:** Environment variable management.
- **cors & cookie-parser:** Handling cross-origin requests and cookies.
- **swagger-jsdoc & swagger-ui-express:** Generating API documentation.
- **multer:** Handling file uploads.
- **nodeMailer:** Email notification functionalities.
- **Deepgram SDK:** Advanced speech-to-text transcription powered by Deepgram.
- **NodeMediaServer:** Managing real-time media streaming.
- **Daily API:** For real-time video room management.

## Setup

### Clone the Repository

```bash
git clone https://github.com/youssef-elmelegy/Sign-raise.git
cd signraise
```

The repository is structured into two main folders:
- **Backend:** Contains all the server-side code.
- **Front:** Contains the Nuxt.js frontend code.

### Install Dependencies

#### Backend

```bash
cd Backend
npm install
```

#### Frontend

```bash
cd ../front
npm install
```

### Environment Variables

#### Frontend Environment Variables

Create a `.env` file in the **Front** folder and add the following:

```env
VITE_APP_BASE_URL="https://sign-raise.vercel.app/"
NUXT_EMAIL_SERVICE_ID=""
NUXT_EMAIL_PUBLIC_KEY=""
NUXT_EMAIL_TEMPLATE_ID=""
```

#### Backend Environment Variables

Create a `.env` file in the **Backend** folder and add the following:

```env
DATABASE_URL=""
JWT_SECRET=""
JWT_REFRESH_SECRET=""

EMAIL_USER=""
EMAIL_PASS=""

CLIENT_URL="http://localhost:3001"
CLIENT_URL2="https://sign-raisefront.vercel.app"
CLIENT_URL3="http://localhost:3000"

DAILY_API_KEY=""
DAILY_API_URL=""

DEEPGRAM_API_KEY=""
```

These variables are used to configure database connections, authentication secrets, email services, client URLs, and third-party API keys.

### Run the Application

#### Backend

```bash
npm start
```

#### Frontend

```bash
npm run dev
```

## API Documentation

When the backend server is running, API documentation is available at:
```
http://localhost:3000/api-docs
```
Documentation is generated using Swagger.

## Endpoints

### Authentication
- **POST** `/api/auth/signup` – Register a new user.
- **POST** `/api/auth/login` – Log in a user.
- **POST** `/api/auth/logout` – Log out a user.
- **POST** `/api/auth/forgot-password` – Request a password reset.
- **POST** `/api/auth/reset-password/:token` – Reset password using a token.
- **POST** `/api/auth/change-password` – Change password (requires authentication).
- **POST** `/api/auth/verify-email` – Verify email using a code.
- **POST** `/api/auth/resend-verification-email` – Resend verification email.
- **GET** `/api/auth/check-auth` – Check if the user is authenticated (requires authentication).

### Transcription
- **POST** `/api/transcribe` – Transcribe uploaded audio/video files using the Deepgram SDK.

### Media / Daily Rooms
- **POST** `/api/daily/create-room` – Create a new video room.
- **GET** `/api/daily/my-rooms` – Retrieve the user’s video rooms.
- **GET** `/api/daily/room/:name` – Get details of a room by name.
- **POST** `/api/daily/room-token` – Generate a token for room access.

## Middleware

- `verifyToken` – Middleware to verify JWT tokens for protected routes.

## Deployment

SignRaise is already deployed. For further deployment details, please refer to the deployment configuration files and documentation provided in the repository.

## Contact

For support or inquiries, please email us at **signraise@gmail.com**.  
For the Contact Us page, we use EmailJS to handle user messages directly from the frontend.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
