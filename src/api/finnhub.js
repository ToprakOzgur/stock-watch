import axios from "axios";
import { TOKEN } from "../keys";

export default axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: {
    token: TOKEN,
  },
});
