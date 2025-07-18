export default async function handler(request, response) {
  // Use the name of the environment variable you set in Vercel
  const GITHUB_TOKEN = process.env.GITHUB_PAT;
  const url = 'https://api.github.com/users/idevanshrai/repos?sort=updated&per_page=30';

  try {
    const githubResponse = await fetch(url, {
      headers: {
        // Use the token to authenticate with the GitHub API
        'Authorization': `token ${GITHUB_TOKEN}`
      }
    });

    if (!githubResponse.ok) {
      // If GitHub API returns an error, forward it
      return response.status(githubResponse.status).json({ error: githubResponse.statusText });
    }

    const data = await githubResponse.json();
    
    // Set caching headers for Vercel to cache the response for 1 hour
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // Send the data back to your website
    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}