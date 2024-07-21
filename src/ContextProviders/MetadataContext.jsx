import React, { useState, createContext, useMemo, useEffect } from 'react';
import { fetchDataFromURL } from '../API/ApiFetch';
import { WEBSITE_ID, AIR_QUALITY_PAGE_ID } from '../Components/CommentSection';

// create context
export const MetadataContext = createContext();

const hyvorTalkApiUrl = `https://talk.hyvor.com/api/v1/pages?website_id=${WEBSITE_ID}&id=${AIR_QUALITY_PAGE_ID}`;

// context provider
export function MetadataProvider({ children }) {
  // state to store data
  const [commentCounts, setCommentCounts] = useState(null);

  const fetchCommentCounts = async () => {
    const commentCountsForAllPages = {};
    try {
      const jsonData = await fetchDataFromURL({
        url: hyvorTalkApiUrl,
        needsAuthorization: false,
        includesHeadersJSON: false
      });
      jsonData.data.forEach((item) => {
        commentCountsForAllPages[item.page_identifier] = item.comments_count;
      });
      return commentCountsForAllPages;
    } catch (error) {
      console.log('Error fetching comment counts data:', error);
      return commentCountsForAllPages;
    }
  };

  const [stats, setStats] = useState(null);

  // Memoize the value to be provided to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({
    commentCounts, fetchCommentCounts, setCommentCounts,
    stats, setStats
  }), [commentCounts, stats]);

  // return context provider
  return (
    <MetadataContext.Provider value={providerValue}>
      {children}
    </MetadataContext.Provider>
  );
}
