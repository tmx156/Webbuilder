import { supabase } from '../server/lib/supabase';
import { sendSignupNotification } from '../server/lib/email';

export default async function handler(req, res) {
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
    res.status(500).json({ error: 'Failed to process signup', details: error.message });
  }
} 