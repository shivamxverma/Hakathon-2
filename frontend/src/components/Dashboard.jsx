import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Main = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [success, setSuccess] = useState(false);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user/posts');
      const allBlogs = Array.isArray(response.data) ? response.data : [];
      setBlogs(allBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onSubmit = async () => {
    if (title === '' || content === '') {
      return;
    }

    const newBlog = { title, content };

    try {
      const response = await axios.post('http://localhost:3000/user/posts', newBlog, { withCredentials: true });
      
      setBlogs((prev) => [...prev, response.data]);
      setTitle('');
      setContent('');
      setSuccess(true);
    } catch (error) {
      console.error('Error posting blog:', error);
    }
  };

  const JoinHandler = ()=> {
    const newSocket = new WebSocket("ws://localhost:8080");
    newSocket.onopen = () => {
      // console.log();
      // setSocket(newSocket);
    };
  }

  return (
    <div>
      <div>
        {success && (
          <h1 className='mt-4 p-4 text-black text-2xl'>Action Successful</h1>
        )}
        <button
          onClick={async () => {
            try {
              await axios.get('http://localhost:3000/logout', { withCredentials: true });
              setSuccess(true);
            } catch (error) {
              console.error('Logout error:', error);
            }
          }}
        >
          Logout
        </button>
      </div>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog Title"
          className="border p-2 mb-2 w-full"
        />
        <textarea
          rows="4"
          cols="50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Blog Content"
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={onSubmit}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Create New Blog
        </button>
      </div>

      <div>
        {blogs.length > 0 ? (
          blogs.map((blog, index) => (
            <div key={blog.id || index} className="border p-4 mt-4">
              <h1 className="text-xl font-bold">{blog.title}</h1>
              <p>{blog.content}</p>
              {/* <div><button onClick={JoinHandler}>Join</button></div> */}
            </div>
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>
    </div>
  );
};

export default Main;