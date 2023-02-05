import { useState, useEffect } from "react";
import { getPostsPage } from "../api/axios";

const usePosts = (pageNum = 1) => {
  // usePosts excepts pageNum which has default value 1 in case it's not provided
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);

  // useEffect will be handling everything we need to do inside of this hook
  // inside of this useEffect what happends is the request itself for data
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});
    // essential resseting sths anytime the useEffect starts since its going to make a new request
    // so we would want to reset the errors if the existed already

    // AbortController : this will cancel the request when the component would unmount here
    // kind of the cleanup function we'll set all of that up
    const controller = new AbortController();
    const { signal } = controller;

    getPostsPage(pageNum, { signal })
      .then((data) => {
        setResult((prev) => [...prev, ...data]);
        // this is an array : so it could have prev values
        setHasNextPage(Boolean(data.length));
        // boolean: 0 = false
        // if there's any other link that would be true
        // it's either going to be 0 or a positive number
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (signal.aborted) return;
        // if the error is  from the abort controller, "signal.aborted" we can check that status
        // and return cuz that error we created on purpose and we can ignore
        setIsError(true);
        setError({ message: error.message });
      });

    return () => controller.abort();
    // controller should be placed before useEffect closes
    // anytime this unmounts it will abort the controller
    // if there's nothing to abourt this won't hurt anyting
  }, [pageNum]);

  return { isLoading, isError, error, result, hasNextPage };
};

export default usePosts;
