import type { NextPage } from 'next'
import { getDatabase , ref , set , onValue ,off , update } from "firebase/database";
import { database } from '../firebase/firebaseConfig';
import AppProvider, { actions, AppCommentContext, commentType, initialStateType, repliesType, userType } from '../provider/AppProvider';
import { useContext, useEffect, useRef } from 'react';
import RootComment from '../components/RootComment';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CreateAccount from '../components/CreateAccount';

const Home: NextPage = () => {
  const { stateValue , changeUser , updateComment } : {stateValue:initialStateType , changeUser:any , updateComment:any} = useContext(AppCommentContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{
    // changeUser('juliusomo' , "./images/avatars/image-juliusomo.png" , "./images/avatars/image-juliusomo.webp")
  },[])

  useEffect(()=>{
    if(stateValue.currentUser.username !== '-'){
      onValue(ref(database , 'comments') , (snapshot) =>{
        if(snapshot.val()){
            let comments = snapshot.val() as any
            let commentList = [] as commentType[];
            for(let idComment in comments){
              if(comments.hasOwnProperty(idComment)){
                let comment = comments[idComment];
                let newComment = {} as commentType;
                newComment.content = comment?.content;
                newComment.createdAt = comment?.createdAt;
                newComment.id = comment?.id;
                newComment.score = comment?.score;
                let newUser = {} as userType;
                newUser.username = comment?.user?.username;
                newUser.imagePng = comment?.user?.image?.png;
                newUser.imageWebp = comment?.user?.image?.webp;
                newComment.user = newUser;
                newComment.scorePlus = [];
                for(let id in comment?.scorePlus ){
                  if(comment?.scorePlus.hasOwnProperty(id)){
                    newComment.scorePlus.push(comment?.scorePlus[id]);
                  }
                }
                newComment.scoreMinus = [];
                for(let id in comment?.scoreMinus ){
                  if(comment?.scoreMinus.hasOwnProperty(id)){
                    newComment.scoreMinus.push(comment?.scoreMinus[id]);
                  }
                }
                newComment.replies = [];
                for(let idReply in comment?.replies){
                  if(comment?.replies.hasOwnProperty(idReply)){
                    let replyComment = comment?.replies[idReply];
                    let newReply = {} as repliesType;
                    newReply.replyingTo = replyComment?.replyingTo;
                    newReply.content = replyComment?.content;
                    newReply.createdAt = replyComment?.createdAt;
                    newReply.id = replyComment?.id;
                    newReply.score = replyComment?.score;
                    let newReplyUser = {} as userType;
                    newReplyUser.username = replyComment?.user?.username;
                    newReplyUser.imagePng = replyComment?.user?.image?.png;
                    newReplyUser.imageWebp = replyComment?.user?.image?.webp;
                    newReply.user = newReplyUser;
                    newReply.scorePlus = [];
                    for(let id in replyComment?.scorePlus ){
                      if(replyComment?.scorePlus.hasOwnProperty(id)){
                        newReply.scorePlus.push(replyComment?.scorePlus[id]);
                      }
                    }
                    newReply.scoreMinus = [];
                    for(let id in replyComment?.scoreMinus ){
                      if(replyComment?.scoreMinus.hasOwnProperty(id)){
                        newReply.scoreMinus.push(replyComment?.scoreMinus[id]);
                      }
                    }
                    newReply.replies = [];
                    for(let idSecondReply in replyComment?.replies){
                      if(replyComment?.replies.hasOwnProperty(idSecondReply)){
                        let secondReplyComment = replyComment?.replies[idSecondReply];
                        let newSecondReply = {} as repliesType;
                        newSecondReply.replyingTo = secondReplyComment?.replyingTo;
                        newSecondReply.content = secondReplyComment?.content;
                        newSecondReply.createdAt = secondReplyComment?.createdAt;
                        newSecondReply.id = secondReplyComment?.id;
                        newSecondReply.score = secondReplyComment?.score;
                        let newUserSecondReply = {} as userType;
                        newUserSecondReply.username = secondReplyComment?.user?.username;
                        newUserSecondReply.imagePng = secondReplyComment?.user?.image?.png;
                        newUserSecondReply.imageWebp = secondReplyComment?.user?.image?.webp;
                        newSecondReply.user = newUserSecondReply;
                        
                        newSecondReply.scorePlus = [];
                        for(let id in secondReplyComment?.scorePlus ){
                          if(secondReplyComment?.scorePlus.hasOwnProperty(id)){
                            newSecondReply.scorePlus.push(secondReplyComment?.scorePlus[id]);
                          }
                        }
                        newSecondReply.scoreMinus = [];
                        for(let id in secondReplyComment?.scoreMinus ){
                          if(secondReplyComment?.scoreMinus.hasOwnProperty(id)){
                            newSecondReply.scoreMinus.push(secondReplyComment?.scoreMinus[id]);
                          }
                        }
                        newReply.replies.push(newSecondReply)
                        }
                      }
                    newComment.replies.push(newReply);
                  }
                }
              commentList.push(newComment);
              }
            }
          updateComment(commentList);
        }
      })
    }
    return () => {
      off(ref(database , 'comments'));
    }
  },[stateValue.currentUser])

  async function handleSend(){    
    if(textAreaRef.current && textAreaRef.current.value !== ''){
        let date = new Date;
        let newComment = {} as any;        
        newComment.content = textAreaRef.current.value;
        newComment.createdAt = String(date.getTime());
        newComment.id = String(date.getTime());
        newComment.score = 0;
        newComment.scoreMinus = [];
        newComment.scorePlus = [];
        newComment.replies = [];
        let img = {} as any;
        img.png = stateValue.currentUser.imagePng;
        img.webp = stateValue.currentUser.imageWebp;
        let userComment = {} as any;
        userComment.image = img;
        userComment.username = stateValue.currentUser.username;
        newComment.user = userComment;
        await update(ref(database , `comments/${date.getTime()}`),newComment);
        textAreaRef.current.value = '';
    }   
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1440px] flex flex-col items-center mt-[50px] gap-5">
        {stateValue.comment.map((rootComment , index)=>(
          <RootComment comments={rootComment} key={`rootComment${index}`}/>
        ))}
        <div className=" sticky bottom-3 flex flex-col md:flex-row bg-white rounded-lg w-full max-w-[450px] md:max-w-[690px] p-5 gap-4 items-start justify-center" style={{boxShadow: 'rgba(0, 0, 0, 0.13) 0px 14px 28px, rgba(0, 0, 0, 0.05) 0px 10px 10px'}}>
              <img className="w-10 rounded-full hidden md:flex" src={stateValue.currentUser.imagePng} alt=""/>
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
              <button className="w-[90px] hidden md:flex justify-center items-center bg-[#706fb2] hover:bg-[#d0cee7] ease-linear duration-200 font-[600] text-white rounded-lg py-2"
                onClick={handleSend}
              >
                  SEND
              </button>
              <div className="w-full flex md:hidden justify-between items-center">
              <img className="w-10 rounded-full flex md:hidden" src={stateValue.currentUser.imagePng} alt=""/>
                <button className="w-[90px] flex md:hidden justify-center items-center bg-[#706fb2] hover:bg-[#d0cee7] ease-linear duration-200 font-[600] text-white rounded-lg py-2"
                  onClick={handleSend}
                >
                    SEND
                </button>
              </div>
          </div>
          
      </div>
      <ConfirmDeleteModal/>
      <CreateAccount/>
    </div>
  )
}

export default Home
