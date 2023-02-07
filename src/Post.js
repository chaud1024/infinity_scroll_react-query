import React from "react";
import { Blockquote, createStyles, Text, Title } from '@mantine/core';

// we will receive destructured post and ref
const Post = React.forwardRef(({ post }, ref) => {
  const { classes } = useStyles();
  // define postBody
  const postBody = (
    <>
      <Title order={3}>{post.title}</Title>
      <Blockquote color="yellow" cite={`- Post ID : ${post.id}`}>
        <Text className={classes.postText}>{post.body}</Text>
      </Blockquote>
    </>
  );

  // define content that we are going to display
  // only the last result of the page of results will receive that ref
  // so if there's a ref, it's going to set the article with rhe ref,
  // if there's not, it's going to have the article without the ref
  const postContent = ref ? (
    <article ref={ref}>{postBody}</article>
  ) : (
    <article>{postBody}</article>
  );

  return postContent;
});

export default Post;

// components can't have refs on them without this
// on the Example1.js, the last element in the content, we're going to put a ref
// we will get an error if we didn't use a forward ref in this component

const useStyles = createStyles((theme, _params) => ({
  postText: {
    color: theme.colors.gray[0]
  } 
}))