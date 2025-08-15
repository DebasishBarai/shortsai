import axios from "axios";
import { atom, selector } from "recoil";

// initializing axios
const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
});

// creditState
export const creditState = atom<number>({
  key: "creditState",
  default: selector({
    key: "creditSelectorState",
    get: async () => {
      try {
        const res = await api.request({
          url: "/api/get-credits",
          method: "POST",
        })
        if (res.status !== 200) {
          return 0;
        }
        const credit = res.data.currentCredits
        console.log({ credit })
        return credit || 0
      } catch (error) {
        console.log(error);
        return 0
      }
    }
  }),
});
