import React, { useState, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../API/ApiFetch';
import { HYVOR_API_URL } from '../Utils/GlobalVariables';

export const MetadataContext = createContext();

export function MetadataProvider({ children }) {
  // ------ Hyvor Talk's comment section metadata ------
  const [commentCounts, setCommentCounts] = useState(null);

  const fetchCommentCounts = async () => {
    const commentCountsForAllPages = {};
    try {
      const jsonData = await fetchDataFromURL({
        url: HYVOR_API_URL,
        needsAuthorization: false,
        includesContentTypeHeader: false
      });
      jsonData.forEach((item) => {
        commentCountsForAllPages[item.identifier] = item.comments_count;
      });
      return commentCountsForAllPages;
    } catch (error) {
      console.log('Error fetching comment counts data:', error);
      return commentCountsForAllPages;
    }
  };

  // ------ At a Glance's statistics metadata -------
  const [stats, setStats] = useState(null);

  // ------ Current page and chart title list metadata -----
  const [currentPage, setCurrentPage] = useState(null);
  const [chartsTitlesList, setChartsTitlesList] = useState([]);

  const providerValue = useMemo(() => ({
    commentCounts, fetchCommentCounts, setCommentCounts,
    stats, setStats,
    currentPage, setCurrentPage,
    chartsTitlesList, setChartsTitlesList
  }), [commentCounts, stats, currentPage, chartsTitlesList]);

  // return context provider
  return (
    <MetadataContext.Provider value={providerValue}>
      {children}
    </MetadataContext.Provider>
  );
}
