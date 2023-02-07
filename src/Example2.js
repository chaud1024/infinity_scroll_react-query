import {  useRef, useCallback, useState, useEffect } from "react";
import Post from "./Post";
import { useInfiniteQuery } from "react-query";
import { getPostsPage } from "./api/axios";
import { Box, Button, Text, Title, createStyles } from "@mantine/core";
import { ArrowBigTop } from "tabler-icons-react"


const Example2 = () => {
  const { classes } = useStyles();

  const [showButton, setShowButton] = useState(false)

  const scrollToTop = () => {
    window.scroll({
        top: 0,
        behavior: 'smooth'
    })
  }

  useEffect(() => {
    const handleShowButton = () => {
        if (window.scrollY > 500) {
            setShowButton(true)
        } else {
            setShowButton(false)
        }
    }

    window.addEventListener("scroll", handleShowButton)
    return () => {
      window.removeEventListener("scroll", handleShowButton)
    }
  }, [])


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
    <Box className={classes.wrapper}>
      <Title order={3} id="top">
        &infin; Infinite Query &amp; Scroll
        <br />
        &infin; Ex. 2 - React Query
      </Title>
      {content}
      {isFetchingNextPage && <Text className="center">Loading More Posts...</Text>}
      { showButton && 
      <Button id="top" onClick={scrollToTop} type="button" className={classes.btn} leftIcon={<ArrowBigTop/>} >
        Back to Top
      </Button>
      }
    </Box>
  );
};
export default Example2;

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    position: "relative",
    backgroundColor: theme.colors.gray[2],

    [`& .${getRef('btn')}`]: {
      position: "fixed",
      bottom: "calc(var(--mantine-footer-height, 0px) + 16px)",
      right: "calc(var(--mantine-aside-width, 0px) + 16px)"
    }
  },
  btn: {
    ref: getRef('btn'),
    backgroundColor: theme.colors.blue[5],
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
  },
}))