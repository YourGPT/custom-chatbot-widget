export type TriggerItemD = {
  id: number;
  status: "1" | "0";
  name: string;
  data?: {
    event?: string;
    conditions?: any;
    actions?: any;
  } | null;
};
