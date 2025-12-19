# Promo UI Components

> This folder contains UI components for promotional banners to promote new features of CITIESair to users.

### [Promo.jsx](./Promo.jsx): 

  This component encapsulates the two components below into one single component to be called in the [Header.jsx](/src/Components/Header/Header.jsx).

  It assesses [section_data.json](/src/section_data.json) and iterates though `promos` object to display the appropriate:
    - `PromoAlert`: for all `promos` in the json file
    - `PromoDialogBanner`: for only `promos` that have not been shown before, aka those that are not in the `hiddenPromos` array in `localStorage`

### [PromoAlert.jsx](./PromoAlert.jsx): 

  Just a simple `MUI Alert` on the top of the page to remind users of the new features. Can be closed with the `x` button.

  ![promo-alert](/documentation/promo-alert.png)

### [PromoDialogBanner.jsx](./PromoDialogBanner.jsx): 

  A prominent dialog banner that shows up the first time a user visits CITIESair. It contains a blue `MUI Chip`, a title, a subtitle, and an illustrative image for each feature. The user must click `CLOSE AND DON'T SHOW THIS BANNER AGAIN` at the bottom of the banner to close it; clicking outside the banner does not close it. This will also add the visible promos' `id` to `hiddenPromos` in `localStorage` to not show it/them again in the future.
  
  This design choice is justified by the fact that we only want to show each promo once to the user. This component makes use of [PreferenceContext.jsx](/src/ContextProviders/PreferenceContext.jsx) to implement the design choice. When a new promo is added to [section_data.json](/src/section_data.json), it will be shown, but not those that have been shown before.

  ![promo-dialog-banner](/documentation/promo-dialog-banner.png)