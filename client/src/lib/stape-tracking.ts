// Facebook Pixel Integration for Stape CAPIG
// This uses your existing Facebook Pixel (3984186828576131) + CAPIG setup
// CAPIG automatically converts browser pixel events to Conversions API

// SHA256 hashing function for privacy-compliant tracking
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Interface for form data that can be tracked
export interface TrackableFormData {
  email: string;
  mobile?: string;
  parentMobile?: string;
  name?: string;
  category?: string;
  [key: string]: any;
}

// Track model signup via Facebook Pixel (automatically goes to CAPIG)
export async function trackModelSignup(formData: TrackableFormData): Promise<void> {
  try {
    console.log('📤 Tracking Model Signup via Facebook Pixel:', {
      email: formData.email.substring(0, 3) + '***',
      category: formData.category
    });

    // Check if Facebook Pixel is loaded
    if (typeof window.fbq !== 'function') {
      console.warn('⚠️ Facebook Pixel not loaded');
      return;
    }

    // Track Lead event with Facebook Pixel
    window.fbq('track', 'Lead', {
      content_category: formData.category || 'Model Application',
      content_name: 'Model Signup Form',
      value: 2, // £2 lead value
      currency: 'GBP'
    });

    // Track custom event for model signup
    window.fbq('trackCustom', 'ModelSignup', {
      signup_method: 'website_form',
      category: formData.category || 'unknown',
      has_phone: !!formData.mobile
    });

    console.log('✅ Facebook Pixel events fired successfully');

  } catch (error) {
    console.error('❌ Facebook Pixel tracking error:', error);
  }
}

// Track newsletter signup via Facebook Pixel
export async function trackNewsletterSignup(email: string): Promise<void> {
  try {
    console.log('📤 Tracking Newsletter Signup via Facebook Pixel:', {
      email: email.substring(0, 3) + '***'
    });

    if (typeof window.fbq !== 'function') {
      console.warn('⚠️ Facebook Pixel not loaded');
      return;
    }

    // Track Subscribe event
    window.fbq('track', 'Subscribe', {
      content_name: 'Newsletter Signup',
      value: 1, // £1 newsletter value
      currency: 'GBP'
    });

    console.log('✅ Newsletter tracking successful');

  } catch (error) {
    console.error('❌ Newsletter tracking error:', error);
  }
}

// Track contact form submission via Facebook Pixel
export async function trackContactForm(formData: any): Promise<void> {
  try {
    console.log('📤 Tracking Contact Form via Facebook Pixel');

    if (typeof window.fbq !== 'function') {
      console.warn('⚠️ Facebook Pixel not loaded');
      return;
    }

    window.fbq('track', 'Contact', {
      content_name: 'Contact Form',
      content_category: 'inquiry'
    });

    console.log('✅ Contact form tracking successful');

  } catch (error) {
    console.error('❌ Contact form tracking error:', error);
  }
}

// Test function to verify Facebook Pixel is working
export function testStapeConnection(): void {
  console.log('🧪 Testing Facebook Pixel + CAPIG Connection...');
  
  if (typeof window.fbq !== 'function') {
    console.error('❌ Facebook Pixel not loaded!');
    console.log('💡 Make sure your page has the Facebook Pixel code');
    return;
  }

  console.log('✅ Facebook Pixel is loaded');
  console.log('📊 Your setup:');
  console.log('  - Facebook Pixel ID: 3984186828576131');
  console.log('  - CAPIG Domain: capig.stape.at (or capig.levelonetalent.co.uk)');
  console.log('  - Tracking Method: Browser Pixel → CAPIG → Facebook Conversions API');
  
  // Fire a test event
  window.fbq('trackCustom', 'StapeTest', {
    test: true,
    timestamp: new Date().toISOString()
  });
  
  console.log('🔥 Test event fired! Check Facebook Events Manager in 1-2 minutes');
}

// Hook for React components to easily add tracking
export function useStapeTracking() {
  return {
    trackModelSignup,
    trackNewsletterSignup,
    trackContactForm,
    testStapeConnection
  };
} 