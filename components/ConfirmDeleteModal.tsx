import React, { useContext, useState } from 'react'
import { AnimatePresence , motion } from 'framer-motion'
import { AppCommentContext, initialStateType } from '../provider/AppProvider'
import { database } from "../firebase/firebaseConfig"
import { ref, remove } from 'firebase/database';
function ConfirmDeleteModal() {
    const { stateValue , setDeletePost }:{stateValue:initialStateType , setDeletePost : any} = useContext(AppCommentContext);
    const [ isLoading , setIsLoading ] = useState<boolean>(false);
    async function handleDelete(){
        if(!isLoading){
            setIsLoading(true);
            await remove(ref(database,stateValue.deletePostId));
            setIsLoading(false);
            setDeletePost('-');
        }
    }
    return (
        <AnimatePresence>
            {stateValue.deletePostId !== '-' &&
            <motion.div className="fixed z-[1000] top-0 w-screen h-full min-h-screen flex justify-center items-center bg-[#7a7a7c] bg-opacity-70"
                animate={{opacity:1}}
                initial={{opacity:0}}
                exit={{opacity:0}}
                transition={{duration:0.3}}
            >
                {stateValue.deletePostId !== '-' &&
                    <motion.div className="flex flex-col w-[350px] bg-white rounded-lg p-6 gap-4"
                        animate={{opacity:1 , scale:1 , y: 0}}
                        initial={{opacity:0 , scale:0 , y:-200}}
                        exit={{opacity:0 , scale:0 , y: -200}}
                        transition={{duration:0.5}}
                    >
                        <p className="text-[28px] text-[#3c4555] font-semibold">Delete comment</p>
                        <p className='text-[#97999c] text-[16px]'>{"Are you sure you want to delete this comment? This will remove the comment and can't be undone."}</p>
                        <div className="flex w-full justify-center items-center gap-3">
                            <button className="flex justify-center items-center w-1/2 rounded-lg py-3 font-semibold text-[16px] text-white bg-[#68717e] hover:bg-[#c2c9d2] ease-linear duration-200"
                                onClick={()=>{setDeletePost('-')}}
                            >NO, CANCEL</button>
                            <button className="flex justify-center items-center w-1/2 rounded-lg py-3 font-semibold text-[16px] text-white bg-[#ee6368] hover:bg-[#f4aaad] ease-linear duration-200"
                                onClick={handleDelete}
                            >YES, DELETE</button>
                        </div>
                    </motion.div>
                }
            </motion.div>}
        </AnimatePresence>
    )
}

export default ConfirmDeleteModal