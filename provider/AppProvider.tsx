import { createContext, useMemo, useReducer } from "react";

export interface userType{
    imagePng:string;
    imageWebp:string;
    username:string;
}

export interface repliesType{
    content:string;
    createdAt:string;
    id:string;
    score:number;
    user:userType;
    replyingTo:string;
    replies:repliesType[];
    scorePlus:string[];
    scoreMinus:string[];
}

export interface commentType{
    content:string;
    createdAt:string;
    id:string;
    score:number;
    user:userType;
    replies:repliesType[];
    scorePlus:string[];
    scoreMinus:string[];
}
export interface initialStateType{
    currentUser:userType;
    comment:commentType[];
    deletePostId:string,
    isUploadImage:string,
}

const initialState:initialStateType = {
    currentUser:{
        imagePng:'-',
        imageWebp:'-',
        username:'-',
    },
    comment:[],
    deletePostId:'-',
    isUploadImage:'-',
}

export const actions = {
    changeCurrentUser : "CHANGE_CURRENT_USER",
    commentUpdate: "COMMENT_UPDATE",
    setDeletePost: "SET_DELETE_POST",
    isUploadImage: "IS_UPLOAD_IMAGE",
}

const reducer = (state : initialStateType , action: any) => {
    switch(action.type){
        case 'CHANGE_CURRENT_USER':
            const { username , img } = action.payload;
            return{
                ...state,
                currentUser:{
                    imagePng:img.png,
                    imageWebp:img.webp,
                    username:username
                }
            }
        case 'COMMENT_UPDATE':
            const { commentList }:{commentList:commentType[]} = action.payload;
            return{
                ...state,
                comment:commentList
            }
        case 'SET_DELETE_POST':
            const { idPost } : { idPost:string } = action.payload;
            return{
                ...state,
                deletePostId : idPost
            }
        case 'IS_UPLOAD_IMAGE':
            const { isUploadImage } : { isUploadImage :string } = action.payload;
            return{
                ...state,
                isUploadImage:isUploadImage
            }
        default:
            return state;
    }
    
      
}

export const AppCommentContext = createContext<any>(initialState);

const AppProvider = ({children}:{children:any}):any => {
    const [ state , dispatch ] = useReducer(reducer , initialState);
    const value = {
        stateValue:state,
        changeUser: (name:string, png:string, webp:string)=>{
            dispatch({type:actions.changeCurrentUser , payload:{username:name , img:{png:png, webp:webp} }});
        },
        updateComment : (commentList:commentType[]) => {
            dispatch({type:actions.commentUpdate , payload:{commentList :commentList }})
        },
        setDeletePost : (id:string) => {
            dispatch({type:actions.setDeletePost , payload:{idPost:id}})
        },
        isUploadImage : ( isUpload:string ) => {
            dispatch({type:actions.isUploadImage , payload:{isUploadImage:isUpload}})
        } 
    }
    return (
        <AppCommentContext.Provider value={value}>
            {children}
        </AppCommentContext.Provider>
    )
};

export default AppProvider;