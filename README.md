## pictureGPT

This is a [Next.js](https://nextjs.org/) project that's preconfigured to work with Replicate's API, and also it's an image gallery site using [Cloudinary](https://cloudinary.com/) and [Tailwind CSS](https://tailwindcss.com/).

## Visit App

You can visit deployed app on Vercel. Click [here](https://picture-5h2hpemxr-kibidabi.vercel.app/)

## Noteworthy files

- [pages/index.js](pages/index.js) - The React frontend that renders the Home page in the browser
- [pages/api/predictions/index.js](pages/api/predictions/index.js) - The backend API endpoint that calls Replicate's API to create a prediction
- [pages/api/predictions/[id].js](pages/api/predictions/[id].js) - The backend API endpoint that calls Replicate's API to get the prediction result
- [pages/image_gallery/index.js](pages/image_gallery/index.js) - This file is a Next.js page component responsible for rendering the photos from Cloudinary
- [pages/photo/[photoId].js](pages/photo/[photoId].js) - This is a dynamic route that displays a specific photo based on the [photoId] query parameter from the URL

## Usage

Install dependencies:

```console
npm install
```

Add your [Replicate API token](https://replicate.com/account#token) to `.env.local`:

```
REPLICATE_API_TOKEN=<your-token-here>
```

Run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

<img width="707" alt="iguana" src="https://github.com/replicate/getting-started-nextjs/assets/14149230/5d1933ec-a083-4de6-90e2-7552e33e4a85">
