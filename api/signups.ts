import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Helper to require env vars
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Supabase configuration
const supabaseUrl = requiredEnv('SUPABASE_URL');
const supabaseKey = requiredEnv('SUPABASE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

// Email configuration
const emailConfig = {
  user: requiredEnv('EMAIL_USER'),
  password: requiredEnv('EMAIL_PASSWORD'),
  adminEmail: requiredEnv('ADMIN_EMAIL'),
};

// Create email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.password,
  },
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
}

async function sendSignupNotification(signupData: SignupData): Promise<boolean> {
  try {
    // Test connection before sending
    await transporter.verify();
    
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
      to: emailConfig.adminEmail,
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
            <p>View all submissions in your <a href="${supabaseUrl}" style="color: #d1416b;">Supabase dashboard</a>.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { name, email, age, gender, mobile, postcode, photo, category } = req.body;
    let photoUrl: string | null = null;

    // Handle the photo upload using base64 if provided
    if (photo && typeof photo === 'string' && photo.startsWith('data:image')) {
      try {
        const parts = photo.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const base64Data = parts[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `${Date.now()}-${name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('model-photos')
          .upload(fileName, buffer, {
            contentType: mime,
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('model-photos')
          .getPublicUrl(fileName);
        
        photoUrl = urlData.publicUrl;
      } catch (uploadErr) {
        console.error('Photo upload failed:', uploadErr);
        // Continue with submission even if photo upload fails
      }
    }

    // Save to Supabase database
    const submission = {
      name,
      email,
      age,
      mobile,
      postcode,
      photo_url: photoUrl,
      category,
      gender: gender || 'female',
    };

    const { data, error } = await supabase
      .from('signups')
      .insert([submission])
      .select();

    if (error) throw error;

    // Send email notification
    if (data && data.length > 0) {
      await sendSignupNotification({ ...data[0], gender: gender || 'female' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Signup processing failed:', error);
    res.status(500).json({ 
      error: 'Failed to process signup', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}