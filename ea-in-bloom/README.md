# #EAInBloom Wedding Website

A beautiful, static wedding website with a sunflower theme, featuring a slideshow and black & white background image, designed for Emma & Alexander's special day.

## 🌻 Features

- **Responsive Design**: Beautiful on all devices (mobile, tablet, desktop)
- **Sunflower Theme**: Color palette inspired by sunflowers (green, yellow, brown)
- **Image Slideshow**: Elegant photo slideshow with navigation and auto-advance
- **Background Image**: Full-screen black & white background image
- **Image Protection**: Multiple layers of protection against image downloading
- **Modern Aesthetics**: Clean typography, generous white space, elegant animations
- **Performance Optimized**: Fast loading, optimized for Raspberry Pi hosting
- **Docker Ready**: Easy deployment with nginx and Docker

## 📁 Project Structure

```
wedding-site/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Custom CSS styles
├── js/
│   └── script.js          # Interactive features & slideshow
├── images/
│   ├── .gitkeep          # Photo placement instructions
│   ├── background.jpg    # Black & white background image
│   ├── slide1.jpg        # Slideshow image 1
│   ├── slide2.jpg        # Slideshow image 2
│   └── slide3.jpg        # Slideshow image 3
├── docker/
│   └── nginx.conf        # Nginx configuration
├── docker-compose.yml     # Docker compose setup
└── README.md             # This file
```

## 🚀 Quick Start

### Local Development

1. **Clone or download** the project files
2. **Add your wedding photos**:
   - **background.jpg**: Black & white background image (1920x1080+ recommended)
   - **slide1.jpg, slide2.jpg, slide3.jpg**: Slideshow images (1200x800+ recommended)

3. **Open locally**:
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

### Docker Deployment (Raspberry Pi)

1. **Prepare your Raspberry Pi**:
   ```bash
   # Install Docker and Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   sudo apt-get install docker-compose
   ```

2. **Deploy the website**:
   ```bash
   # Navigate to your project directory
   cd /path/to/wedding-site
   
   # Start the website
   docker-compose up -d
   ```

3. **Access your website**:
   - Local: `http://localhost`
   - Network: `http://YOUR_PI_IP_ADDRESS`

### Production Setup

1. **Custom Domain** (Optional):
   - Update `docker-compose.yml` with your domain
   - Configure DNS to point to your Raspberry Pi
   - Set up SSL certificates if needed

2. **Customize Content**:
   - Edit `index.html` to update names, date, and message
   - Update the three button links (RSVP, Gift Us, Share Photos)
   - Customize colors in `css/styles.css` if needed

## 🎨 Customization

### Colors
The website uses a sunflower-inspired palette:
- **Dark Green**: `#2D5016`, `#3A6B1F` (stems/leaves)
- **Yellow**: `#FFD700`, `#FFC107` (petals)  
- **Brown**: `#8D4004`, `#A0522D` (center)

### Typography
- **Headers**: Playfair Display (elegant serif)
- **Body**: Inter (modern sans-serif)

### Slideshow Features
- Auto-advance every 5 seconds
- Navigation arrows for manual control
- Dot indicators showing current slide
- Smooth fade transitions
- Touch-friendly on mobile devices

### Image Protection
- Right-click context menu disabled
- Drag and drop prevention
- Text selection disabled on images
- Developer tools access restricted
- Save keyboard shortcuts blocked
- CSS pointer-events manipulation

## 📱 Mobile Optimization

- Fully responsive design
- Touch-friendly slideshow navigation
- Optimized button sizes for mobile
- Performance optimizations for mobile devices
- Accessibility features included

## 🔧 Technical Details

### Performance
- Gzip compression enabled
- Static asset caching (1 year for images/CSS/JS)
- Optimized image loading with error handling
- Minimal external dependencies
- Lazy loading considerations

### Security
- Security headers configured
- Hidden file access blocked
- Content Security Policy enabled
- XSS protection enabled
- Image download protection

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Reduced motion support for accessibility
- High contrast mode support

## 📝 Updating Content

### Wedding Details
Edit these sections in `index.html`:
- **Names**: Line 89 (`Emma & Alexander`)
- **Date**: Line 94 (`June 15th, 2024`)
- **Message**: Line 97-99
- **Hashtag**: Line 84 (`#EAInBloom`)

### Button Links
Update the `href` attributes in lines 106, 114, and 122:
```html
<a href="YOUR_RSVP_LINK" class="wedding-btn wedding-btn-primary">
<a href="YOUR_GIFT_LINK" class="wedding-btn wedding-btn-secondary">
<a href="YOUR_PHOTOS_LINK" class="wedding-btn wedding-btn-accent">
```

## 🌻 Adding Your Photos

### Background Image
1. **Prepare your image**:
   - Convert to black and white or grayscale
   - High resolution landscape format (1920x1080 or higher)
   - Under 2MB file size for fast loading
   - Save as `background.jpg`

2. **Place the file**:
   - Save in the `images/` folder
   - Must be named exactly `background.jpg`

### Slideshow Images
1. **Prepare your images**:
   - 16:9 or 4:3 aspect ratio recommended
   - 1200x800 pixels minimum resolution
   - Under 1MB each for optimal loading
   - High contrast works best

2. **Place the files**:
   - Save as `slide1.jpg`, `slide2.jpg`, `slide3.jpg` in the `images/` folder
   - The slideshow will automatically use them
   - Placeholders will show if images are missing

### Image Protection Features
- Multiple layers of protection prevent easy downloading
- Right-click, drag-drop, and keyboard shortcuts disabled
- Developer tools access restricted
- CSS-based protection methods

## 🆘 Troubleshooting

### Website not loading?
- Check Docker is running: `docker ps`
- Restart the container: `docker-compose restart`
- Check nginx logs: `docker logs ea-in-bloom-wedding`

### Images not showing?
- Verify files are named exactly: `background.jpg`, `slide1.jpg`, etc.
- Check file permissions: `chmod 644 images/*.jpg`
- Ensure file sizes are under 5MB each
- Test image files can be opened normally

### Slideshow not working?
- Check JavaScript console for errors
- Verify all three slide images are present
- Test on different browsers
- Ensure JavaScript is enabled

### Slow loading?
- Optimize/compress your images
- Check your network connection
- Verify Raspberry Pi has adequate resources
- Consider reducing image file sizes

## 💡 Tips

- **Testing**: Always test on mobile devices before going live
- **Backup**: Keep a backup of your customized files
- **Updates**: Images can be updated anytime by replacing the files
- **Monitoring**: Check Docker container health regularly
- **Performance**: Monitor loading times and optimize images as needed

## 🔒 Image Protection Notes

While the implemented protection measures deter casual users from downloading images, determined users with technical knowledge can still access them. For maximum protection, consider:

- Watermarking your images
- Using lower resolution images
- Implementing server-side protection
- Using a professional photo sharing service for sensitive images

## 📞 Support

For technical issues:
1. Check the troubleshooting section above
2. Verify all files are in the correct locations
3. Test locally before deploying to Raspberry Pi
4. Check browser console for JavaScript errors

---

*Designed with 💛 for Emma & Alexander's special day*