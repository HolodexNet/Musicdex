import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { persistWithIndexedDB } from "./persist/idb-persist-engine";
const queryCache = new QueryCache();
const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    // options here
  },
});
persistWithIndexedDB(queryClient);
export { queryClient, queryCache, QueryClientProvider };
