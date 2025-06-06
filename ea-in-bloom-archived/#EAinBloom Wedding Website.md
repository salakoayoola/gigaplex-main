# #EAinBloom Wedding Website

A simple, elegant wedding website built with React and designed to run on a Raspberry Pi home server using Docker and NGINX.

## Features

- Responsive design that works on all devices
- Three main sections: RSVP, Gift Registry, and Photo Sharing
- Slideshow component for displaying wedding photos
- Elegant floral theme with #EAinBloom branding
- Lightweight and optimized for Raspberry Pi

## Deployment Instructions

### Prerequisites

- Docker and Docker Compose installed on your Raspberry Pi
- A domain name with DNS configured to point to your server
- Traefik reverse proxy already set up (as seen in your existing configuration)

### Steps to Deploy

1. Clone this repository to your Raspberry Pi:
   ```bash
   git clone <repository-url> wedding-app
   cd wedding-app
   ```

2. Customize the website:
   - Replace images in `src/assets/` with your own photos
   - Update text in `src/App.jsx` with your own wedding details
   - Modify colors in `src/App.css` if desired

3. Build and deploy using Docker Compose:
   ```bash
   cd ..
   docker-compose -f wedding-docker-compose.yaml up -d
   ```

4. Access your wedding website at your domain name.

## Avoiding Conflicts with Existing Services

This setup is designed to work alongside your existing services without conflicts:

1. **Custom Environment Variables**: Uses `WEDDING_NGINX_PORT` instead of `NGINX_PORT` to avoid environment variable conflicts.

2. **Custom NGINX Configuration**: Includes a dedicated `nginx.conf` with:
   - Custom log file paths (`wedding_access.log` and `wedding_error.log`)
   - Optimized settings for a single-page application
   - Proper caching for static assets

3. **Container Isolation**: Each container has its own isolated network namespace.

4. **Traefik Routing**: Traffic is routed based on domain names, not ports:
   - Your existing service uses `mickey21.${DOMAIN}`
   - The wedding website uses the root domain `${DOMAIN}`

5. **No Direct Port Mapping**: The docker-compose file doesn't map any ports directly to the host.

## Customizing the Slideshow

To add your own photos to the slideshow:

1. Add your images to the `src/assets/` directory
2. Import them in `src/components/Slideshow.jsx`
3. Update the `slides` array with your new images:

```jsx
const slides = [
  {
    id: 1,
    src: photo1,
    alt: 'Description 1'
  },
  {
    id: 2,
    src: photo2,
    alt: 'Description 2'
  },
  // Add more photos as needed
];
```

## Connecting Form Functionality

The RSVP, Gift Registry, and Photo Sharing buttons are currently placeholders. To connect them to actual functionality:

1. For RSVP: Connect to a form service like Google Forms, Typeform, or a custom backend
2. For Gift Registry: Link to your actual registry websites
3. For Photo Sharing: Set up a photo upload service or link to a shared album

## Technical Details

- Built with React and Vite
- Styled with Tailwind CSS
- Containerized with Docker
- Served with NGINX
- Exposed through Traefik reverse proxy

## Resource Usage

This application is designed to be lightweight and run efficiently on a Raspberry Pi:
- Minimal JavaScript bundle size
- Optimized images
- Efficient CSS using Tailwind's JIT compiler
- Multi-stage Docker build to reduce image size

