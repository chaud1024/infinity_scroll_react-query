import axios from "axios";

export const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const getPostsPage = async (pageParam = 1, options = {}) => {
  // infinity scroll & infinite query are essentially versions of pagenation
  // it will be requesting one page of result at a time
  // set pageParam which has a default that is 1 if it's not provided
  // then there will be an options param, its default value will be an empty object if that options param won't be provided
  const response = await api.get(`/posts?_page=${pageParam}`, options);
  // at this specific api, we need "_page=${pageParam}", and options
  // that &{pageParam} will be the value of _page
  return response.data;
  // return response.data
};
