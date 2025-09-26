# Google API Setup Guide for PackageBooking Slideshow

## Overview
The PackageBooking slideshow now uses Google API to fetch relevant destination images dynamically. **The slideshow works immediately with curated high-quality images even without API keys!** This guide will help you set up the necessary API keys for dynamic image fetching.

## Option 1: Unsplash API (Recommended - Free)

### Step 1: Get Unsplash API Key
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key

### Step 2: Set Environment Variable
Create a `.env` file in your frontend directory:
```
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

## Option 2: Google Custom Search API

### Step 1: Get Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Custom Search API"
4. Create credentials (API Key)

### Step 2: Create Custom Search Engine
1. Go to [Google Custom Search](https://cse.google.com/cse/)
2. Create a new search engine
3. Copy the Search Engine ID

### Step 3: Set Environment Variables
Create a `.env` file in your frontend directory:
```
REACT_APP_GOOGLE_PLACES_API_KEY=your_google_api_key_here
REACT_APP_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

## Option 3: Google Places API

### Step 1: Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the "Places API"
3. Create credentials (API Key)

### Step 2: Set Environment Variable
```
REACT_APP_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

## 🎉 **Demo Mode (Works Immediately!)**

**No API setup required!** The slideshow comes with curated high-quality images for all destinations:

- ✅ **Jaffna**: Jaffna Fort, Nallur Temple, Public Library, Casuarina Beach, Point Pedro Lighthouse
- ✅ **Galle**: Galle Fort, Lighthouse, Dutch Church, Maritime Museum, Unawatuna Beach  
- ✅ **Ella**: Ella Rock, Nine Arch Bridge, Little Adam's Peak, Ravana Falls, Spice Garden
- ✅ **Kandy**: Temple of the Tooth, Kandy Lake, Botanical Gardens, Cultural Show, Forest
- ✅ **Colombo**: Gangaramaya Temple, Independence Hall, Galle Face Green, National Museum, Red Mosque

## Features

### Dynamic Destination Detection
The slideshow automatically detects the destination from the trip title and shows relevant places:

- **Jaffna**: Jaffna Fort, Nallur Temple, Public Library, Casuarina Beach, Point Pedro Lighthouse
- **Galle**: Galle Fort, Lighthouse, Dutch Church, Maritime Museum, Unawatuna Beach
- **Ella**: Ella Rock, Nine Arch Bridge, Little Adam's Peak, Ravana Falls, Spice Garden
- **Kandy**: Temple of the Tooth, Kandy Lake, Botanical Gardens, Cultural Show, Forest
- **Colombo**: Gangaramaya Temple, Independence Hall, Galle Face Green, National Museum, Red Mosque

### Fallback System
- **Demo Mode**: Uses curated high-quality images (works immediately)
- **API Mode**: Fetches fresh images from Unsplash/Google APIs
- **Fallback**: If API fails, automatically uses curated images
- **Error Handling**: If image fails to load, shows default fallback image
- **Loading States**: Loading spinner while fetching images

### Auto-Refresh
- Images are fetched when trip data changes
- Supports multiple destinations
- Responsive design for all screen sizes

## Usage

### 🚀 **Immediate Usage (Demo Mode)**
1. **No setup required!** The slideshow works immediately with curated images
2. Just run your React app and the slideshow will display beautiful destination images
3. Perfect for development and testing

### 🔧 **API Mode (Optional)**
1. Set up your preferred API (Unsplash recommended for free usage)
2. Add the environment variables to `.env` file
3. Restart your React development server
4. The slideshow will automatically fetch fresh images from the API

## Troubleshooting
- Make sure your API key is correct
- Check browser console for any API errors
- Ensure your API has proper permissions/quota
- Fallback images will be used if API fails
