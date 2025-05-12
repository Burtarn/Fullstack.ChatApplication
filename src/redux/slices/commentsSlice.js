import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks för att hämta och lägga till kommentarer
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const response = await fetch('http://localhost:3000/comments');
    if (!response.ok) {
      throw new Error('Fel vid hämtning av kommentarer');
    }
    return response.json();
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, content }) => {
    const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Fel vid skapande av kommentar');
    }
    return response.json();
  }
);

// Initial state för kommentarer
const initialState = {
  comments: [],
  status: 'idle',  // 'loading', 'succeeded', 'failed'
  error: null,
};

// Slice för kommentarer
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload); // Lägg till den nya kommentaren
      });
  },
});

export default commentsSlice.reducer;
