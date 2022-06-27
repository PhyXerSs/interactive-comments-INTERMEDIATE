import React, { useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence , motion } from 'framer-motion'
import { AppCommentContext, initialStateType } from '../provider/AppProvider'
import Resizer from "react-image-file-resizer";
import CropImage from './CropImage';
function CreateAccount() {
    const { stateValue , isUploadImage , changeUser } : { stateValue:initialStateType , isUploadImage:any , changeUser:any }= useContext(AppCommentContext);
    const usernameRef = useRef<HTMLInputElement>(null);
    const [ selectImage , setSelectImage ] = useState<string>('/images/avatars/profile.png');
    const [isHoverImage , setIsHoverImage] = useState<boolean>(false);
    const [isFocusInput , setIsFocusInput] = useState<boolean>(false);
    function fileChangedHandler(event: any) {
        var fileInput = false;
        if (event.target.files[0]) {
          fileInput = true;
        }
        if (fileInput) {
          try {
            Resizer.imageFileResizer(
              event.target.files[0],
              1000,
              1000,
              "JPEG",
              150,
              0,
              (uri) => {
                let data = uri as string;
                isUploadImage(data);
              },
              "Blob"
            );
          } catch (err) {
            console.log(err);
          }
        }
      }

    useEffect(()=>{
        const concernedElement = document.querySelector(".inputbox");

        document.addEventListener("mousedown", (event:any) => {
            if (concernedElement?.contains(event.target)) {
                setIsFocusInput(true);
            } else {
                setIsFocusInput(false);
            }
        });
    },[])

    return (
        <AnimatePresence>
            {stateValue.currentUser.username === '-' &&
            <motion.div className="fixed z-[1000] top-0 w-screen h-full min-h-screen flex justify-center items-center bg-[#7a7a7c] bg-opacity-70"
                animate={{opacity:1}}
                initial={{opacity:0}}
                exit={{opacity:0}}
                transition={{duration:0.3}}
            >
                {stateValue.currentUser.username === '-' &&
                <motion.div className="flex flex-col items-center p-10 w-[350px] bg-white rounded-lg gap-10"
                    animate={{opacity:1 , y:0 , x:0, scale:1}}
                    initial={{opacity:0 , y:-200 , x:-200 , scale:0}}
                    exit={{opacity:0 , y:-200, x:-200 , scale:0}}
                    transition={{duration:0.5}}
                >
                    <label className="flex w-[100px] h-[100px] rounded-full justify-center relative ring-2 ring-offset-2 ring-blue-500 cursor-pointer" style={{backgroundImage:`url(${selectImage})` , backgroundRepeat:'no-repeat' , backgroundSize:'cover',backgroundPosition:'center'}}
                        onMouseEnter={()=>{
                            setIsHoverImage(true);
                        }}
                        onMouseLeave={()=>{
                            setIsHoverImage(false);
                        }}
                    >
                        
                        <div className={`absolute top-0 w-full h-full flex justify-center items-center rounded-full bg-black bg-opacity-0 hover:bg-opacity-50 ease-linear duration-200`}
                        >
                            <p className="text-white font-semibold">{isHoverImage ? 'Edit Image' : ''}</p>
                            <div className="w-6 h-6 rounded-full absolute bottom-0 right-0 bg-blue-500 flex justify-center items-center z-[10]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        <input type="file" className="hidden" accept="image/*"
                            onChange={async (e) => {
                                let file: string;
                                if (
                                  e.target.files !== null &&
                                  e.target.files.length > 0
                                ) {
                                  fileChangedHandler(e);
                                }
                              }}
                        />
                    </label>
                    <form className="w-full flex items-center relative inputbox flex-col gap-5"
                        onSubmit={(e:any)=>{
                            e.preventDefault();
                            if(usernameRef.current && usernameRef.current.value !== ''){
                                changeUser(usernameRef.current.value , selectImage , selectImage )
                            }
                        }}
                    >
                        <input type="text" ref={usernameRef} className={`w-full bg-transparent outline-none rounded-lg border-[2px] ${isFocusInput  ? 'border-blue-400 z-[0]':'border-blue-100 z-[10]' } py-2 px-3 ease-linear duration-200 `}
                        />
                        <div className={` absolute ${isFocusInput || (usernameRef.current && usernameRef.current.value !== '')  ? '-top-2  z-[10]' : 'top-3' } ${isFocusInput ? 'text-blue-500 border-x-2 border-blue-500':'text-blue-300'} left-3 bottom-0 bg-white h-4 w-[85px] ease-linear duration-50 text-center`}>
                            <p className="absolute -top-1 left-[5px]">Username</p>
                        </div>
                        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold justify-center items-center rounded-lg hover:bg-blue-300 ease-linear duration-200">
                            Continue
                        </button>
                    </form>
                    <CropImage selectImage={selectImage} setSelectImage={setSelectImage}/>
                </motion.div>
                }
            </motion.div>
            }
            
        </AnimatePresence>
    )
}

export default CreateAccount