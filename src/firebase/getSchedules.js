import { app } from "./index";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const storage = getStorage(app);
export const schedulesURL = getDownloadURL(ref(storage, "schedules.json"));
