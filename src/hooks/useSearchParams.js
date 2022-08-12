import { useCallback, useMemo, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export function useSearchParams(defaultInit) {
  let defaultSearchParamsRef = useRef(createSearchParams(defaultInit));

  let location = useLocation();
  let searchParams = useMemo(() => {
    let searchParams = createSearchParams(location.search);

    for (let key of defaultSearchParamsRef.current.keys()) {
      if (!searchParams.has(key)) {
        defaultSearchParamsRef.current.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    }

    return searchParams;
  }, [location.search]);

  let { push: navigate } = useHistory();
  let setSearchParams = useCallback(
    (nextInit, navigateOptions) => {
      navigate('?' + createSearchParams(nextInit), navigateOptions);
    },
    [navigate]
  );

  return [searchParams, setSearchParams];
}

export function createSearchParams(init = '') {
  return new URLSearchParams(
    typeof init === 'string' ||
    Array.isArray(init) ||
    init instanceof URLSearchParams
      ? init
      : Object.keys(init).reduce((memo, key) => {
          let value = init[key];
          return memo.concat(
            Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]
          );
        }, [])
  );
}
