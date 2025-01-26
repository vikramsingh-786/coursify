# 🍳LMS Project

## Description

this is a lms project, that i have build while learning full stack development with my mentor. in this project i have build from scratch lots of feature like authentication, user management, course management, lecture management, lecture dashboard & admin dashboard and more...

![LMS](https://res.cloudinary.com/dksmrp2im/image/upload/w_200,h_200,c_limit,e_blur:400,o_90,b_black/l_text:arial_80:®,ar_1:1,c_lfill,o_60,co_rgb:ffffff,b_rgb:000000,r_max/v1737873560/learning-management-system/Screenshot_2025-01-26_115003_n9rflv.png)

## Project Structure

The project follows a well-organized structure:

```
LMS-Project/
├── backend/
│   ├── config/
│   │   ├── db.config.js
│   │   ├── cloudinary.js
│   │   ├── cronJob.js
│   │   ├── debug.js
│   │   ├── razorpay.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── Course.controller.js
│   │   ├── payment.controller.js
│   │   ├── miscellaneous.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── roleCheck.middleware.js
│   │   ├── multer.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.model.js
│   │   ├── Payment.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── Course.routes.js
│   │   ├── payment.routes.js
│   │   ├── miscellaneous.routes.js
│   ├── uploads/
│   ├── utils/
│   │   ├── error.utils.js
│   │   ├── sendEmail.js
│   ├── app.js
│   ├── .env.example.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assests/
│   │   ├── components/
│   │   ├── helpers/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── Redux/ 
│   │   ├── App.jsx/
│   │   ├── index.css/
│   │   ├── main.jsx/
│   │   ├── ...
│   ├── .env.example.js
│   ├── vite.config
│   ├── vercel.json
│   ├── postcss.config
│   ├── tailwind.config
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── ...
└──
```


## Features

- 💡 **User Authentication**: Sign up, log in, change password, and reset password via email.
- 🙋 **User Profile**: Edit profile details, view profile information.
- 📚 **Course Management**: Admin can create, edit, and delete courses.
- 📝 **Lecture Management**: Admin can add, edit, and delete lectures within courses.
- 🔒 **Subscription**: Users can enroll in courses by purchasing a 1-year subscription.
- 🎥 **Lecture Dashboard**: Display course lectures, play videos, and view lecture descriptions.

## API Endpoints

### User Routes

- `POST /register`: Register a new user.
- `POST /login`: Log in a user.
- `GET /logout`: Log out a user.
- `GET /me`: Getting user profile info.
- `POST /reset`: Sending email on user for reset password.
- `POST /reset/:resetToken`: User resetting the password.
- `POST /change-password`: User can change password using old and new password.
- `POST /update/:id`: User can update their profile.

### Course Routes

- `GET /courses`: Get all courses.
- `POST /courses`: Create a new course (Admin only).
- `GET /courses/:id`: Get lectures for a specific course.
- `PUT /courses/:id`: Update course details (Admin only).
- `DELETE /courses/:id`: Delete a course (Admin only).

### Payment Routes

- `GET /razorpay-key`: Get Razorpay API key.
- `POST /subscribe`: Buy a subscription.
- `POST /verify`: Verify a subscription.
- `POST /unsubscribe`: Cancel a subscription.
- ...

### Miscellaneous Routes

- `POST /contact`: Contact us.
- `GET /admin/stats/users`: Get user statistics (Admin only).

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Cors
- bcrypt
- Crypto
- Jsonwebtoken
- Dotenv
- Cookie-Parser
- Multer
- Cloudinary
- Nodemailer
- Razorpay

### Frontend

- **React :** `for creating ui`
- **Tailwind & CSS :** `for styling the element`
- **DaisyUi :** `for creating beautiful drawer`
- **React-Icons :** `for icons` 
- **React-Router :** `for make the different pages`
- **React-Slick :** `for create slider` 
- **React-hot-toast :** `for showing small small toast`
- **React-Redux :** `for use redux with react`
- **Redux Toolkit :** `for managing state in global app`
- **Chart.js :** `for showing chart for admin`
- **React-Chartjs-2 :** for showing chart for admin`

---

## Getting Started

Follow these steps to set up the project on your local machine:

1. Clone the repository:
   ```
   git clone https://github.com/gulshan07dev/lms-mern-project.git
   cd LMS
   ```

2. Set up the backend:
   - Navigate to the `backend` folder.
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js` file.
   - Start the backend server: `npm start`

3. Set up the frontend:
   - Navigate to the client folder: `cd client`
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js` file.
   - Start the client development server: `npm run dev`

4. Access the application:
   - Open your browser and visit: `http://localhost:5173`

---

_Made with ❤️ by [Vikram Singh](linkedin.com/in/vikram-singh-508b08250/)_
