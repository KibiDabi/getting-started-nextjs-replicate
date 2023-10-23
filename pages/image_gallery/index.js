import Image from "next/image";
import cloudinary from "../../utils/cloudinary";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "../../components/Modal";
import { useEffect, useRef } from "react";
import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";

const Gallery = ({ images }) => {
  const router = useRouter();
  const { photoId } = router.query;

  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef(null);

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [lastViewedPhoto, photoId, setLastViewedPhoto]);

  return (
    <main className="mx-auto flex w-full min-h-screen p-4">
      {photoId && (
        <Modal
          images={images}
          onClose={() => {
            setLastViewedPhoto(photoId);
          }}
        />
      )}
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
        {images.map((image) => (
          <Link
            key={image.id}
            href={`/image_gallery/?photoId=${image.id}`}
            as={`/photo/${image.id}`}
            ref={
              image.id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null
            }
            shallow
            className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight "
          >
            <Image
              alt="AI Image Generator"
              className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
              style={{
                transform: "translate3d(0, 0, 0)",
                width: "auto",
                height: "auto",
              }}
              placeholder="blur"
              blurDataURL={image.blurDataUrl}
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_1024/${image.public_id}.${image.format}`}
              width={720}
              height={480}
              sizes="(max-width: 640px) 100vw,
            (max-width: 1280px) 50vw,
            (max-width: 1536px) 33vw,
            25vw"
            />
            <div
              className="rounded-xl flex items-center justify-center transition-all transform 
                                translate-y-8 opacity-0 
                                group-hover:opacity-100 
                                group-hover:translate-y-0 absolute from-black/80 to-transparent inset-x-0 -bottom-2 pt-30 duration-300 ease-in-out"
            >
              <div className="space-y-3 text-xl text-center text-white p-4 rounded  group-hover:opacity-100 group-hover:translate-y-0  pb-10 transform-gpu  duration-300 ease-in-out">
                {image.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Gallery;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();
  console.log(results.resources);

  let reducedResults = [];

  let i = 0;

  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      description: result.filename,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image) => {
    return getBase64ImageUrl(image);
  });

  try {
    const resolvedBlurImages = await Promise.all(blurImagePromises);

    for (let i = 0; i < reducedResults.length; i++) {
      reducedResults[i].blurDataUrl = resolvedBlurImages[i];
    }
  } catch (err) {
    console.error("Error", err);
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
