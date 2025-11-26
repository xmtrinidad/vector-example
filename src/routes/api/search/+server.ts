import { json } from '@sveltejs/kit';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { PINECONE_API_KEY, OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const POST: RequestHandler = async ({ request }) => {
  const { query } = await request.json();

  
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  const index = pinecone.index('blog-index');
  const searchResults = await index.query({
    vector: embedding.data[0].embedding,
    topK: 2,
    includeMetadata: true
  });

  return json({ matches: searchResults.matches });
};