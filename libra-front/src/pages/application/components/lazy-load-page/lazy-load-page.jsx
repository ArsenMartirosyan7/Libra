import { lazy, Suspense } from 'react';

export const LazyLoadPage = ({ loader, name, fallback }) => {
  const Page = lazy(() =>
    loader()
      .then(module => module)
      .then(({ [name]: Component }) => ({ default: Component })),
  );

  return (
    <Suspense {...(fallback && { fallback })}>
      <Page />
    </Suspense>
  );
};
