# Deployment Guide - SmartSync Backend

Follow these steps to deploy your Node.js backend to the cloud.

## Recommended: [Render](https://render.com/) (Easiest & Free)

### 1. Push to GitHub
As a first step, you need to create a **private repository** on GitHub and push your `SmartSync-Backend` folder there.
- Make sure `.gitignore` is present so `.env` is NOT pushed.

### 2. Create a Web Service on Render
- Log in to [Render.com](https://render.com/).
- Click **New +** and select **Web Service**.
- Connect your GitHub repository.

### 3. Configure Build & Start Commands
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 4. Set Environment Variables
Wait! Before the first deploy finishes, go to the **Environment** tab on Render and add the variables from your local `.env` file:
- `PORT`: `5000` (Render will override this, but good to have)
- `MONGO_URI`: `your_actual_mongodb_uri`
- `JWT_SECRET`: `a_very_strong_secret_key`
- `NODE_ENV`: `production`

### 5. Access Your Live API
Once deployed, Render will providing you with a URL (e.g., `https://smartsync-backend.onrender.com`).
- Add `/health` to the end of the URL to verify it's working!

---

## Alternative: [Railway.app](https://railway.app/)
1. Create a New Project.
2. Select "Deploy from GitHub repo".
3. Add your variables in the "Variables" tab.

> [!IMPORTANT]
> After deployment, update your React Native app's API configuration to point to this new live URL instead of `localhost`.
