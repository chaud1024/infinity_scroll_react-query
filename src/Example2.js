import {  useRef, useCallback } from "react";
import Post from "./Post";
import { useInfiniteQuery } from "react-query";
import { getPostsPage } from "./api/axios";
import { Button, Text, Title } from "@mantine/core";
import { ArrowBigTop } from "tabler-icons-react"
import { createStyles } from '@mantine/core';


const Example2 = () => {
  const { classes } = useStyles();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, status,  error } = useInfiniteQuery('/posts', ({ pageParam = 1 }) => getPostsPage(pageParam), {
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined
    }
  }); 

  const intObserver = useRef();

  const lastPostRef = useCallback(
    (post) => {

      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {

        if (posts[0].isIntersecting && hasNextPage) {
          console.log("we are near the last post");

          fetchNextPage()
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === 'error') return <p className="center">Error: {error.message}</p>;

  const content = data?.pages.map((page) => {
    return page.map((post, i) => {
      if (page.length === i + 1) {
        return <Post ref={lastPostRef} key={post.id} post={post} />;
      }
      return <Post key={post.id} post={post} />;
    });
  })
  


  return (
    <>
      <Title order={3} id="top">
        &infin; Infinite Query &amp; Scroll
        <br />
        &infin; Ex. 2 - React Query
      </Title>
      {content}
      {isFetchingNextPage && <Text className="center">Loading More Posts...</Text>}
      <Button component="a" href="#top" className={classes.btn} leftIcon={<ArrowBigTop/>} >
        Back to Top
      </Button>
    </>
  );
};
export default Example2;

const useStyles = createStyles((theme, _params) => ({
  btn: {
    backgroundColor: theme.colors.blue[5],
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
    position: "fixed",
    bottom: theme.spacing.lg,
    right: theme.spacing.lg
  }
}))