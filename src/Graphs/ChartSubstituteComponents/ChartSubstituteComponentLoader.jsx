import { lazy, Suspense } from 'react';
import LoadingAnimation from '../../Components/LoadingAnimation';

export default function ChartSubstituteComponentLoader({ chartSubstituteComponentName }) {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      {(() => {
        const ChartSubstituteComponent = lazy(
          () => import(`./${chartSubstituteComponentName}`)
        );
        return <ChartSubstituteComponent />;
      })()}
    </Suspense>
  );
}
