export const returnLocationName = ({ useLocationShort, location_short, location_long }) => {
    return useLocationShort ? (location_short || 'N/A') : (location_long || 'No Location Name');
};
