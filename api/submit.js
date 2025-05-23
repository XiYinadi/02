// api/submit.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, time } = req.body;

  if (!title || !time) {
    return res.status(400).json({ error: 'Missing title or time' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repoOwner = 'XiYinadi';
  const repoName = '01';

  try {
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body: `时间: ${time}`
      })
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ success: true, issue_url: data.html_url });
    } else {
      res.status(500).json({ error: 'GitHub API Error', detail: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Error', detail: err.message });
  }
}
