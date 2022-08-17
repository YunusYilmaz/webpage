import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAuth } from 'utils/auth';

function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/features',
      '/pricing',
      '/contact',
      '/terms-and-conditions',
      '/privacy-policy',
      '/cookie-policy',
      '/faq',
      '/blog',
      '/blog/:slug',
    ];
    const path = url.split('?')[0];
    if (!getAuth() && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  return authorized && children;
}

export default RouteGuard;
