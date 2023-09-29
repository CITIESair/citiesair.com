import React, { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../Components/DatasetDownload/DatasetFetcher';
import { WEBSITE_ID } from '../Components/CommentSection';

// create context
export const CommentCountsContext = createContext();

const hyvorTalkApiUrl = `https://talk.hyvor.com/api/v1/pages?website_id=${WEBSITE_ID}`;

// context provider
export function CommentCountsProvider({ children }) {
  // state to store data
  const [commentCounts, setCommentCounts] = useState({});

  const fetchCommentCounts = async () => {
    const commentCountsForAllPages = {};
    try {
      const jsonData = await fetchDataFromURL(hyvorTalkApiUrl, 'json');
      jsonData.data.forEach((item) => {
        commentCountsForAllPages[item.page_identifier] = item.comments_count;
      });
      return commentCountsForAllPages;
    } catch (error) {
      console.log('Error fetching comment counts data:', error);
      return commentCountsForAllPages;
    }
  };

  useEffect(() => {
    fetchCommentCounts().then((data) => {
      setCommentCounts(data);
    });
  }, []);

  // Memoize the value to be provided to avoid unnecessary re-renders
  const providerValue = useMemo(() => [commentCounts], [commentCounts]);

  // return context provider
  return (
    <CommentCountsContext.Provider value={providerValue}>
      {children}
    </CommentCountsContext.Provider>
  );
}
