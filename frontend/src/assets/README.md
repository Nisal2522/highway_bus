# Assets Folder

## Bus Image Setup

To add your bus image to the login page:

1. **Add your bus image**: Place your `bus.jpg` file in this folder
2. **Image requirements**: 
   - Format: JPG/JPEG
   - Name: `bus.jpg`
   - Recommended size: At least 800x600 pixels
   - Quality: High resolution for best display

## File Structure
```
src/assets/
├── bus.jpg          # Your bus image (add this file)
└── README.md        # This file
```

## How it works
- The login page will automatically import and display your bus image
- The image will cover the full left side of the screen
- On mobile devices, the image will appear at the top
- The image uses `object-fit: cover` for optimal display

## Troubleshooting
If the image doesn't appear:
1. Make sure the file is named exactly `bus.jpg`
2. Check that the file is in the correct location: `src/assets/bus.jpg`
3. Restart the development server after adding the image
