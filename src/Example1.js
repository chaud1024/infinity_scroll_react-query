import { useState, useRef } from "react";
import usePosts from "./hooks/usePosts";

const Example1 = () => {
  // state for pageNum
  const [pageNum, setPageNum] = useState(1); // default value of 1

  // using the hook
  const { isLoading, isError, error, results, hasNextPage } = usePosts(pageNum); // pageNum state would be passed in

  const lastPostRef = useRef();

  // if there's an error, return the error message
  if (isError) return <p className="center">Error: {error.message}</p>;

  // define content
  const content = results.map((post, i) => {
    if (results.length === i + 1) {
      // that let us know the last element that we get from the results
      // console.log("last element");
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
