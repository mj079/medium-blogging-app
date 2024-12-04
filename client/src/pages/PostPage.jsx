import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../context'
import {formatISO9075} from "date-fns";
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';

function PostPage() {
    const [postInfo, setPostInfo] = useState(null)
    const { userInfo } = useContext(UserContext)
    const { id } = useParams()

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
        .then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo)
            })
        })
    }, [])

    if(!postInfo) return '';

  return (
    <div className='post-page'>
        <h1>{postInfo.title}</h1>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        <div className='author'>{postInfo.author.username}</div>
        {userInfo.id === postInfo.author._id && (
            <div className='edit-row'>
            <Link className='edit-btn' to={`/edit/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
                Edit this post
            </Link>
            </div>
        )}
        <div className='image'>
            <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
        </div>
        <div className='content' dangerouslySetInnerHTML={{__html:postInfo.content}}></div>
    </div>
  )
}

export default PostPage