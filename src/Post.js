import React from "react";

// we will receive destructured post and ref
const Post = React.forwardRef(({ post }, ref) => {
  // define postBody
  const postBody = (
    <>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p>Post ID : {post.id}</p>
    </>
  );

  // define content that we are going to display
  // only the last result of the page of results will receive that ref
  // so if there's a ref, it's going to set the article with rhe ref,
  // if there's not, it's going to have the article without the ref
  const content = ref ? (
    <article ref={ref}>{postBody}</article>
  ) : (
    <article>{postBody}</article>
  );

  return content;
});

export default Post;

// components can't have refs on them without this
// on the Example1.js, the last element in the content, we're going to put a ref
// we will get an error if we didn't use a forward ref in this component
