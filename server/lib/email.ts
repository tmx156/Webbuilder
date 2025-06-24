import nodemailer from 'nodemailer';
import { emailConfig } from '../config';

// Create a transporter for Gmail
// Note: You'll need to generate an "App Password" for Gmail
// Go to Google Account > Security > 2-Step Verification > App Passwords
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user, // Your Gmail address
    pass: emailConfig.password, // Your Gmail app password
  },
  debug: true, // Enable debug output
  logger: true // Enable logger
});

// Verify the connection configuration
console.log('Email service configured with:', {
  user: emailConfig.user,
  passwordLength: emailConfig.password.length,
  adminEmail: emailConfig.adminEmail
});

interface SignupData {
  name: string;
  email: string;
  age: string;
  gender?: string;
  mobile: string;
  postcode: string;
  photo_url?: string | null;
  category?: string;
  id?: string;
  created_at?: string;
  fb?: string;
  ld?: string;
  parent_mobile?: string;
}

/**
 * Send notification email for new signup
 */
export async function sendSignupNotification(signupData: SignupData): Promise<boolean> {
  console.log('Preparing to send email notification for:', signupData.name);
  
  try {
    // Test connection before sending
    try {
      await transporter.verify();
      console.log('Email connection verified successfully');
    } catch (verifyError) {
      console.error('Email connection verification failed:', verifyError);
      return false;
    }
    
    // Recipient email(s) - can be multiple if needed
    const to = emailConfig.adminEmail;
    
    // Email content
    let subject;
    if (signupData.category === 'landingads') {
      subject = `${signupData.name}--Ad-Ld-${signupData.postcode}-${signupData.age}-${signupData.mobile}-${signupData.email}`;
    } else if (signupData.category === 'ads') {
      subject = `${signupData.name}--Ad-${signupData.postcode}-${signupData.age}-${signupData.mobile}-${signupData.email}`;
    } else if (signupData.category === 'landing') {
      subject = `${signupData.name}--Fb-Ld-${signupData.postcode}-${signupData.age}-${signupData.mobile}-${signupData.email}`;
    } else {
      subject = `${signupData.name}--Fb-${signupData.postcode}-${signupData.age}-${signupData.mobile}-${signupData.email}`;
    }
    const mailOptions = {
      from: `${signupData.name} <${signupData.email}>`,
      replyTo: signupData.email,
      to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #d1416b; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Model Application</h1>
          
          <div style="margin: 20px 0;">
            <h2 style="color: #333;">Applicant Details</h2>
            <p><strong>Name:</strong> ${signupData.name}</p>
            <p><strong>Email:</strong> ${signupData.email}</p>
            <p><strong>Age:</strong> ${signupData.age}</p>
            <p><strong>Gender:</strong> ${(signupData.gender || 'female').charAt(0).toUpperCase() + (signupData.gender || 'female').slice(1)}</p>
            <p><strong>Mobile:</strong> ${signupData.mobile}</p>
            ${signupData.parent_mobile ? `<p><strong>Parent's Mobile:</strong> ${signupData.parent_mobile}</p>` : ''}
            <p><strong>Postcode:</strong> ${signupData.postcode}</p>
            <p><strong>Category:</strong> ${signupData.category || 'Not specified'}</p>
            <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          ${signupData.photo_url ? `
            <div style="margin: 20px 0;">
              <h2 style="color: #333;">Photo</h2>
              <img src="${signupData.photo_url}" alt="Applicant Photo" style="max-width: 100%; max-height: 300px; border-radius: 5px;">
              <p><a href="${signupData.photo_url}" target="_blank">View full size</a></p>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
            <p>This is an automated notification from your modeling agency website.</p>
            <p>View all submissions in your <a href="https://ltgqtqqspkqaviibqnah.supabase.co" style="color: #d1416b;">Supabase dashboard</a>.</p>
          </div>
        </div>
      `,
    };
    
    console.log('Sending email to:', to);
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
} 