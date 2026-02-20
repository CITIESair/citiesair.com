import React from 'react';
import PromoAlert from './PromoAlert';
import PromoDialogBanner from './PromoDialogBanner';

import { Stack } from '@mui/material';
import sectionData from '../../SectionData/sectionData';
import { isValidArray } from '../../Utils/UtilFunctions';
import { usePreferences } from '../../ContextProviders/PreferenceContext';
import { useUser } from '../../ContextProviders/UserContext';

const Promo: React.FC = () => {
  const { authenticationState } = useUser();
  const authenticated = authenticationState.authenticated && authenticationState.checkedAuthentication;
  const { hiddenPromos } = usePreferences();

  const promosForBanner = sectionData.promos
    .filter((promo: any) => !promo.expired) // only show non-expired promo
    .filter((promo: any) => promo.isPublic || (!promo.isPublic && authenticated)) // only show promo depends on if it is public or private
    .filter((promo: any) => !hiddenPromos.includes(promo.id)) // only show promo not hidden before
    .map((promo: any) => {
      return {
        ...promo.banner,
        id: promo.id
      }
    });

  const promoStack = sectionData.promos.filter((promo: any) => !promo.expired);

  return (
    <>
      {
        promoStack.length > 0 ?
          (
            <Stack spacing={1} alignItems="center" sx={{ pt: 2 }}>
              {promoStack.map((e: any, index: number) => {
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
