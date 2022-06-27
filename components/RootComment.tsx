import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppCommentContext, commentType, initialStateType, repliesType, userType } from '../provider/AppProvider';
import ReplyComment from './ReplyComment';
import { getDatabase , ref , set ,get , remove , update , push  } from "firebase/database";
import { database } from '../firebase/firebaseConfig';
export interface propsType{
    comments:commentType;
}

function RootComment({comments}:propsType) {
    const { stateValue , setDeletePost }:{stateValue:initialStateType , setDeletePost:any} = useContext(AppCommentContext);
    const [isHoverPlus , setIsHoverPlus] = useState<boolean>(false);
    const [isHoverMinus , setIsHoverMinus] = useState<boolean>(false);
    const [isHoverReply , setIsHoverReply] = useState<boolean>(false);
    const [isReplyClick , setIsReplyClick] = useState<boolean>(false);
    const [isHoverDelete , setIsHoverDelete] = useState<boolean>(false);
    const [isEditClick , setIsEditClick] = useState<boolean>(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const editTextAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(()=>{
        if(editTextAreaRef.current){
            editTextAreaRef.current.value = comments?.content;
            editTextAreaRef.current.style.height = "auto";
            if(editTextAreaRef.current.scrollHeight > 128){
                editTextAreaRef.current.style.height = "128px";
                editTextAreaRef.current.style.overflowY = "auto"       
            }else{
                editTextAreaRef.current.style.height = (editTextAreaRef.current.scrollHeight) + "px";
            }
        }
    },[comments,isEditClick])

    useEffect(()=>{
        if(textAreaRef.current){
            textAreaRef.current.value = '@' + comments?.user?.username + ', ';
        }
    },[comments,isReplyClick])

    async function handleVotePlus(){
        let snapshotScorePlus = await get(ref( database ,`comments/${comments.id}/scorePlus`));
        let snapshotScoreMinus = await get(ref( database ,`comments/${comments.id}/scoreMinus`));
        let userVotePlusObj = snapshotScorePlus.val();
        let userVoteMinusObj = snapshotScoreMinus.val();
        for(let idMinus in userVoteMinusObj){
            if(userVoteMinusObj.hasOwnProperty(idMinus)){
                if(userVoteMinusObj[idMinus] === stateValue.currentUser.username){
                    remove(ref(database , `comments/${comments.id}/scoreMinus/${idMinus}`))
                }
            }
        }
        let userPlusList = [] as string[];
        for(let idPlus in userVotePlusObj){
            if(userVotePlusObj.hasOwnProperty(idPlus)){
                userPlusList.push(userVotePlusObj[idPlus]);
            }
        }
        if(!userPlusList.includes(stateValue.currentUser.username)){
            let date = new Date();
            let dateNowInSec = date.getTime();
            const updates = {} as any;
            updates[dateNowInSec] = stateValue.currentUser.username;
            await update(ref(database , `comments/${comments.id}/scorePlus`), updates);
        }else{
            for(let idPlus in userVotePlusObj){
                if(userVotePlusObj.hasOwnProperty(idPlus)){
                    if(userVotePlusObj[idPlus] === stateValue.currentUser.username){
                        remove(ref(database , `comments/${comments.id}/scorePlus/${idPlus}`))
                    }
                }
            }
        }
    }

    async function handleMinusVote(){
        let snapshotScorePlus = await get(ref( database ,`comments/${comments.id}/scorePlus`));
        let snapshotScoreMinus = await get(ref( database ,`comments/${comments.id}/scoreMinus`));
        let userVotePlusObj = snapshotScorePlus.val();
        let userVoteMinusObj = snapshotScoreMinus.val();
        for(let idPlus in userVotePlusObj){
            if(userVotePlusObj.hasOwnProperty(idPlus)){
                if(userVotePlusObj[idPlus] === stateValue.currentUser.username){
                    remove(ref(database , `comments/${comments.id}/scorePlus/${idPlus}`))
                }
            }
        }
        let userMinusList = [] as string[];
        for(let idMinus in userVoteMinusObj){
            if(userVoteMinusObj.hasOwnProperty(idMinus)){
                userMinusList.push(userVoteMinusObj[idMinus]);
            }
        }
        if(!userMinusList.includes(stateValue.currentUser.username)){
            let date = new Date();
            let dateNowInSec = date.getTime(); 
            const updates = {} as any;
            updates[dateNowInSec] = stateValue.currentUser.username;
            await update(ref(database , `comments/${comments.id}/scoreMinus`), updates);
        }else{
            for(let idMinus in userVoteMinusObj){
                if(userVoteMinusObj.hasOwnProperty(idMinus)){
                    if(userVoteMinusObj[idMinus] === stateValue.currentUser.username){
                        remove(ref(database , `comments/${comments.id}/scoreMinus/${idMinus}`))
                    }
                }
            }
        }
    }

    async function handleReply(){
        if(textAreaRef.current){
            let date = new Date;
            let newReply = {} as any;        
            newReply.content = textAreaRef.current.value.replace(`@${comments?.user?.username},`,"");
            newReply.createdAt = String(date.getTime());
            newReply.id = String(date.getTime());
            newReply.replyingTo = comments?.user?.username;
            newReply.score = 0;
            newReply.scoreMinus = [];
            newReply.scorePlus = [];
            let img = {} as any;
            img.png = stateValue.currentUser.imagePng;
            img.webp = stateValue.currentUser.imageWebp;
            let userComment = {} as any;
            userComment.image = img;
            userComment.username = stateValue.currentUser.username;
            newReply.user = userComment;
            await update(ref(database , `comments/${comments?.id}/replies/${date.getTime()}`),newReply);
            setIsReplyClick(false)
        }   
    }

    function secondsToDhms(seconds:number) {
        let date = new Date;
        seconds = ( date.getTime() - seconds ) / 1000;
        seconds = Number(seconds);
        let minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let hour = Math.floor(minute / 60);
        minute = minute % 60;
        let day = Math.floor(hour / 24);
        hour = hour % 24;
        let month = Math.floor(day / 30);
        day = day % 30;
        let year = Math.floor(month / 12);
        month = month % 12;

        if(year > 0){
            return year + (year == 1 ? " year " : " years ") + "ago";
        }
        if(month > 0){
            return month + (month == 1 ? " month " : " months ") + "ago";
        }
        if(day >= 7){
            return Math.floor(day / 7) + (Math.floor(day / 7) == 1 ? " week " : " weeks ") + "ago";
        }
        if(day > 0){
            return day + (day == 1 ? " day " : " days ") + "ago";
        }
        if(hour > 0){
            return hour + (hour == 1 ? " hour " : " hours ") + "ago";
        }
        if(minute === 0){
            return 'now'
        }
        var mDisplay = minute > 0 ? minute + (minute == 1 ? " minute " : " minutes ") : "";
        return mDisplay + 'ago';
    }

    async function handleEdit(){
        if(editTextAreaRef.current && editTextAreaRef.current.value !== ''){
            let date = new Date;
            let newComment = {} as any;        
            newComment.content = editTextAreaRef.current.value;
            newComment.createdAt = String(date.getTime());
            newComment.id = comments.id;
            newComment.score = 0;
            let img = {} as any;
            img.png = stateValue.currentUser.imagePng;
            img.webp = stateValue.currentUser.imageWebp;
            let userComment = {} as any;
            userComment.image = img;
            userComment.username = stateValue.currentUser.username;
            newComment.user = userComment;
            await update(ref(database , `comments/${comments?.id}`),newComment);
            editTextAreaRef.current.value = '';
            setIsEditClick(false);
        }  
    }

    return (
        <>
            <div className="flex flex-col w-full max-w-[450px] md:max-w-[690px] gap-2">
                <div className="flex bg-white rounded-lg w-full p-5 gap-5">
                    <div className="hidden md:flex flex-col w-10 h-[95px] justify-center rounded-xl bg-[#f5f6fa] items-center gap-3">
                        <div className="ease-linear duration-200 cursor-pointer p-1"
                            onMouseEnter={()=>{setIsHoverPlus(true)}}
                            onMouseLeave={()=>{setIsHoverPlus(false)}}
                            onClick={handleVotePlus}
                        >
                            <svg width={11} height={11} xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149a.484.484 0 0 0 .148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15.48.48 0 0 0-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                                    fill= { isHoverPlus || comments.scorePlus.includes(stateValue.currentUser.username) ? "#6866a9" :"#C5C6EF"}
                                />
                            </svg>
                        </div>
                        <p className="text-[#6866a9] font-[700]">{comments?.scorePlus?.length - comments?.scoreMinus?.length}</p>
                        <div className="ease-linear duration-200 cursor-pointer py-1 px-2"
                            onMouseEnter={()=>{setIsHoverMinus(true)}}
                            onMouseLeave={()=>{setIsHoverMinus(false)}}
                            onClick={handleMinusVote}
                        >
                            <svg width={11} height={3} xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                                    fill= { isHoverMinus || comments.scoreMinus.includes(stateValue.currentUser.username) ? "#6866a9" :"#C5C6EF"}
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full flex justify-between">
                            <div className='flex gap-3 items-center'>
                                <img className="w-8 rounded-full" src={comments?.user?.imagePng} alt=""/>
                                <div className="flex gap-1 items-center">
                                    <p className="font-semibold">{comments?.user?.username}</p>
                                    {comments?.user?.username === stateValue.currentUser.username  && 
                                    <div className=" w-[34px] bg-[#706fb2] h-[18px] flex relative">
                                        <p className="text-white text-[14px] font-semibold absolute -top-[3px] left-[5px]">you</p>    
                                    </div>}
                                </div>
                                <p className="text-[#80838a]">{secondsToDhms(Number(comments?.createdAt))}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-5">
                                {comments?.user?.username === stateValue.currentUser.username  &&
                                    <div className="flex gap-2 items-center cursor-pointer"
                                        onMouseEnter={()=>{setIsHoverDelete(true)}}
                                        onMouseLeave={()=>{setIsHoverDelete(false)}}
                                        onClick={()=>{
                                            setDeletePost(`comments/${comments?.id}`);
                                        }}
                                    >
                                        <svg width={12} height={14} xmlns="http://www.w3.org/2000/svg">
                                            <path
                                            d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                                            fill={isHoverDelete ? '#f3bbbd' : "#ED6368"}
                                            />
                                        </svg>
                                        <p className={`font-[700] ${isHoverDelete ? 'text-[#f3bbbd]' :'text-[#ED6368]' }`}>Delete</p>
                                    </div>
                                }
                                {comments?.user?.username === stateValue.currentUser.username ? 
                                <div className="flex gap-[6px] items-center cursor-pointer"
                                    onMouseEnter={()=>{setIsHoverReply(true)}}
                                    onMouseLeave={()=>{setIsHoverReply(false)}}
                                    onClick={()=>{
                                        setIsEditClick(!isEditClick);
                                    }}
                                >
                                   
                                    <svg width={14} height={14} xmlns="http://www.w3.org/2000/svg">
                                        <path
                                        d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333a1.75 1.75 0 0 0 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                                        fill={isHoverReply ? '#d0cee7' : '#706fb2'}
                                        />
                                    </svg>
                                    <p className={`font-[700] ${isHoverReply ? 'text-[#d0cee7]' :'text-[#706fb2]' }`}>Edit</p>
                                </div>
                                :
                                <div className="flex gap-2 items-center cursor-pointer"
                                    onMouseEnter={()=>{setIsHoverReply(true)}}
                                    onMouseLeave={()=>{setIsHoverReply(false)}}
                                    onClick={()=>{
                                        setIsReplyClick(!isReplyClick);
                                    }}
                                >
                                    <svg width={14} height={13} xmlns="http://www.w3.org/2000/svg">
                                        <path
                                        d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                                        fill={isHoverReply ? '#d0cee7' : '#706fb2'}
                                        />
                                    </svg>
                                    <p className={`font-[700] ${isHoverReply ? 'text-[#d0cee7]' :'text-[#706fb2]' }`}>Reply</p>
                                </div>
                                }    
                            </div>
                        </div>
                        {isEditClick ? 
                            <div className="flex flex-col w-full max-w-[580px] items-end gap-4">
                                <textarea ref={editTextAreaRef} placeholder="Edit your comment..." className="w-full overflow-y-clip resize-none min-h-[90px] bg-transparent outline-none rounded-lg px-4 py-1 focus:border-[#797996] border-2" 
                                    onChange={(e:any)=>{
                                        e.target.style.height = "auto";
                                        if(e.target.scrollHeight > 128){
                                            e.target.style.height = "128px";
                                            e.target.style.overflowY = "auto"       
                                        }else{
                                            e.target.style.height = (e.target.scrollHeight) + "px";
                                        }
                                    }}
                                />
                                <button className="w-[90px] flex justify-center items-center bg-[#706fb2] hover:bg-[#d0cee7] ease-linear duration-200 font-[600] text-white rounded-lg py-2"
                                    onClick={handleEdit}
                                >
                                    UPDATE
                                </button>
                            </div>
                            :<p className="w-full max-w-[550px] text-[#80838a] text-[16px] break-words">{comments.content}</p>
                        }
                        <div className="flex md:hidden w-full justify-between items-center">
                            <div className="flex w-[95px] h-10 justify-center rounded-xl bg-[#f5f6fa] items-center gap-3">
                                <div className="ease-linear duration-200 cursor-pointer p-1"
                                    onMouseEnter={()=>{setIsHoverPlus(true)}}
                                    onMouseLeave={()=>{setIsHoverPlus(false)}}
                                    onClick={handleVotePlus}
                                >
                                    <svg width={11} height={11} xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149a.484.484 0 0 0 .148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15.48.48 0 0 0-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                                            fill= { isHoverPlus || comments.scorePlus.includes(stateValue.currentUser.username) ? "#6866a9" :"#C5C6EF"}
                                        />
                                    </svg>
                                </div>
                                <p className="text-[#6866a9] font-[700]">{comments?.scorePlus?.length - comments?.scoreMinus?.length}</p>
                                <div className="ease-linear duration-200 cursor-pointer py-1 px-2"
                                    onMouseEnter={()=>{setIsHoverMinus(true)}}
                                    onMouseLeave={()=>{setIsHoverMinus(false)}}
                                    onClick={handleMinusVote}
                                >
                                    <svg width={11} height={3} xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                                            fill= { isHoverMinus || comments.scoreMinus.includes(stateValue.currentUser.username) ? "#6866a9" :"#C5C6EF"}
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex md:hidden items-center gap-5">
                                {comments?.user?.username === stateValue.currentUser.username  &&
                                    <div className="flex gap-2 items-center cursor-pointer"
                                        onMouseEnter={()=>{setIsHoverDelete(true)}}
                                        onMouseLeave={()=>{setIsHoverDelete(false)}}
                                        onClick={()=>{
                                            setDeletePost(`comments/${comments?.id}`);
                                        }}
                                    >
                                        <svg width={12} height={14} xmlns="http://www.w3.org/2000/svg">
                                            <path
                                            d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                                            fill={isHoverDelete ? '#f3bbbd' : "#ED6368"}
                                            />
                                        </svg>
                                        <p className={`font-[700] ${isHoverDelete ? 'text-[#f3bbbd]' :'text-[#ED6368]' }`}>Delete</p>
                                    </div>
                                }
                                {comments?.user?.username === stateValue.currentUser.username ? 
                                <div className="flex gap-[6px] items-center cursor-pointer"
                                    onMouseEnter={()=>{setIsHoverReply(true)}}
                                    onMouseLeave={()=>{setIsHoverReply(false)}}
                                    onClick={()=>{
                                        setIsEditClick(!isEditClick);
                                    }}
                                >
                                   
                                    <svg width={14} height={14} xmlns="http://www.w3.org/2000/svg">
                                        <path
                                        d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333a1.75 1.75 0 0 0 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                                        fill={isHoverReply ? '#d0cee7' : '#706fb2'}
                                        />
                                    </svg>
                                    <p className={`font-[700] ${isHoverReply ? 'text-[#d0cee7]' :'text-[#706fb2]' }`}>Edit</p>
                                </div>
                                :
                                <div className="flex gap-2 items-center cursor-pointer"
                                    onMouseEnter={()=>{setIsHoverReply(true)}}
                                    onMouseLeave={()=>{setIsHoverReply(false)}}
                                    onClick={()=>{
                                        setIsReplyClick(!isReplyClick);
                                    }}
                                >
                                    <svg width={14} height={13} xmlns="http://www.w3.org/2000/svg">
                                        <path
                                        d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                                        fill={isHoverReply ? '#d0cee7' : '#706fb2'}
                                        />
                                    </svg>
                                    <p className={`font-[700] ${isHoverReply ? 'text-[#d0cee7]' :'text-[#706fb2]' }`}>Reply</p>
                                </div>
                                }    
                            </div>
                        </div>
                    </div>
                    
                </div>
                {isReplyClick && 
                <div className="flex bg-white rounded-lg w-full max-w-[690px] p-5 gap-4 items-start justify-center">
                    <img className="w-10 rounded-full" src={stateValue.currentUser.imagePng} alt=""/>
                    <textarea ref={textAreaRef} placeholder="Add a comment..." className="w-full max-w-[490px] overflow-y-clip resize-none min-h-[90px] bg-transparent outline-none rounded-lg px-4 py-1 focus:border-[#797996] border-2"
                        onChange={(e:any)=>{
                            e.target.style.height = "auto";
                            if(e.target.scrollHeight > 128){
                                e.target.style.height = "128px";
                                e.target.style.overflowY = "auto"       
                            }else{
                                e.target.style.height = (e.target.scrollHeight) + "px";
                            }
                        }}
                    />
                    <button className="w-[90px] flex justify-center items-center bg-[#706fb2] hover:bg-[#d0cee7] ease-linear duration-200 font-[600] text-white rounded-lg py-2"
                        onClick={handleReply}
                    >
                        REPLY
                    </button>
                </div>
                }
            </div>
            {comments?.replies?.length > 0 && 
            <div className="flex flex-col w-full max-w-[450px] md:max-w-[690px] items-end">
                <div className="w-full max-w-[450px] md:max-w-[650px] flex flex-col pl-4 md:pl-10 border-l-2 border-l-[#ededef] gap-5">
                    {comments?.replies.map((reply , index)=>(
                        <ReplyComment key={`replyComment${index}`} comments={reply} rootCommentId={comments.id}/>
                    ))}
                </div>
            </div>}
        </>
    )
}

export default RootComment