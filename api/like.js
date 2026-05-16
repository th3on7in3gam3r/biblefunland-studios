export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Post ID is required' });

    const SANITY_PROJECT_ID = 'lrxq2sck';
    const SANITY_DATASET = 'production';
    
    // We will use the environment variable to keep the token safe
    const SANITY_TOKEN = process.env.SANITY_API_TOKEN;

    if (!SANITY_TOKEN) {
        return res.status(500).json({ error: 'Server missing Sanity token' });
    }

    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${SANITY_DATASET}`;

    try {
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SANITY_TOKEN}`
            },
            body: JSON.stringify({
                mutations: [
                    {
                        patch: {
                            id: id,
                            setIfMissing: { likes: 0 },
                            inc: { likes: 1 }
                        }
                    }
                ]
            })
        });

        if (!result.ok) {
            const err = await result.json();
            throw new Error(err.error?.description || 'Sanity mutation failed');
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
