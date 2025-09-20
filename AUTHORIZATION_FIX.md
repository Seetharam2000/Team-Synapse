# 🚨 Authorization Error Fix - Step by Step

## **Current Error:**
"Access blocked: Authorization Error"

This means Google is blocking your app because it's not properly configured in Google Cloud Console.

## **🔧 IMMEDIATE FIX STEPS:**

### **Step 1: Open Google Cloud Console**
1. **Click here**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Sign in** with your Google account
3. **Select project**: "Alumverse-SRM" (or create one if needed)

### **Step 2: Configure OAuth Consent Screen**
1. **Go to**: "APIs & Services" → "OAuth consent screen"
2. **If not configured**:
   - Choose "External" → "Create"
   - App name: `Alumverse SRM`
   - User support email: `seetharam.hariharan@gmail.com`
   - Developer contact: `seetharam.hariharan@gmail.com`
   - Click "Save and Continue"
3. **Add scopes**: `email`, `profile`, `openid`
4. **Add test users**: `seetharam.hariharan@gmail.com`
5. **Click "Save and Continue"**

### **Step 3: Update OAuth 2.0 Client ID**
1. **Go to**: "APIs & Services" → "Credentials"
2. **Find your Client ID**: `916167801744-fl2gc6cpeu9tsreh2n3tha6bqbc0uij7`
3. **Click the edit icon** (pencil)
4. **Add to "Authorized JavaScript origins"**:
   ```
   http://localhost:3000
   ```
5. **Add to "Authorized redirect URIs"**:
   ```
   http://localhost:3000
   ```
6. **Click "Save"**

### **Step 4: Enable Required APIs**
1. **Go to**: "APIs & Services" → "Library"
2. **Search for**: "Google+ API" or "Google Identity"
3. **Click "Enable"**

### **Step 5: Wait and Test**
1. **Wait 2-3 minutes** for changes to propagate
2. **Refresh your browser** at http://localhost:3000
3. **Try Google Sign-In again**

## **🚨 If Still Blocked:**

### **Option A: Use Test Mode**
1. **Go to**: "APIs & Services" → "OAuth consent screen"
2. **Change Publishing status** to "Testing"
3. **Add your email** to "Test users"
4. **Save changes**

### **Option B: Bypass Verification**
When you see "This app isn't verified":
1. **Click "Advanced"**
2. **Click "Go to Alumverse SRM (unsafe)"**
3. **Continue with sign-in**

## **🔍 Quick Check:**

### **Verify Your Configuration:**
- ✅ **OAuth consent screen**: Configured with your email
- ✅ **Test users**: Your email added
- ✅ **Authorized origins**: `http://localhost:3000`
- ✅ **Authorized redirect URIs**: `http://localhost:3000`
- ✅ **APIs enabled**: Google+ API or Google Identity

## **⚡ Alternative: Create Fresh Project**

If the above doesn't work, create a new project:

1. **Create new project**: "Alumverse-SRM-New"
2. **Enable Google+ API**
3. **Configure OAuth consent screen**
4. **Create new OAuth 2.0 Client ID**
5. **Update your code** with new Client ID

## **📱 Test Steps:**

1. **Refresh browser** at http://localhost:3000
2. **Select a role** (Student, Alumni, Faculty, Committee)
3. **Click "Sign in with Google"**
4. **Should see Google account selection**
5. **Choose your account**
6. **Grant permissions**
7. **Successfully logged in!**

---

**The authorization error is usually caused by missing OAuth consent screen configuration or unauthorized origins. Follow the steps above to fix it!** 🚀
