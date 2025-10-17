import { useState, createContext, useMemo } from 'react';

// Temporarily not using HyvorTalk comment anymore
// import { fetchDataFromURL } from '../API/ApiFetch';
// import { HYVOR_API_URL } from '../Utils/GlobalVariables';

export const MetadataContext = createContext();

export function MetadataProvider({ children }) {
  // Temporarily not using HyvorTalk comment anymore
  // ------ Hyvor Talk's comment section metadata ------
  // const [commentCounts, setCommentCounts] = useState(null);

  // const fetchCommentCounts = async () => {
  //   const commentCountsForAllPages = {};
  //   try {
  //     const data = await fetchDataFromURL({
  //       url: HYVOR_API_URL,
  //       needsAuthorization: false,
  //       includesContentTypeHeader: false
  //     });
  //     data.forEach((item) => {
  //       commentCountsForAllPages[item.identifier] = item.comments_count;
  //     });
  //     return commentCountsForAllPages;
  //   } catch (error) {
  //     console.log('Error fetching comment counts data:', error);
  //     return commentCountsForAllPages;
  //   }
  // };

  // ------ Current page and chart title list metadata -----
  const [currentPage, setCurrentPage] = useState(null);
  const [chartsTitlesList, setChartsTitlesList] = useState([]);

  const providerValue = useMemo(() => ({
    // commentCounts, fetchCommentCounts, setCommentCounts,
    currentPage, setCurrentPage,
    chartsTitlesList, setChartsTitlesList
  }), [
    // Temporarily not using HyvorTalk comment anymore
    // commentCounts, 
    currentPage, chartsTitlesList]);

  // return context provider
  return (
    <MetadataContext.Provider value={providerValue}>
      {children}
    </MetadataContext.Provider>
  );
}
