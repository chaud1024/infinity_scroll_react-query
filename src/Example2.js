import {  useRef, useCallback } from "react";
import Post from "./Post";
import { useInfiniteQuery } from "react-query";
import { getPostsPage } from "./api/axios";

const Example2 = () => {

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
      <h1 id="top">
        &infin; Infinite Query &amp; Scroll
        <br />
        &infin; Ex. 2 - React Query
      </h1>
      {content}
      {isFetchingNextPage && <p className="center">Loading More Posts...</p>}
      <span className="center btn">
        <a href="#top">Back to Top</a>
      </span>
    </>
  );
};
export default Example2;
