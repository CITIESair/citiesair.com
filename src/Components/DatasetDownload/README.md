# Dataset Download

This directory contains components essential to the Dataset Download functionality.

![dataset-download-dialog](/documentation/dataset-download-dialog.png)

[DatasetDownloadDialog.jsx](DatasetDownloadDialog.jsx) facilitates user interaction with the raw datasets, including dataset types (`hourly`, `daily`...) and previews.

It implements a custom React Query hooks to retrieve and cache raw dataset data, as well as Blob for direct downloads without needing to redirect users.