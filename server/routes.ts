import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSignupSchema } from "@shared/schema";
import { z } from "zod";
import express from 'express';
import { supabase } from './lib/supabase';
import { sendSignupNotification } from './lib/email';
import { Buffer } from 'buffer';

interface SignupRequestBody {
  name: string;
  email: string;
  age: string;
  gender?: string;
  mobile: string;
  postcode: string;
  photo?: string;
  category?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for model signups
  app.post("/api/signups", async (req: express.Request<{}, {}, SignupRequestBody>, res: express.Response) => {
    try {
      console.log('Received signup form submission');
      const { name, email, age, gender, mobile, postcode, photo, category } = req.body;
      console.log('Form data received:', { name, email, age, gender, mobile, postcode, category, hasPhoto: !!photo });
      
      // Handle the photo upload using base64 if provided
      let photoUrl = null;
      if (photo && typeof photo === 'string' && photo.startsWith('data:image')) {
        try {
          console.log('Processing photo upload...');
          // Parse the base64 string
          const parts = photo.split(',');
          const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
          const base64Data = parts[1];
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Generate a unique filename
          const fileName = `${Date.now()}-${name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
          
          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('model-photos')
            .upload(fileName, buffer, {
              contentType: mime,
              upsert: false
            });
          
          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
          }
          
          // Get the public URL for the image
          const { data: urlData } = supabase.storage
            .from('model-photos')
            .getPublicUrl(fileName);
          
          photoUrl = urlData.publicUrl;
          console.log('Photo uploaded successfully:', photoUrl);
        } catch (uploadErr) {
          console.error('Failed to process photo:', uploadErr);
          // Continue with submission even if photo upload fails
        }
      }
      
      // Save to Supabase database
      console.log('Saving submission to database...');
      
      // Create a submission object without gender first
      const submission = {
        name,
        email,
        age,
        mobile,
        postcode,
        photo_url: photoUrl,
        category,
        gender: gender || 'female'
      };
      
        const { data, error } = await supabase
          .from('signups')
          .insert([submission])
          .select();
        
        if (error) {
          console.error('Database error:', error);
          throw error;
        }
        
        console.log('Signup saved successfully to database');
        
        // Send email notification
        console.log('Preparing to send email notification...');
        if (data && data.length > 0) {
          try {
            console.log('Calling email service...');
          const emailSent = await sendSignupNotification({ ...data[0], gender: gender || 'female' });
            if (emailSent) {
              console.log('Email notification sent successfully');
            } else {
              console.warn('Failed to send email notification - service returned false');
            }
          } catch (emailError) {
            console.error('Error in email notification process:', emailError);
            // Continue even if email fails
          }
        } else {
          console.warn('No data returned from database insert, skipping email notification');
        }
        
        res.json({ success: true, data });
    } catch (error: unknown) {
      console.error('Signup process error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ 
        error: 'Failed to process signup', 
        details: errorMessage 
      });
    }
  });

  // API route to get all signups (for admin purposes)
  app.get("/api/signups", async (req, res) => {
    try {
      const signups = await storage.getSignups();
      res.json({ success: true, signups });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch signups" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
