# 🔑 DETAILED CREDENTIAL ROTATION INSTRUCTIONS

## 🟦 STRIPE CREDENTIAL ROTATION

### **Current Exposed Credential:**
```
Public Key: REDACTED_STRIPE_PUBLIC_KEY
Status: 🔴 COMPROMISED - Visible in git history
```

### **Step-by-Step Rotation Process:**

#### **Step 1: Access Stripe Dashboard**
1. Go to **https://dashboard.stripe.com**
2. Log in with your Stripe account credentials
3. Navigate to **"Developers"** in the left sidebar
4. Click **"API Keys"**

#### **Step 2: Identify Current Keys**
1. You'll see a list of your API keys
2. Look for keys that match the exposed pattern: `pk_live_51QzB52K61Y...`
3. **Important**: You'll see both **Publishable keys** (pk_live_) and **Secret keys** (sk_live_)

#### **Step 3: Create New Keys**
1. Click **"+ Create restricted key"** OR use existing secret key
2. For **Publishable Key**: 
   - This will be automatically generated with your account
   - Copy the new `pk_live_...` key
3. For **Secret Key**:
   - Click "Reveal live key token" on an existing secret key
   - OR create a new restricted key with specific permissions
   - Copy the `sk_live_...` key

#### **Step 4: Update Your Production Environment**
**Where to update (choose your hosting platform):**

**If using Render.com:**
1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Update these variables:
   ```
   VITE_STRIPE_PUBLIC_KEY = [new pk_live_ key]
   STRIPE_SECRET_KEY = [new sk_live_ key]
   ```

**If using Vercel:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update the Stripe variables

**If using Netlify:**
1. Go to Site Settings → Environment Variables
2. Update the Stripe variables

#### **Step 5: Test New Keys**
1. Deploy your site with new keys
2. Try making a test payment
3. Verify payment appears in your Stripe dashboard

#### **Step 6: Disable Old Keys**
1. Back in Stripe dashboard
2. Find the old exposed key (`pk_live_51QzB52K61Y...`)
3. Click the three dots next to it
4. Select **"Delete"** or **"Disable"**
5. Confirm the deletion

---

## 🟨 PAYPAL CREDENTIAL ROTATION

### **Current Exposed Credential:**
```
Client ID: AcChyGp-9gAhHh_AfOYAqfaMTZPzeJgmp6bqOSltURd9xbzX_5AXXW6Qqa_rokgbsL53qBy0sz-Kt9KcwKTmEcUACufNIwZ
Status: 🔴 COMPROMISED - Visible in git history
```

### **Step-by-Step Rotation Process:**

#### **Step 1: Access PayPal Developer Dashboard**
1. Go to **https://developer.paypal.com**
2. Log in with your PayPal business account
3. Click **"My Apps & Credentials"**

#### **Step 2: Locate Your Application**
1. You'll see a list of your applications
2. Look for the app that's currently being used
3. OR look for the Client ID that matches: `AcChyGp-9gAhHh_...`

#### **Step 3: Generate New Credentials**

**Option A: Create New Application (Recommended)**
1. Click **"Create App"**
2. Enter app name (e.g., "Portals of Samadhi Website v2")
3. Select your merchant account
4. Choose **"Checkout"** features
5. Click **"Create App"**
6. Copy the new **Client ID** and **Secret**

**Option B: Regenerate Existing App Credentials**
1. Click on your existing application
2. Look for **"Show"** button next to Secret
3. Click **"Generate new secret"** (if available)
4. Copy the new Client ID and Secret

#### **Step 4: Update Production Environment**
Update these variables in your hosting platform:
```
VITE_PAYPAL_CLIENT_ID = [new Client ID]
PAYPAL_CLIENT_SECRET = [new Secret]
```

#### **Step 5: Test PayPal Integration**
1. Deploy with new credentials
2. Try making a PayPal test payment
3. Verify transaction appears in PayPal dashboard

#### **Step 6: Delete Old Application**
1. Go back to the old application with exposed credentials
2. Click **"Delete App"** 
3. Confirm deletion

---

## 📧 SMTP/EMAIL CREDENTIAL ROTATION

### **Current Exposed Credentials:**
```
App Password: xofw jkau kyvi diff rwiv ectx jzvw
Alternative: rrlfh wypq kdls hyzd
Status: 🔴 COMPROMISED - Visible in git history
```

### **Step-by-Step Rotation Process:**

#### **Step 1: Access Google Account Security**
1. Go to **https://myaccount.google.com**
2. Log in with the Google account used for SMTP
3. Click **"Security"** in the left sidebar
4. Scroll down to **"2-Step Verification"**

#### **Step 2: Navigate to App Passwords**
1. Click **"2-Step Verification"**
2. Scroll down to find **"App passwords"**
3. Click **"App passwords"**
4. You may need to re-enter your password

#### **Step 3: Find and Delete Old Password**
1. You'll see a list of generated app passwords
2. Look for entries like:
   - "Mail"
   - "SMTP"
   - "Email App" 
   - Or any that match your website name
3. Click **"Remove"** next to the old password(s)
4. Confirm deletion

#### **Step 4: Generate New App Password**
1. Click **"Generate"** or **"Create new app password"**
2. Select **"Mail"** from the dropdown
3. Enter a name like "Portals Website SMTP v2"
4. Click **"Generate"**
5. **IMPORTANT**: Copy the 16-character password immediately
   - It will look like: `abcd efgh ijkl mnop`
   - You won't be able to see it again

#### **Step 5: Update Production Environment**
Update these variables in your hosting platform:
```
SMTP_PASS = [new 16-character password]
EMAIL_APP_PASSWORD = [new 16-character password]
```

#### **Step 6: Test Email Functionality**
1. Deploy with new password
2. Test sending an email (contact form, newsletter signup)
3. Verify emails are being sent successfully

---

## 🔐 JWT SECRET ROTATION (BONUS)

### **Current Secret:**
```
JWT_SECRET: 9f3a2b8c7d6e5f4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4
Status: 🔴 POTENTIALLY COMPROMISED
```

### **Step-by-Step Rotation Process:**

#### **Step 1: Generate New Random Secret**
Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This will output something like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

#### **Step 2: Update Production Environment**
```
JWT_SECRET = [new random string from Step 1]
```

#### **Step 3: Important Warning**
⚠️ **All users will need to log in again** after this change because their existing login tokens will become invalid.

---

## 🚀 FINAL VERIFICATION CHECKLIST

After rotating ALL credentials:

### **Test Each Service:**
- [ ] ✅ Stripe payments work with new keys
- [ ] ✅ PayPal payments work with new credentials  
- [ ] ✅ Email sending works with new SMTP password
- [ ] ✅ User authentication works (if using JWT)

### **Verify Old Credentials are Disabled:**
- [ ] ✅ Old Stripe keys deleted from dashboard
- [ ] ✅ Old PayPal app deleted or disabled
- [ ] ✅ Old Google app password removed
- [ ] ✅ Production environment updated with ALL new credentials

### **Ready for Git History Scrub:**
Once ALL the above is complete and tested, you can safely run:
```powershell
.\scripts\scrub-git-history-clean.ps1 -Execute
```

---

## ❓ **Need Help?**

**If you get stuck on any step:**
1. Take a screenshot of where you're stuck
2. Note which step number you're on
3. Ask for specific help with that step

**Common Issues:**
- **Can't find API keys**: Look in different sections (Live vs Test mode)
- **App password not working**: Make sure 2FA is enabled on Google account
- **PayPal app not found**: You might need to create one from scratch

The key is to **take your time** and **test each service** before moving to the next one!