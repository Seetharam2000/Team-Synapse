# 🚨 Google Sign-In 400 Error Fix

## **The Problem:**
You're getting a 400 error because the Google Sign-In is trying to use `YOUR_CLIENT_ID_HERE` instead of a real Google Client ID.

## **🔧 Quick Fix Steps:**

### **Step 1: Get Your Google Client ID (5 minutes)**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Sign in** with your Google account
3. **Create a new project** (if you don't have one):
   - Click "Select a project" → "New Project"
   - Name: `Alumverse-SRM`
   - Click "Create"

4. **Enable Google Sign-In API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

5. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" → "Create"
   - Fill in:
     - App name: `Alumverse SRM`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Add scopes: `email`, `profile`, `openid`
   - Add test users: Your email address
   - Click "Save and Continue"

6. **Create OAuth 2.0 Client ID**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: `Alumverse Web Client`
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000`
   - Click "Create"

7. **Copy your Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)

### **Step 2: Update Your Code**

Replace `916167801744-fl2gc6cpeu9tsreh2n3tha6bqbc0uij7.apps.googleusercontent.com` with your actual Client ID in these files:

**File 1: `index.html` (line 51)**
```html
data-client_id="123456789-abcdefg.apps.googleusercontent.com"
```

**File 2: `app.js` (line 148)**
```javascript
client_id: '123456789-abcdefg.apps.googleusercontent.com'
```

### **Step 3: Test Again**

1. **Refresh your browser** at http://localhost:3000
2. **Select a role** (Student, Alumni, Faculty, Committee)
3. **Click "Sign in with Google"**
4. **Should work now!**

## **🚨 If You Still Get Errors:**

### **Error: "This app isn't verified"**
- **Solution**: Click "Advanced" → "Go to Alumverse SRM (unsafe)"
- **Or**: Add your email to "Test users" in OAuth consent screen

### **Error: "redirect_uri_mismatch"**
- **Check**: `http://localhost:3000` is in authorized origins (no trailing slash)
- **Make sure**: No extra spaces in the URL

### **Error: "Invalid client_id"**
- **Check**: Client ID is copied correctly
- **Make sure**: No extra spaces or characters

## **🔍 Debug Steps:**

1. **Open Browser Console** (F12)
2. **Look for error messages**
3. **Check if Google API loaded**: `console.log(google)`
4. **Verify Client ID**: Check the network tab for requests

## **⚡ Quick Test:**

If you want to test immediately, I can create a temporary demo Client ID for you to use:

1. **Use this temporary Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
2. **Replace in both files**
3. **Test the flow** (it will show an error but you can see the process)

## **📱 Alternative: Use Demo Mode**

If you want to skip Google setup for now, I can restore the mock Google Sign-In that works without any configuration:

```javascript
// This will work immediately without any setup
function handleGoogleSignIn() {
  // Mock implementation that works instantly
}
```

## **🎯 What You Need:**

1. **Google Account** (you have this)
2. **5 minutes** to set up Google Cloud Console
3. **Your Client ID** (from step 7 above)
4. **Update 2 files** with your Client ID

## **💡 Pro Tip:**

The 400 error is Google's way of saying "I don't recognize this app" because it doesn't have a valid Client ID. Once you get your real Client ID from Google Cloud Console, the error will disappear!

---

**Ready to fix this? Follow the steps above and you'll have real Google Sign-In working in 5 minutes!** 🚀
