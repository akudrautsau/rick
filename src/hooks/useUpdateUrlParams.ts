import useStoreContext from '@store/store.context.ts';
import { useLocation, useNavigate } from 'react-router-dom';

interface UseUpdateUrlParamsProps {
  valueName: string;
  valueStatus: string;
}

interface UpdateURLParamsOptions {
  page?: number;
  name?: string;
  status?: string;
}

export const useUpdateUrlParams = ({ valueName, valueStatus }: UseUpdateUrlParamsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { charactersStore } = useStoreContext();

  const updateURLParams = ({
    page = charactersStore.currentPage,
    name = '',
    status = '',
  }: UpdateURLParamsOptions = {}) => {
    const searchParams = new URLSearchParams(location.search);

    if (page) {
      searchParams.set('page', page.toString());
    } else {
      searchParams.delete('page');
    }

    if (name !== undefined) {
      name ? searchParams.set('name', name) : searchParams.delete('name');
    }
    if (status !== undefined) {
      status ? searchParams.set('status', status) : searchParams.delete('status');
    }

    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    });

    charactersStore.getCharactersData({
      page: page || charactersStore.currentPage,
      name: name !== undefined ? name : valueName,
      status: status !== undefined ? status : valueStatus,
    });
  };

  return { updateURLParams };
};
