import { useState, useRef, useCallback } from "react";
import usePosts from "./hooks/usePosts";
import Post from "./Post";

const Example1 = () => {
  // state for pageNum
  const [pageNum, setPageNum] = useState(1); // default value of 1

  // using the hook
  const { isLoading, isError, error, results, hasNextPage } = usePosts(pageNum); // pageNum state would be passed in

  // using useRef fot the last post
  // change name to intObserver
  const intObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log("we are near the last post");
          setPageNum((prev) => prev + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [isLoading, hasNextPage]
  );

  // if there's an error, return the error message
  if (isError) return <p className="center">Error: {error.message}</p>;

  // define content
  const content = results.map((post, i) => {
    if (results.length === i + 1) {
      // that let us know the last element that we get from the results
      // console.log("last element");
      // by using useRef, we can figure out what's the last result of results
      return <Post ref={lastPostRef} key={post.id} post={post} />;
    }
    return <Post key={post.id} post={post} />;
  });

  return (
    <>
      <h1 id="top">
        &infin; Infinite Query &amp; Scroll
        <br />
        &infin; Ex. 1 - React only
      </h1>
      {content}
      {isLoading && <p className="center">Loading More Posts...</p>}
      <p className="center">
        <a href="#top">Back to Top</a>
      </p>
    </>
  );
};
export default Example1;
