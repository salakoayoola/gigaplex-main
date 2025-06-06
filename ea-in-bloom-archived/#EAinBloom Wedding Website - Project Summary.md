# #EAinBloom Wedding Website - Project Summary

## Overview

I've created a simple, elegant wedding website with the #EAinBloom theme that can run on your Raspberry Pi home server. The website features three main buttons as requested:
- RSVP
- Gift Us
- Share your Photos

The design is responsive, lightweight, and optimized for your Raspberry Pi. It uses a multi-stage Docker build to minimize resource usage.

## Key Features

1. **Elegant Floral Design**
   - Soft pink and green color scheme
   - Decorative floral elements
   - Responsive layout that works on all devices
   - Elegant typography with Cormorant Garamond font

2. **Core Functionality**
   - RSVP section for guests to confirm attendance
   - Gift registry section with links to registry and honeymoon fund
   - Photo sharing section with social media hashtag and upload option
   - Slideshow component for displaying wedding photos

3. **Technical Implementation**
   - Built with React and Vite for a modern, fast website
   - Styled with Tailwind CSS for efficient styling
   - Containerized with Docker for easy deployment
   - Served with NGINX for optimal performance
   - Configured to work with your existing Traefik setup

## Files Included

1. **React Application**
   - Complete source code in the `wedding-app` directory
   - Ready to customize with your own content and photos

2. **Docker Configuration**
   - `Dockerfile` for building the application
   - `wedding-docker-compose.yaml` for deploying with Docker Compose

3. **Documentation**
   - `README.md` with detailed instructions
   - This summary document

## Deployment Instructions

1. **Customize the Content**
   - Replace the sample images in `src/assets/` with your own wedding photos
   - Update text in `src/App.jsx` with your wedding details
   - Add more slides to the slideshow in `src/components/Slideshow.jsx`

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f wedding-docker-compose.yaml up -d
   ```

3. **Access Your Website**
   - The website will be available at your root domain as requested
   - The configuration avoids port conflicts with your existing services

## Customization Options

1. **Adding More Photos**
   - Place new photos in the `src/assets/` directory
   - Import them in the Slideshow component
   - Update the slides array with your new images

2. **Changing Colors**
   - Modify the color variables in `src/App.css` to match your wedding theme
   - The current palette uses soft pinks, greens, and gold accents

3. **Connecting Functionality**
   - The buttons are currently placeholders
   - You can connect them to actual services like Google Forms for RSVP
   - Update the links in `src/App.jsx` to point to your registry websites

## Resource Considerations

The application is designed to be lightweight and run efficiently on a Raspberry Pi:
- Minimal JavaScript bundle size
- Optimized images
- Efficient CSS using Tailwind
- Multi-stage Docker build to reduce image size

## Next Steps

1. Review the code and design
2. Customize with your own content and photos
3. Deploy to your Raspberry Pi using the provided Docker Compose file
4. Share your beautiful wedding website with your guests!

If you need any assistance with customization or deployment, please let me know.

