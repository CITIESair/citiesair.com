import { useContext } from "react";
import PromoAlert from "./PromoAlert";
import PromoDialogBanner from "./PromoDialogBanner";
import { UserContext } from "../../ContextProviders/UserContext";

import { Stack } from "@mui/material";
import sectionData from '../../section_data.json';

const Promo = () => {
  const { user } = useContext(UserContext);
  const authenticated = user.authenticated && user.checkedAuthentication;

  const promosForBanner = sectionData.promos
    .filter((promo) => promo.isPublic || (!promo.isPublic && authenticated))
    .map((promo) => promo.banner);

  return (
    <>
      <Stack spacing={1} alignItems="center">
        {sectionData.promos.map((e, index) => {
          if (e.isPublic || (!e.isPublic && authenticated)) {
            return (
              <PromoAlert
                message={e.alertMessage}
                key={index}
              />
            );
          }
          return null;
        })}
      </Stack>

      <PromoDialogBanner promosForBanner={promosForBanner} />
    </>
  );
}

export default Promo;