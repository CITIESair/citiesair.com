import { useContext } from "react";
import PromoAlert from "./PromoAlert";
import PromoDialogBanner from "./PromoDialogBanner";
import { UserContext } from "../../ContextProviders/UserContext";

import { Stack } from "@mui/material";
import sectionData from '../../section_data.json';
import { PreferenceContext } from "../../ContextProviders/PreferenceContext";
import { isValidArray } from "../../Utils/UtilFunctions";

const Promo = () => {
  const { user } = useContext(UserContext);
  const authenticated = user.authenticated && user.checkedAuthentication;

  const { hiddenPromos } = useContext(PreferenceContext);

  const promosForBanner = sectionData.promos
    .filter((promo) => promo.isPublic || (!promo.isPublic && authenticated)) // only show promo depends on if it is public or private
    .filter((promo) => !hiddenPromos.includes(promo.id)) // only show promo not hidden before
    .map((promo) => {
      return {
        ...promo.banner,
        id: promo.id
      }
    });

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

      {
        isValidArray(promosForBanner) ? <PromoDialogBanner promosForBanner={promosForBanner} /> : null
      }
    </>
  );
}

export default Promo;