# Cloudinary Setup Guide

## ✅ **Current Status**
- **Cloud Name**: `duvz1ugov` ✅ (configured)
- **Upload Preset**: `portfolio_uploads` ⚠️ (needs to be created)

## 🚀 **Quick Setup Steps**

### 1. **Access Your Cloudinary Dashboard**
Go to: [https://cloudinary.com/console](https://cloudinary.com/console)

### 2. **Create Upload Preset**
1. In your dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**

### 3. **Configure Upload Preset**
**Basic Settings:**
- **Preset name**: `portfolio_uploads`
- **Signing mode**: `Unsigned` (important for client uploads)
- **Folder**: `portfolio`

**Optional Settings:**
- **Max file size**: `10000000` (10MB)
- **Allowed formats**: `jpg,png,jpeg,webp`
- **Auto backup**: `true` (recommended)

### 4. **Save the Preset**
Click **Save** to create the upload preset.

## 🎯 **What This Enables**

Once the upload preset is created:
- ✅ **Real image uploads** to Cloudinary
- ✅ **Permanent image URLs** (no more blob URLs)
- ✅ **Automatic optimization** and CDN delivery
- ✅ **Images organized** in `portfolio/` folder
- ✅ **Secure uploads** with preset restrictions

## 🔧 **Current Configuration**

Your `.env.local` file now contains:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=duvz1ugov
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
```

## 🧪 **Testing the Integration**

After creating the upload preset:

1. **Go to**: `http://localhost:3000/admin/uploads`
2. **Login** with admin credentials
3. **Upload an image** in the form
4. **Check**: Image should upload to Cloudinary (not blob URL)
5. **Verify**: Image appears in your Cloudinary Media Library

## ⚠️ **Troubleshooting**

### Error: "Upload preset not found"
- Make sure you created the preset named exactly `portfolio_uploads`
- Ensure signing mode is set to `Unsigned`

### Error: "Upload failed"
- Check your internet connection
- Verify cloud name is correct: `duvz1ugov`
- Make sure the preset is saved and active

### Images not appearing
- Check Cloudinary Media Library
- Look in the `portfolio/` folder
- Verify the upload was successful in browser network tab

## 📁 **File Organization**

Images will be organized in Cloudinary as:
```
portfolio/
├── 1640995200000_image1.jpg
├── 1640995201000_image2.png
└── 1640995202000_image3.webp
```

## 🔄 **Migration from Demo Mode**

The system has been updated from demo mode:

### Before (Demo)
- Blob URLs: `blob:http://localhost:3000/...`
- Temporary storage
- Lost on page refresh

### After (Real Cloudinary)
- CDN URLs: `https://res.cloudinary.com/duvz1ugov/...`
- Permanent storage
- Global CDN delivery

## 🎉 **Ready to Go!**

Once you create the upload preset, your portfolio will have:
- **Permanent image storage**
- **Fast CDN delivery**
- **Automatic optimization**
- **Professional image URLs**

**Next step**: Create the upload preset in your Cloudinary dashboard!
