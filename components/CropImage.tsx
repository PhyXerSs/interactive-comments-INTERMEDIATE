import React, { useCallback, useEffect, useRef, useState , SetStateAction , Dispatch, useContext} from "react";
import Cropper, { Point } from "react-easy-crop";
import { Popover, Transition } from "@headlessui/react";
import Resizer from "react-image-file-resizer";
import getCroppedImg from "../pages/api/cropImage";
import { AppCommentContext, initialStateType } from "../provider/AppProvider";

export interface PropType{
  selectImage:string;
  setSelectImage:React.Dispatch<React.SetStateAction<string>>
}

function CropImage({selectImage, setSelectImage}:PropType) {
    const { stateValue , isUploadImage }:{stateValue:initialStateType , isUploadImage:any} = useContext(AppCommentContext);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<number>(0);
    const [showInvalidUrl, setShowInvalidUrl] = useState<boolean>(false);
    const [changeImageUrl, setChangeImageUrl] = useState<string>("");
    const [isUploadFromDevice, setIsUploadFromDevice] = useState<boolean>(false);
    const [isSelectUploadMode, setIsSelectUploadMode] = useState<boolean>(false);
    const [croppedImage, setCroppedImage] = useState<Blob>();

    const onCropComplete = useCallback((croppedArea:any, croppedAreaPixels:any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = (await getCroppedImg(
        stateValue.isUploadImage,
        croppedAreaPixels
      )) as string;
      setSelectImage(croppedImage);
      isUploadImage('-');
      setChangeImageUrl("");
      setIsSelectUploadMode(false);
      setZoom(1);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  return (
    <> 
      {stateValue.isUploadImage !== '-' &&
      <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center z-[1100]">
        <div className="flex flex-col justify-center items-start w-full max-w-lg bg-white py-8 px-8 rounded-3xl relative drop-shadow-lg overflow-hidden h-[650px]">
          <p
            className="text-[20px] text-secondary-gray-2 font-bold absolute"
            style={{ top: "60px", left: "50px" }}
          >
            Crop your image
          </p>
          <div
            className="flex flex-col absolute rounded-xl top-28 overflow-hidden"
            style={{ left: "50px", width: "410px", height: "336px" }}
          >
            <Cropper
              image={stateValue.isUploadImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape={"round"}
              objectFit={"contain"}
              showGrid={false}
            />
          </div>
          <div
            className=" absolute w-96 flex flex-col justify-center items-center gap-2"
            style={{ top: "470px", left: "60px" }}
          >
            <div
              className="flex justify-between items-center"
              style={{ width: "380px" }}
            >
              <p className="text-gray-400">Zoom</p>
              <p className="text-gray-400">
                {zoom.toFixed(2)}%
              </p>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
              className="w-96"
            />
          </div>
          <div
            className="w-96 flex items-center justify-between absolute"
            style={{ top: "580px", left: "60px" }}
          >
            <div
              className="flex justify-center items-center text-blue-500 font-bold text-p border-2 border-blue-500 py-3 px-5 rounded-lg cursor-pointer ease-in duration-200"
              style={{ width: 180 }}
              onClick={() => {
                isUploadImage('-');
              }}
            >
              Cancel
            </div>
            <div
              className="flex justify-center items-center text-white font-bold text-p border-2 border-blue-500 py-3 rounded-lg bg-blue-500 hover:bg-blue-300 hover:border-blue-300  cursor-pointer ease-in duration-200"
              style={{ width: 180 }}
              onClick={showCroppedImage}
            >
              Save
            </div>
          </div>
        </div>
      </div>
      
      }
     
    </>
  );
}


export default CropImage