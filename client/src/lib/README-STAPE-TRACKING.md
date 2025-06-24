# Stape Tracking Integration Guide

This document explains how Stape conversion tracking is implemented site-wide and how to add it to new forms.

## Overview

Stape tracking is automatically integrated into all form submissions across the site. It sends conversion events to Meta (Facebook) via the Stape API Gateway for better ad optimization.

## How It Works

1. **Form Submission** → User submits form
2. **API Success** → Form successfully submits to `/api/signups`
3. **Automatic Tracking** → Stape tracking fires automatically
4. **Meta Optimization** → Facebook receives high-quality conversion data

## For Existing Forms

All existing forms already have Stape tracking enabled:
- ✅ `SignupForm` (Hero section)
- ✅ `TestimonialForm` (Modal popup)
- ✅ `SignupFormLanding` (Landing page)
- ✅ `SignupFormBackup` (Backup form)
- ✅ `SignupFormOld` (Legacy form)
- ✅ Newsletter signup (Footer)

## For New Forms

To add Stape tracking to a new form, follow these steps:

### 1. Import the tracking function

```typescript
import { trackModelSignup, trackNewsletterSignup, trackContactForm } from "@/lib/stape-tracking";
```

### 2. Add tracking to your mutation's onSuccess handler

```typescript
const myFormMutation = useMutation({
  mutationFn: async (data) => {
    // Your form submission logic
    const response = await fetch('/api/signups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  onSuccess: async () => {
    // Your existing success logic
    toast({ title: "Success!", description: "Form submitted!" });
    
    // ADD THIS: Stape tracking
    try {
      await trackModelSignup(formData); // For model applications
      // OR await trackNewsletterSignup(email); // For newsletter
      // OR await trackContactForm(formData); // For contact forms
    } catch (error) {
      console.error('Stape tracking failed:', error);
    }
    
    // Rest of your success logic...
  }
});
```

### 3. Form Data Requirements

Your form data should include these fields for optimal tracking:

```typescript
interface TrackableFormData {
  email: string;           // Required
  mobile?: string;         // Optional but recommended
  parentMobile?: string;   // For minors
  name?: string;           // Optional
  category?: string;       // Optional ('fb3', 'newsletter', etc.)
}
```

## Available Tracking Functions

### `trackModelSignup(formData)`
Use for model application forms
- Automatically handles phone number selection (mobile vs parentMobile)
- Sends 'ModelSignup' event to Meta

### `trackNewsletterSignup(email)`
Use for newsletter subscriptions
- Simple email-only tracking
- Sends 'NewsletterSignup' event to Meta

### `trackContactForm(formData)`
Use for contact/inquiry forms
- General purpose form tracking
- Sends 'ContactForm' event to Meta

### `trackFormSubmission(formData, eventName)`
Generic function for custom form types
- Specify your own event name
- Full control over tracking data

## Advanced Usage

### Custom Event Names
```typescript
import { trackFormSubmission } from "@/lib/stape-tracking";

// Custom event name
await trackFormSubmission(formData, 'CustomEventName');
```

### Direct API Access
```typescript
import { sendLeadToStape } from "@/lib/stape-tracking";

// Direct control over all parameters
await sendLeadToStape(
  email, 
  phoneNumber, 
  'MyCustomEvent',
  { custom_field: 'value' }
);
```

### React Hook
```typescript
import { useStapeTracking } from "@/lib/stape-tracking";

function MyComponent() {
  const { trackModelSignup, trackNewsletterSignup } = useStapeTracking();
  
  // Use the functions as needed
}
```

## Technical Details

- **Privacy Compliant**: Email and phone numbers are SHA256 hashed before sending
- **Non-blocking**: Tracking failures won't break user experience
- **Automatic**: No manual configuration needed for standard forms
- **Server-side**: Sends events server-side for better attribution

## Error Handling

Stape tracking is designed to fail gracefully:
- Network issues won't block form submission
- Tracking errors are logged to console
- User experience remains smooth regardless of tracking status

## API Configuration

The Stape API configuration is centralized in `/lib/stape-tracking.ts`:
- Endpoint: `https://capig.stape.at`
- Authorization token is included
- SHA256 hashing for privacy compliance

## Testing

After implementing tracking, verify it works:
1. Submit a test form
2. Check browser console for "✅ Stape tracking successful" message
3. Verify your existing form flow still works normally

---

**Need help?** The tracking system is designed to be plug-and-play. Just import the appropriate function and call it in your `onSuccess` handler! 