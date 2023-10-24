import Head from "next/head";
import { useRouter } from "next/router";
import getResults from "../../utils/cachedPhotos";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import cloudinary from "../../utils/cloudinary";
import Carousel from "../../components/Carousel";

const Photos = (currentPhoto) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  return (
    <>
      <Head>
        <title>pictureGPT</title>
        <meta property="og:image" content={currentPhoto} />
        <meta name="twitter:image" content={currentPhoto} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Photos;

export async function getStaticProps(context) {
  const results = await getResults();

  let reducedResults = [];
  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const currentPhoto = reducedResults.find((photo) => {
    photo.id === Number(context.params.photoId);
  });

  if (!currentPhoto) {
    // Handle the case when the photo with the specified id is not found
    return {
      notFound: true,
    };
  }

  currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);

  return {
    props: {
      currentPhoto: currentPhoto,
    },
  };
}

export async function getStaticPaths() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  let fullPaths = [];
  for (let i = 0; i < results.resources.length; i++) {
    fullPaths.push({ params: { photoId: i.toString() } });
  }

  return {
    paths: fullPaths,
    fallback: false,
  };
}
