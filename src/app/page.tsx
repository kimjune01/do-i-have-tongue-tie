/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useScreenshot, createFileName } from "use-react-screenshot";

type PhotoCollection = {
  [key: string]: any
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12" >
      <ComponentForStep />
    </main>
  );
}

const ComponentForStep = () => {
  const [step, setStep] = useState(0)
  const [pics, setPics] = useState<PhotoCollection>({})

  const addPhoto = (key: string, photo: any) => {
    if (!key || !photo) { return false }
    let newPics = pics
    newPics[key] = photo
    setPics(newPics)
    console.log('added photo: ', key)
    return true
  }

  const onNext = () => setStep((step + 1) % 9)
  if (step === 0) {
    return (<IntroStep onNext={onNext} />)
  } else if (step === 1) {
    return (<EducationStep onNext={onNext} />)
  } else if (step === 2) {
    return (<WideOpenPrimerStep onNext={onNext} />)
  } else if (step === 3) {
    return (<WideOpenPhotoStep onNext={onNext} addPhoto={addPhoto} />)
  } else if (step === 4) {
    return (<AnteriorPrimerStep onNext={onNext} />)
  } else if (step === 5) {
    return (<AnteriorPhotoStep onNext={onNext} addPhoto={addPhoto} />)
  } else if (step === 6) {
    return (<PosteriorPrimerStep onNext={onNext} />)
  } else if (step === 7) {
    return (<PosteriorPhotoStep onNext={onNext} addPhoto={addPhoto} />)
  } else if (step === 8) {
    return (<ResultsStep onNext={onNext} pics={pics} />)
  }
}

const IntroStep = ({ onNext }: { onNext: any }) => <>
  <div className="text-3xl py-12">Do I Have Tongue Tie? (for adults)</div>
  <div className="text-lg min-w-min max-w-96">This is a self-assessment tool for functional tongue-tie in adults that uses your webcam of selfie cam to measure and classify your tongue mobility. It will take photos of your tongue, but it will not be uploaded anywhere.</div>
  <Button className="" onClick={onNext}>Learn More</Button>
</>

const EducationStep = ({ onNext }: { onNext: any }) => <>
  <div className="text-3xl">What is Tongue Tie? Why does it matter?</div>
  <img className="max-w-96" src="/images/whatistonguetie.png" alt="whatistonguetie"></img>
  <div className="text-lg min-w-min max-w-96">Tongue tie is a common condition that affects facial development in young adults, and a contributing factor to obstructive sleep apnea. It affects your posture, swallowing, breathing, and speech. Learn more from <a target="_blank" className="text-cyan-700" href="https://www.zaghimd.com/tongue-tie">Soroush Zaghi, MD</a> and his <a target="_blank" className="text-cyan-700" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8247966/">published research</a>.</div>
  <Button className="" onClick={onNext}>Assess me</Button>
</>

const WideOpenPrimerStep = ({ onNext }: { onNext: any }) => <>
  <div className="text-3xl">What is Tongue Tie?</div>
  <img className="max-w-96" src="/images/wideopenblack.png" alt="wideopenblack"></img>
  <div className="text-lg min-w-min max-w-96">The first step is to measure the distance between your upper and lower teeth when your mouth is wide open. Open your mouth as wide as you can without pain or discomfort. It will take a picture using your camera.</div>
  <Button className="" onClick={onNext}>Allow Camera Access</Button>
</>

const WideOpenPhotoStep = ({ onNext, addPhoto }: { onNext: any, addPhoto: any }) =>
  <PhotoCaptureStep
    titleText="WideOpenPhotoStep"
    instructionText="Align your upper and lower teeth with the overlaid drawing"
    photoLabel="wideopen"
    onNext={onNext}
    addPhoto={addPhoto} />

const PhotoCaptureStep = ({ titleText, instructionText, photoLabel, onNext, addPhoto }:
  { titleText: string, instructionText: string, photoLabel: string, onNext: any, addPhoto: any }) => {
  const webcamRef = useRef<Webcam>(null);
  const [screenshot, setScreenshot] = useState("")
  const [cropped, setCropped] = useState("")
  useEffect(() => {
    const added = addPhoto(photoLabel, cropped)
    if (added) {
      onNext()
    }
  }, [cropped, addPhoto, photoLabel, onNext])
  const capture = useCallback(async () => {
    const cam = webcamRef.current
    setScreenshot(cam && cam.getScreenshot() || "")
  }, [webcamRef]
  );

  const imgSource = "/images/" + photoLabel + ".png"
  return <>
    <div className="text-3xl">{titleText}</div>
    <div className="relative w-[400px] h-[400px] overflow-hidden bg-neutral-400 rounded-lg">
      <img src={imgSource} alt={photoLabel} className="absolute z-10 object-contain opacity-60"></img>
      <Webcam
        className="absolute object-cover w-[1200px] h-[1200px]"
        style={{ marginTop: "-150%" }}
        audio={false}
        height={1440}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={2560}
        mirrored={true}
        videoConstraints={videoConstraints}
      />
    </div>
    <div className="">{instructionText}</div>
    {screenshot && <CroppedCanvas screenshot={screenshot} setCropped={setCropped} />}
    <Button className="" onClick={() => {
      capture()
    }}>Take photo</Button >
  </>
}

const AnteriorPrimerStep = ({ onNext }: { onNext: any }) => <>
  <div className="text-3xl">Anterior Tongue Range of Motion</div>
  <img className="max-w-96" src="/images/tipup.png" alt="tipup"></img>
  <div className="text-lg min-w-min max-w-96">While keeping your mouth wide open, raise the tip of your tongue to behind your upper teeth without pain or discomfort.</div>
  <Button className="" onClick={onNext}>Next</Button>
</>

const AnteriorPhotoStep = ({ onNext, addPhoto }: { onNext: any, addPhoto: any }) =>
  <PhotoCaptureStep
    titleText="AnteriorPhotoStep"
    instructionText="How high you can raise the tip indicates the anterior range of motion ratio."
    photoLabel="anterior"
    onNext={onNext}
    addPhoto={addPhoto} />

const PosteriorPrimerStep = ({ onNext }: { onNext: any }) => <>
  <div className="text-3xl">Posterior Tongue Range of Motion</div>
  <iframe width="360" height="300"
    src="https://www.youtube.com/embed/cZeK-Jbcvyc?si=T8KLzpi3JP3Mot62"
    title="Suction Hold"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  ></iframe>
  <div className="text-lg min-w-min max-w-96">The suction hold is a bit tricky. The video helps explain. Lift and suction the entire tongue up to the palate and open your mouth as wide as you can without pain or discomfort.</div>
  <Button className="" onClick={onNext}>Next</Button>
</>

const PosteriorPhotoStep = ({ onNext, addPhoto }: { onNext: any, addPhoto: any }) =>
  <PhotoCaptureStep
    titleText="PosteriorPhotoStep"
    instructionText="How low you can drop your jaw indicates the posterior range of motion ratio"
    photoLabel="posterior"
    onNext={onNext}
    addPhoto={addPhoto} />


const anteriorGrades = [
  {
    num: "1",
    rom: "> 80%",
    pic: "anteriorgrade1",
  },
  {
    num: "2",
    rom: "50 - 80%",
    pic: "anteriorgrade2",
  },
  {
    num: "3",
    rom: "< 50%",
    pic: "anteriorgrade3",
  },
  {
    num: "4",
    rom: "< 25%",
    pic: "anteriorgrade4",
  },
]

const posteriorGrades = [
  {
    num: "1",
    rom: "> 60%",
    pic: "posteriorgrade1",
  },
  {
    num: "2",
    rom: "30 - 60%",
    pic: "posteriorgrade2",
  },
  {
    num: "3",
    rom: "< 30%",
    pic: "posteriorgrade3",
  },
  {
    num: "4",
    rom: "< 5% or unable",
    pic: "posteriorgrade4",
  },
]

const RomTable = ({ gradesMap, caption }: { gradesMap: any[], caption: string }) =>
  <Table className="w-96">
    <TableCaption>{caption}</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Grade</TableHead>
        <TableHead>Range</TableHead>
        <TableHead>Example</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {gradesMap.map((grade) => (
        <TableRow key={grade.num}>
          <TableCell className="font-medium">{grade.num}</TableCell>
          <TableCell>{grade.rom}</TableCell>
          <TableCell className="w-48 max-w-48"><img src={`/images/${grade.pic}.png`} alt={grade.pic}></img></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table >

const PhotoTable = ({ label, baselineImageSrc, imageSrc }:
  { label: string, baselineImageSrc: string, imageSrc: string }) =>
  <Table className="w-96">
    <TableHeader>
      <TableRow>
        <TableHead>Baseline</TableHead>
        <TableHead>{label}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow >
        <TableCell><img className="w-48" src={baselineImageSrc} alt="wideopen" /></TableCell>
        <TableCell ><img className="w-48" src={imageSrc} alt={label}></img></TableCell>
      </TableRow>
    </TableBody>
  </Table >

const ResultsStep = ({ onNext, pics }: { onNext: any, pics: PhotoCollection }) => {
  const screenRef = createRef<HTMLDivElement>();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });
  const download = (img: string) => {
    const a = document.createElement("a");
    a.href = img;
    a.download = createFileName("jpg", "result");
    a.click();
  };

  const downloadScreenshot = () => takeScreenShot(screenRef.current).then(download);
  return (<>
    <div className="text-3xl">Results</div>
    <div ref={screenRef} className="justify-center">
      <div className="py-6"></div>
      <div className="flex-row py-4">
        <div className="text-xl">Anterior range of motion</div>
      </div>
      <RomTable gradesMap={anteriorGrades} caption="Compare with photo below to get your grade"></RomTable>
      <PhotoTable label="Anterior" baselineImageSrc={pics.wideopen} imageSrc={pics.anterior} />
      <div className="py-6"></div>
      <div className="flex-row py-4">
        <div className="text-xl">Posterior range of motion</div>
      </div>
      <RomTable gradesMap={posteriorGrades} caption="Compare with photo below to get your grade"></RomTable>
      <PhotoTable label="Posterior" baselineImageSrc={pics.wideopen} imageSrc={pics.posterior} />
      <div className="w-96 py-8">There are more dimensions to a complete tongue tie assessment, described in this <a target="_blank" className="text-cyan-700" href="https://www.youtube.com/watch?v=8dOq11N-qK8">long Youtube video</a>.</div>
      <div className="text-xl">What does this mean?</div>
      <div className="w-96 py-2">If your tongue movement is restricted, then it may be interfering with your posture or your upper airway. If you are developing obstructive sleep apnea, this is especially relevant.</div>
      <div className="py-6"></div>
      <div className="text-xl">What can I do?</div>
      <div className="w-96 py-2">To the best of our knowledge, a combination of myofunctional therapy and frenuloplasty (tongue tie release surgery) can improve your tongue ROM.</div>
      <div className="py-8"></div>
    </div>
    <Button className="py-2" onClick={downloadScreenshot}>Download Result</Button>
    <div className="py-2"></div>
    <button className="text-cyan-700 py-4" onClick={onNext}> Start Over </button>
  </>)
}


const videoConstraints = {
  width: {
    ideal: 1280
  },
  height: {
    ideal: 720
  },
  facingMode: "user"
};

const useCanvas = (callback: (arg0: any[]) => void) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) { console.log("canvas null"); return }
    const ctx = canvas.getContext('2d');
    callback([canvas, ctx]);
  }, [callback]);
  return canvasRef;
}

const CroppedCanvas = ({ screenshot, setCropped }: { screenshot: string, setCropped: any }) => {
  const canvasRef = useCanvas(([canvas, ctx]) => {
    //create an image object from the path
    const originalImage = new Image();
    originalImage.src = screenshot;
    if (!canvas || !ctx) { return }
    //wait for the image to finish loading
    originalImage.addEventListener('load', () => {
      const cropPortion = 0.25
      const oldWidth = originalImage.width
      const oldHeight = originalImage.height
      const newSize = Math.max(oldWidth * cropPortion, oldHeight * cropPortion)
      const newWidth = newSize
      const newHeight = newSize
      const newX = (oldWidth - newWidth) / 2
      const newY = (oldHeight) / 2
      //set the canvas size to the new width and height
      canvas.width = newWidth;
      canvas.height = newHeight;

      //draw the image
      ctx.drawImage(originalImage, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);
      setCropped(canvas.toDataURL("image/jpeg", 0.9))
      canvas.style.display = "none";
    });
  });

  return (<canvas ref={canvasRef} />);
};