import type { PaymentSimulationStatus, TaskStatus } from "./types";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  OPEN: "Open",
  ASSIGNED: "Assigned",
  EVIDENCE_SUBMITTED: "Evidence Submitted",
  REVISION_REQUESTED: "Revision Requested",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
export const PAYMENT_LABEL: Record<PaymentSimulationStatus, string> = {
  NOT_HELD: "Not held",
  HELD_SIMULATED: "Held",
  RELEASED_SIMULATED: "Released",
  VOIDED_SIMULATED: "Voided",
};
export const CATEGORY_LABEL = { VEHICLE_PHOTO_CHECK: "Vehicle photo check" } as const;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Istanbul" });
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });
export const formatMoney = (n: number) => `₺${n.toLocaleString("en-GB")}`;
