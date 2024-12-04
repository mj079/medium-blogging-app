import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';
import Editor from "../Editor";

function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [files, setFiles] = useState('')
    const [content, setContent] = useState('')
    const [redirect, setRedirect] = useState(false)

    async function createPost(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('file', files[0]);
        data.set('content', content)

        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            credentials: 'include',
            body: data
        })

        if(response.ok) {
            setRedirect(true)
        } else {
            alert("All fields are required")
        }
    }
    
    if(redirect) {
        return <Navigate to={'/'} />
    }

  return (
    <div>
        <form onSubmit={createPost}>
            <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}/>
            <input type="text" placeholder='summary' value={summary} onChange={e => setSummary(e.target.value)}/>
            <input type="file" onChange={e => setFiles(e.target.files)}/>
            <Editor value={content} onChange={setContent} />
            <button style={{marginTop: "5px"}} type='submit'>submit</button>
        </form>
    </div>
  )
}

export default CreatePost