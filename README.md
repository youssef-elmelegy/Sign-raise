# SignRaise

SignRaise is an AI-powered accessibility platform designed to bridge communication gaps between deaf and hearing communities. Our solution offers:
- **Real-time sign language translation** during video calls.
- **Live camera translation** for on-the-go interactions.
- **AI-driven transcription** of uploaded audio/video content.

With an engaging, modern UI and robust backend APIs powered by advanced AI models, SignRaise makes everyday communication more inclusive and accessible for everyone.

## Technologies Used

- JavaScript
- Express.js
- Prisma
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- cookie-parser
- swagger-jsdoc
- swagger-ui-express

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/youssef-elmelegy/Sign-raise.git
    cd Sign-raise
    ``` 

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    CLIENT_URL=http://localhost:3000
    DATABASE_URL=your-database-url
    JWT_SECRET=your-jwt-secret
    ```

4. Run the application:
    ```sh
    npm start
    ```

## API Documentation

API documentation is available at `/api-docs` when the server is running. It is generated using Swagger.

## Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/logout` - Log out a user
- `POST /api/auth/forgot-password` - Request a password reset
- `POST /api/auth/reset-password/:token` - Reset password using a token
- `POST /api/auth/change-password` - Change password (requires authentication)
- `POST /api/auth/verify-email` - Verify email using a code
- `POST /api/auth/resend-verification-email` - Resend verification email
- `GET /api/auth/check-auth` - Check if the user is authenticated (requires authentication)

## Middleware

- `verifyToken` - Middleware to verify JWT tokens

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please contact:
- Name: DINAMOW
- Email: meemoo102039@gmail.com
- URL: [http://127.0.0.1:3000/](http://127.0.0.1:3000/)
