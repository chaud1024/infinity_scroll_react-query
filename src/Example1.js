import { useState, useRef, useCallback } from "react";
import usePosts from "./hooks/usePosts";
import Post from "./Post";

const Example1 = () => {
  // state for pageNum
  const [pageNum, setPageNum] = useState(1); // default value of 1

  // using the hook
  const { isLoading, isError, error, results, hasNextPage } = usePosts(pageNum); // pageNum state would be passed in

  // using useRef fot the last post
  // change name to intObserver since we're going to use Intersection Observer
  const intObserver = useRef();

  const lastPostRef = useCallback(
    (post) => {
      // if it's isLoading state for any reason, we will return, cuz we won't want whatever is about to happen
      if (isLoading) return;

      // look at the current property which always have to do with the useRef
      // disconnect() is saying that stop looking if we already have one there
      if (intObserver.current) intObserver.current.disconnect();

      // this is also going to receive posts
      // we'll call it post to stay consistent with what we're doing
      intObserver.current = new IntersectionObserver((posts) => {
        // inside the function, IntersectionObserver calls below
        // we're only going to have "this one ref" here, this one post
        // so if posts[0] is intersecting and also it has nextPage-boolean
        if (posts[0].isIntersecting && hasNextPage) {
          console.log("we are near the last post");
          // set pageNum
          // when we update that pageNum
          setPageNum((prev) => prev + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    // useCallback has dependeny array
    // what we're providing in the function : we're looking at isLoading, hasNextPage
    // if they are changing, then useCallback needs to deliever a new lastPostRef
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
      <span className="center btn">
        <a href="#top">Back to Top</a>
      </span>
    </>
  );
};
export default Example1;
