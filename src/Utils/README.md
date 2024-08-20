# Utility Files and Functions

### Overview

This directory contains utility files that provide essential functionalities and services to support the application's operations. These utilities include tracking configurations (for analytics) and general utility functions that enhance the application's features, accessibility and performance.

### Files

- **GlobalVariables.jsx, AppRoutes.jsx, LocalStorage.jsx**
  
	These files contains "dictionaries" (key-value pairs) for globally used variables to avoid hardcoding string throughout the applications.

- **Tracking.jsx**

  This file configures and helps implement user interaction tracking within the application. It is designed to configure capturing and reporting of user actions, which helps provide insights into how users interact with the application. This data is invaluable for understanding user behavior.

  **Key Features:**
  - Event listeners for user actions (clicks, page navigation, etc.).
  - Functions to log and send these interactions to analytics services.

- **Utils.jsx**

  A collection of miscellaneous utility functions that support various aspects of the application. This file serves as a toolkit for common tasks, ranging from data formatting and validation to UI helpers and performance optimizations.

	#### 1. `capitalizePhrase`

	**Purpose:** This function takes a string as input and replaces characters like "-" with " " (space), then capitalizes each word in the resulting string.

	**Implementation:**
	- The input string is split into an array of words based on spaces and hyphens as separators.
	- Each word is then capitalized (the first letter is turned to uppercase, and the rest of the word remains unchanged).
	- Finally, the array of capitalized words is joined back into a single string with spaces between words.

	#### 2. `htmlOrderedListTypeToMUIListStyle`

	**Purpose:** This object maps HTML ordered list types to their equivalent Material-UI list style types. This mapping is essential for converting plain HTML list representations into styled Material-UI components, which ensures a consistent and accessible presentation of list items across the application.

	#### 3. `StyleListItem`

	**Purpose:** This styled component customizes the appearance of `ListItem` components from Material-UI. It's specifically tailored to adjust list item markers and spacing, making list presentations more consistent with the application's design requirements.

	**Implementation:**
	- It uses the `styled` function from `@mui/material` to apply custom CSS properties to the `ListItem` component.
	- The custom styles include font size adjustments for list markers and padding settings for the list items.

	#### 4. `replacePlainHTMLWithMuiComponents`

	**Purpose:** This function dynamically replaces plain HTML elements with their corresponding Material-UI components within the application. This conversion ensures that all our components utilize our MUI-based [theme configurations](../Themes/README.md), and are accessible and responsive.

	**Implementation:**
	- It recursively parses and replaces HTML nodes with Material-UI components, such as replacing `<a>` tags with `Link`, `<ul>` and `<ol>` with `List`, and `<table>` with Material-UI's `Table` components.
	- The function uses `domToReact` from the `html-react-parser` package to convert HTML strings into React elements, facilitating the dynamic rendering of content.
	- Custom parsing logic is applied based on the node type (`a`, `ul`, `ol`, `table`, etc.), with additional styling and attributes applied to ensure the Material-UI components integrate seamlessly with the rest of the application.
	- Special handling for lists (`ul`, `ol`) includes mapping the list style type from HTML to Material-UI and customizing the rendering of list items.
	- For tables, it constructs the table header, body, and footer by mapping over the children nodes and dynamically creating `TableCell` components for each cell in the headers, rows, and footer.