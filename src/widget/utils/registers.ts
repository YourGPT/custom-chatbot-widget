import { StorageManager } from "./storage";

export const registerVisitCount = (widgetUid: string) => {
  const st = StorageManager.getStorage(widgetUid);
  const newVisitCount = st?.visitCount ? st.visitCount + 1 : 1;
  StorageManager.setStorage({ widgetUid, visitCount: newVisitCount });
};
