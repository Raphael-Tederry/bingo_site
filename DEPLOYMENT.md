# 🚀 Railway Deployment Guide

This guide will walk you through deploying the Bingo Site on Railway.com.

## 📋 Pre-Deployment Checklist

✅ **Completed** - The following changes have been applied:
- Backend CORS updated to use `ALLOWED_ORIGINS` environment variable
- Backend `Procfile` and `railway.json` created
- Frontend `.env.production` template created

## 🚀 Deployment Steps

### Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Deploy Backend on Railway

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Log in with your account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub (if not already done)
   - Select your `bingo_site` repository

3. **Configure Backend Service**
   - Railway will detect your project
   - Click "Add Service" → "GitHub Repo"
   - **Important Settings:**
     - **Name**: `bingo-backend`
     - **Root Directory**: `backend`
     - **Start Command**: `   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables for Backend**
   - Go to your backend service → "Variables" tab
   - Add these variables:
     ```
     PORT=8000
     ALLOWED_ORIGINS=http://localhost:3000
     PYTHONUNBUFFERED=1
     ```
   - (You'll update ALLOWED_ORIGINS after deploying frontend)

5. **Add Volume for Data Persistence** ⚠️ IMPORTANT!
   - Go to backend service → "Volumes" tab
   - Click "New Volume"
   - **Mount Path**: `/app/data`
   - **Name**: `bingo-data`
   - This ensures your `comments.json` file persists across deployments

6. **Deploy Backend**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - ✅ **Copy the backend URL** (e.g., `https://bingo-backend-production.railway.app`)

### Step 3: Deploy Frontend on Railway

1. **Add Another Service**
   - In the same Railway project, click "New Service"
   - Select "GitHub Repo" again (same repository)
   - Configure:
     - **Name**: `bingo-frontend`
     - **Root Directory**: `frontend`

2. **Set Environment Variables for Frontend**
   - Go to frontend service → "Variables" tab
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     PORT=3000
     NODE_ENV=production
     ```
   - ⚠️ Replace `your-backend-url.railway.app` with the actual backend URL from Step 2.6

3. **Deploy Frontend**
   - Click "Deploy"
   - Wait for build to complete (3-7 minutes)
   - ✅ **Copy the frontend URL** once deployed

### Step 4: Update Backend CORS Settings

1. **Go Back to Backend Service**
   - Navigate to backend service → "Variables"
   - Update `ALLOWED_ORIGINS` to:
     ```
     ALLOWED_ORIGINS=https://your-frontend-url.railway.app,http://localhost:3000
     ```
   - Replace with your actual frontend URL
   - Keep `http://localhost:3000` for local development

2. **Redeploy Backend**
   - Backend will automatically redeploy with new environment variables
   - Or manually trigger redeploy from the "Deployments" tab

### Step 5: Test Your Deployment ✅

1. **Visit Your Frontend URL**
   - Open `https://your-frontend-url.railway.app`
   - The app should load with the default bingo board

2. **Test Core Features**
   - ✅ Generate a new bingo board
   - ✅ Try different board sizes
   - ✅ Test custom values
   - ✅ Try different profiles
   - ✅ Submit a comment (tests backend and data persistence)

3. **Check Logs (if issues occur)**
   - In Railway dashboard, click each service
   - Go to "Logs" tab to see any errors

## 🔧 Common Issues & Solutions

### ❌ CORS Errors
**Symptoms**: Frontend can't reach backend, console shows CORS errors

**Solution**: 
- Verify `ALLOWED_ORIGINS` in backend includes your frontend URL
- Format: `https://frontend.railway.app,http://localhost:3000` (comma-separated, no spaces)

### ❌ Comments Not Saving
**Symptoms**: Comments disappear after backend redeploys

**Solution**: 
- Ensure you added the volume mount to `/app/data` in backend service
- Go to backend service → Volumes → Add volume with mount path `/app/data`

### ❌ Profile Files Not Found
**Symptoms**: "Profile not found" errors

**Solution**: 
- Make sure `profiles/` folder is in your git repository
- Check that `profiles/` contains `.txt` files
- Verify files are committed: `git ls-files profiles/`

### ❌ Backend Won't Start
**Symptoms**: Backend service shows "crashed" or "error" status

**Solution**: 
- Check logs in Railway dashboard
- Verify `requirements.txt` is in backend folder
- Ensure start command: `   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- Check that Python version is compatible (3.8+)

### ❌ Frontend Build Fails
**Symptoms**: Frontend deployment fails during build

**Solution**: 
- Check logs for specific error
- Verify `package.json` is in frontend folder
- Ensure `NEXT_PUBLIC_API_URL` is set in environment variables
- Try building locally: `cd frontend && npm run build`

### ❌ Frontend Shows "API Connection Error"
**Symptoms**: Frontend loads but can't fetch data

**Solution**:
- Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly
- Check backend is running (visit backend URL in browser, should show JSON response)
- Verify CORS is configured properly in backend
- Check backend logs for errors

## 💰 Railway Free Tier Information

Railway free tier includes:
- **$5 credit per month** (usually enough for small projects)
- **~500 hours of runtime** (sufficient for 2 small services)
- **Automatic sleep** after inactivity (wakes on first request)
- **No credit card required** for free tier

Your bingo site should fit comfortably within these limits!

## 🎨 Optional: Custom Domain

1. **In Frontend Service**
   - Go to "Settings" → "Domains"
   - Click "Generate Domain" for a free `.railway.app` subdomain
   - Or add your own custom domain

2. **Update Environment Variables**
   - Update `ALLOWED_ORIGINS` in backend with the new domain

## 📝 Environment Variables Reference

### Backend Variables
```
PORT=8000                                    # Port for backend server
ALLOWED_ORIGINS=https://frontend.railway.app # Comma-separated list of allowed origins
PYTHONUNBUFFERED=1                           # Ensure Python logs appear in Railway
```

### Frontend Variables
```
NEXT_PUBLIC_API_URL=https://backend.railway.app  # Backend API URL
PORT=3000                                         # Port for frontend server (optional)
NODE_ENV=production                               # Environment mode
```

## 🔄 Updating Your Deployment

When you push changes to GitHub:
1. Railway automatically detects the push
2. Services rebuild and redeploy automatically
3. No manual intervention needed!

To trigger manual redeploy:
- Go to service → "Deployments" → Click "Redeploy"

## 📊 Monitoring

- **View Logs**: Service → "Logs" tab
- **View Metrics**: Service → "Metrics" tab
- **View Deployments**: Service → "Deployments" tab

## 🆘 Need Help?

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check logs in Railway dashboard for specific errors

---

**Your deployment is ready! 🎉**

Make sure to test all features after deployment and update the URLs in the environment variables.
