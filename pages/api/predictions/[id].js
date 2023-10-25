import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // Set CORS headers to allow requests from your Vercel app's domain
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://picture-n82lktztf-kibidabi.vercel.app"
  );

  const prediction = await replicate.predictions.get(req.query.id);

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.end(JSON.stringify(prediction));
}
