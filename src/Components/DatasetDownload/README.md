# Dataset Download

This directory contains components essential to the Dataset Download functionality.

![dataset-download-dialog](/documentation/dataset-download-dialog.png)

[DatasetDownloadDialog.jsx](DatasetDownloadDialog.jsx) facilitates user interaction with the raw datasets, including dataset types (`hourly` or `daily`) and previews.

**Key Features:**

- **Nested Components**: Incorporates several nested components for a cohesive experience, including `DatasetSelectorAndPreviewer` and `DatasetsTable`.
- **Initial Display and Interaction**: On initial dialog opening, displays a preview of `hourly` dataset of the first sensor, updating as users select different sensors or dataset types.
- **Optimized Downloading**: Implements Blob for direct downloads without needing to redirect users or re-fetch data, enhancing efficiency.