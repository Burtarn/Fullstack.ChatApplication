import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // För att hämta postId från URL
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment } from '../../redux/slices/commentsSlice'; 
import AddComment from '../addComment/AddComment';

const Post = () => {
  const { postId } = useParams(); // Hämta postId från URL
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments);

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);

  useEffect(() => {
    if (!postId) {
      console.error('PostId är undefined, kan inte hämta inlägg.');
      return;
    }

    const fetchPost = async () => {
      console.log('Försöker hämta inlägg med ID:', postId);
      const response = await fetch(`http://localhost:3000/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Hämtade inlägg:', data);
        setPost(data);
      } else {
        console.error('Fel vid hämtning av inlägg', response.status);
      }
      setLoadingPost(false);
    };

    fetchPost();
    dispatch(fetchComments());
  }, [dispatch, postId]);

  const handleAddComment = async (content) => {
    try {
      await dispatch(addComment({ postId, content }));
    } catch (err) {
      console.error('Fel vid skapande av kommentar:', err.message);
    }
  };

  const postComments = comments.filter(comment => comment.post_id === parseInt(postId));

  if (loadingPost) return <p>Laddar inlägg...</p>;
  if (!post) return <p>Inlägget hittades inte.</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><strong>Skapad av:</strong> {post.username}</p>
      <p><strong>Datum:</strong> {new Date(post.created_at).toLocaleString()}</p>

      <div>
        <h3>Kommentarer</h3>
        <ul>
          {postComments.map((comment) => (
            <li key={comment.id}>
              <p><strong>{comment.username}</strong> ({new Date(comment.created_at).toLocaleString()})</p>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>
      </div>

      <AddComment onAddComment={handleAddComment} />
    </div>
  );
};

export default Post;
