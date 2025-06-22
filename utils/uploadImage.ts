import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import 'react-native-url-polyfill/auto';

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 */
export async function uploadImageToSupabase(uri: string): Promise<string | null> {
  try {
    const fileExt = uri.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const fileData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

    const { error } = await supabase.storage
      .from('avatars') // name of your Supabase bucket
      .upload(filePath, decode(fileData), {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data?.publicUrl ?? null;
  } catch (err) {
    console.error('uploadImageToSupabase error:', err);
    return null;
  }
}
