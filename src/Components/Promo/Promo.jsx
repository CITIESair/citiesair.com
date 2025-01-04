import { useContext } from "react";
import PromoAlert from "./PromoAlert";
import PromoDialogBanner from "./PromoDialogBanner";
import { UserContext } from "../../ContextProviders/UserContext";

import { Stack } from "@mui/material";
import sectionData from '../../section_data.json';
import { PreferenceContext } from "../../ContextProviders/PreferenceContext";
import { isValidArray } from "../../Utils/UtilFunctions";

const Promo = () => {
  const { authenticationState } = useContext(UserContext);
  const authenticated = authenticationState.authenticated && authenticationState.checkedAuthentication;

  const { hiddenPromos } = useContext(PreferenceContext);

  const promosForBanner = sectionData.promos
    .filter((promo) => !promo.expired) // only show non-expired promo
    .filter((promo) => promo.isPublic || (!promo.isPublic && authenticated)) // only show promo depends on if it is public or private
    .filter((promo) => !hiddenPromos.includes(promo.id)) // only show promo not hidden before
    .map((promo) => {
      return {
        ...promo.banner,
        id: promo.id
      }
    });

  const promoStack = sectionData.promos.filter((promo) => !promo.expired);

  return (
    <>
      {
        promoStack.length > 0 ?
          (
            <Stack spacing={1} alignItems="center" sx={{ pt: 2 }}>
              {promoStack.map((e, index) => {
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
          ) : null
      }

      {
        isValidArray(promosForBanner) ? <PromoDialogBanner promosForBanner={promosForBanner} /> : null
      }
    </>
  );
}

export default Promo;