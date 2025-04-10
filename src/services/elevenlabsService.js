import axios from 'axios';

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
const BASE_URL = 'https://api.elevenlabs.io/v1';

// Default voice ID - you can change this or make it configurable
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/**
 * Convert text to speech using Eleven Labs API
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - The voice ID to use (optional)
 * @returns {Promise<Blob>} - Audio blob
 */
export const textToSpeech = async (text, voiceId = DEFAULT_VOICE_ID) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY
        },
        responseType: 'blob'
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error with Eleven Labs API:', error);
    throw error;
  }
};

/**
 * Get available voices from Eleven Labs API
 * @returns {Promise<Array>} - List of available voices
 */
export const getVoices = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/voices`,
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY
        }
      }
    );
    
    return response.data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
};
