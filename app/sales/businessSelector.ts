import { store } from "@/lib/Providers";

export const getBusinessID = () => {
  const state = store.getState();
  const businessID = state.businessID;
  return businessID;
};
