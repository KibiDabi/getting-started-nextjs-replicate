import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import Header from "../components/Navbar";

const sleep = (ms) => new Promise((resolveFn) => setTimeout(resolveFn, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/predictions", {
      headers: {
        "Content-Type": "application/json",
      },
      prompt: e.target.prompt.value,
    });
    let prediction = await response.data;
    console.log(prediction);
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await axios.get("/api/predictions/" + prediction.id);
      prediction = await response.data;
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  return (
    <div className="flex w-full mx-auto flex-col items-center justify-center  min-h-screen">
      <Head>
        <title>AI Image Generator</title>
      </Head>
      {/* <Header /> */}
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20 background-gradient">
        <h1 className="mx-auto max-w-4xl font-display md:text-8xl leading-tighter tracking-tighter text-5xl font-extrabold tracking-normal text-gray-300 sm:text-7xll">
          Generate dream pictures with{" "}
          <span className="relative whitespace-nowrap text-green-800">
            <a href="https://replicate.com/stability-ai/sdxl?utm_source=project&utm_project=getting-started">
              Stability AI
            </a>
          </span>
        </h1>
        <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400  text-gray-500 leading-7">
          Input a prompt and see how words looks in pictures. 100% free –
          remodel your words today.
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mt-12">
              <input
                type="text"
                name="prompt"
                placeholder="Enter a prompt to display an image"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div>
                <button
                  type="submit"
                  className="flex w-full mt-2 justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Generate your images
                </button>
              </div>
            </div>
          </form>
        </div>

        {error && <div>{error}</div>}

        {prediction && (
          <>
            {prediction.output && (
              <div className="aspect-ratio: 1 / 1 image-wrapper mt-5 overflow-hidden rounded-lg max-w-[640px] mx-auto">
                <Image
                  className="rounded-lg"
                  src={prediction.output[prediction.output.length - 1]}
                  alt=""
                  // width={1024}
                  // height={1024}
                  sizes=" 100vw"
                  fill
                />
              </div>
            )}
            {prediction.status !== "succeeded" &&
              prediction.status !== "failed" && (
                <div className="flex justify-center">
                  <span className="circle animate-loader"></span>
                  <span className="circle animate-loader animation-delay-200"></span>
                  <span className="circle animate-loader animation-delay-400"></span>
                </div>
              )}
            <p className="py-3 text-sm opacity-50">
              Status: {prediction.status}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
