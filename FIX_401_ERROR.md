# 🚨 Google OAuth 401 Error Fix

## **The Problem:**
You're getting "Error 401: invalid_client" and "no registered origin" because your Google Cloud Console project doesn't recognize `http://localhost:3000` as an authorized origin.

## **🔧 Quick Fix Steps:**

### **Step 1: Go to Google Cloud Console**
1. **Open**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Sign in** with your Google account
3. **Select your project**: "Alumverse-SRM" (or whatever you named it)

### **Step 2: Update OAuth 2.0 Client ID**
1. **Go to**: "APIs & Services" → "Credentials"
2. **Find your OAuth 2.0 Client ID**: `916167801744-fl2gc6cpeu9tsreh2n3tha6bqbc0uij7`
3. **Click the edit icon** (pencil) next to your Client ID

### **Step 3: Add Authorized Origins**
In the "Authorized JavaScript origins" section, make sure you have:
```
http://localhost:3000
```

**Important Notes:**
- ✅ **No trailing slash** - Use `http://localhost:3000` not `http://localhost:3000/`
- ✅ **Exact match** - Must be exactly `http://localhost:3000`
- ✅ **Case sensitive** - Use lowercase `http` not `HTTP`

### **Step 4: Add Authorized Redirect URIs**
In the "Authorized redirect URIs" section, add:
```
http://localhost:3000
```

### **Step 5: Save Changes**
1. **Click "Save"** at the bottom
2. **Wait 1-2 minutes** for changes to propagate

### **Step 6: Test Again**
1. **Refresh your browser** at http://localhost:3000
2. **Try Google Sign-In again**
3. **Should work now!**

## **🚨 If You Still Get Errors:**

### **Error: "This app isn't verified"**
1. **Go to**: "APIs & Services" → "OAuth consent screen"
2. **Add your email** to "Test users" section
3. **Save changes**

### **Error: "redirect_uri_mismatch"**
- **Check**: Both "Authorized JavaScript origins" AND "Authorized redirect URIs" have `http://localhost:3000`
- **Make sure**: No extra spaces or characters

### **Error: "Invalid client_id"**
- **Check**: Your Client ID is correct: `916167801744-fl2gc6cpeu9tsreh2n3tha6bqbc0uij7.apps.googleusercontent.com`
- **Verify**: It matches exactly in both HTML and JavaScript files

## **🔍 Debug Steps:**

### **Check Your Current Configuration:**
1. **Open**: [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. **Click**: Your OAuth 2.0 Client ID
3. **Verify**: 
   - ✅ Authorized JavaScript origins: `http://localhost:3000`
   - ✅ Authorized redirect URIs: `http://localhost:3000`
   - ✅ Client ID: `916167801744-fl2gc6cpeu9tsreh2n3tha6bqbc0uij7.apps.googleusercontent.com`

### **Check Browser Console (F12):**
- Look for any error messages
- Check if Google API loaded: `console.log(google)`

## **⚡ Alternative: Create New Client ID**

If the above doesn't work, create a fresh OAuth 2.0 Client ID:

1. **Go to**: "APIs & Services" → "Credentials"
2. **Click**: "Create Credentials" → "OAuth 2.0 Client ID"
3. **Application type**: "Web application"
4. **Name**: "Alumverse Web Client v2"
5. **Authorized JavaScript origins**: `http://localhost:3000`
6. **Authorized redirect URIs**: `http://localhost:3000`
7. **Click**: "Create"
8. **Copy the new Client ID** and update your code

## **📱 Test Your Fix:**

1. **Refresh browser** at http://localhost:3000
2. **Select a role** (Student, Alumni, Faculty, Committee)
3. **Click "Sign in with Google"**
4. **Should see Google account selection**
5. **Choose your account**
6. **Grant permissions**
7. **Successfully logged in!** 🎉

## **💡 Pro Tips:**

- **Changes take 1-2 minutes** to propagate
- **Test with different browsers** to ensure it works
- **Check Google Cloud Console** for request logs
- **Use exact URLs** - no trailing slashes or extra spaces

## **🎯 What You Need:**

1. **Google Cloud Console access** ✅
2. **Your project selected** ✅
3. **OAuth 2.0 Client ID configured** ✅
4. **Authorized origins set** ⚠️ (This is what needs fixing)
5. **Test the sign-in** ⚠️ (After fixing origins)

---

**The 401 error means Google doesn't recognize your localhost as authorized. Once you add `http://localhost:3000` to your authorized origins, it will work perfectly!** 🚀
