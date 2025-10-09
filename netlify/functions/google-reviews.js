// Netlify Function for Google Reviews
// This function fetches reviews from Google Places API server-side to avoid CORS issues

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get parameters from query string
    const { placeId, apiKey, language = 'en' } = event.queryStringParameters || {};

    // Validate required parameters
    if (!placeId || !apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          message: 'placeId and apiKey are required'
        })
      };
    }

    // Build Google Places API URL
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&language=${language}&key=${apiKey}`;

    // Fetch from Google Places API
    console.log('Fetching reviews from Google Places API...');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}`);
    }

    const data = await response.json();

    // Check if Google API returned an error
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Google API Error',
          status: data.status,
          message: data.error_message || 'Unknown error from Google API'
        })
      };
    }

    // Return the reviews data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        data: data.result || {},
        reviews: data.result?.reviews || []
      })
    };

  } catch (error) {
    console.error('Error fetching Google reviews:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

