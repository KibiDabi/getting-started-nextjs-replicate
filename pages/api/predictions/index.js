import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }
  // Log the incoming request body
  console.log("Incoming Request Body:", req.body);

  const prediction = await replicate.predictions.create({
    // Pinned to a specific version of Stable Diffusion
    // See https://replicate.com/stability-ai/sdxl
    version: "1bfb924045802467cf8869d96b231a12e6aa994abfe37e337c63a4e49a8c6c41",

    // This is the text prompt that will be submitted by a form on the frontend
    input: { prompt: req.body.prompt },
  });

  if (prediction?.error) {
    // Log the prediction error
    console.log("Prediction Error:", prediction.error);

    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  // Log the prediction
  console.log("Prediction:", prediction);

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
