import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import Slideshow from './components/Slideshow';
import floralCorner from './assets/floral-corner.png';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigation = (section) => {
    setActiveSection(section);
    // Scroll to the section
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <img 
          src={floralCorner} 
          alt="Floral decoration" 
          className="floral-decoration floral-top-left"
        />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="title">Emily & Alex</h1>
          <p className="subtitle">We're getting married!</p>
          <p className="hashtag">#EAinBloom</p>
          
          <div className="button-container">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium"
              onClick={() => handleNavigation('rsvp')}
            >
              RSVP
            </Button>
            <Button 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium"
              onClick={() => handleNavigation('gifts')}
            >
              Gift Us
            </Button>
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium"
              onClick={() => handleNavigation('photos')}
            >
              Share your Photos
            </Button>
          </div>
        </div>
        
        <img 
          src={floralCorner} 
          alt="Floral decoration" 
          className="floral-decoration floral-bottom-right"
        />
      </section>

      {/* Slideshow Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-center text-primary">Our Story</h2>
          <Slideshow />
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-16 px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-primary">RSVP</h2>
          <p className="mb-8 text-lg">We would be delighted to have you join us on our special day.</p>
          
          <div className="bg-background p-8 rounded-lg shadow-md">
            <p className="mb-4 text-lg">Please fill out the form below to let us know if you can attend.</p>
            <p className="mb-4 text-sm text-muted-foreground">
              This is a placeholder. In the actual implementation, you would connect this to a form handling service.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium">
              Open RSVP Form
            </Button>
          </div>
        </div>
      </section>

      {/* Gift Registry Section */}
      <section id="gifts" className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-primary">Gift Registry</h2>
          <p className="mb-8 text-lg">Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we've registered at the following places:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl mb-4 text-secondary">Amazon Registry</h3>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium">
                View Registry
              </Button>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl mb-4 text-secondary">Honeymoon Fund</h3>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium">
                Contribute
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Sharing Section */}
      <section id="photos" className="py-16 px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-primary">Share Your Photos</h2>
          <p className="mb-8 text-lg">Help us capture every moment of our special day by sharing your photos with us.</p>
          
          <div className="bg-background p-8 rounded-lg shadow-md">
            <p className="mb-4 text-lg">Use our wedding hashtag on social media:</p>
            <p className="hashtag mb-8">#EAinBloom</p>
            <p className="mb-4 text-lg">Or upload directly to our photo sharing platform:</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium">
              Upload Photos
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Emily & Alex's Wedding | #EAinBloom</p>
      </footer>
    </div>
  );
}

export default App;

