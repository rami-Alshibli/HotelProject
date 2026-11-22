import type { Reservation, ReservationStatus } from "../../types";
import { XCircle } from "lucide-react";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";

interface ReservationsTableProps {
  reservations: Reservation[];
  loading: boolean;
  onCancel: (id: string) => void;
}

// دالة تحسب الحالة الفعلية: إذا كان الحجز Confirmed وتاريخ المغادرة قد مضى، تصبح CheckedOut
export function getEffectiveStatus(res: Reservation): ReservationStatus {
  if (res.status === "Confirmed") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkOutDate = new Date(res.checkOut);
    checkOutDate.setHours(0, 0, 0, 0);

    if (checkOutDate < today) {
      return "CheckedOut";
    }
  }
  return res.status;
}

export default function ReservationsTable({
  reservations,
  loading,
  onCancel,
}: ReservationsTableProps) {
  if (loading || reservations.length === 0) {
    return (
      <EmptyState
        loading={loading}
        loadingText="Loading reservations..."
        emptyText="No reservations found."
      />
    );
  }

  const getRoomDisplay = (roomId: Reservation["roomId"]) => {
    if (typeof roomId === "object" && roomId !== null && "roomNumber" in roomId) {
      return `#${roomId.roomNumber} (${roomId.roomType})`;
    }
    return `#${String(roomId).slice(-5)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs uppercase tracking-wider">
          <tr>
            <th className="p-4 font-semibold">Customer Name</th>
            <th className="p-4 font-semibold">Phone</th>
            <th className="p-4 font-semibold">Room</th>
            <th className="p-4 font-semibold">Check-In</th>
            <th className="p-4 font-semibold">Check-Out</th>
            <th className="p-4 font-semibold">Nights</th>
            <th className="p-4 font-semibold">Total Price</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {reservations.map((res) => {
            const effectiveStatus = getEffectiveStatus(res);

            return (
              <tr key={res._id} className="hover:bg-slate-50/80 transition">
                <td className="p-4 font-semibold text-slate-900">
                  {res.customerFullName}
                </td>
                <td className="p-4 text-slate-600">{res.customerPhone}</td>
                <td className="p-4 font-bold text-slate-800">
                  {getRoomDisplay(res.roomId)}
                </td>
                <td className="p-4 text-slate-700">
                  {new Date(res.checkIn).toLocaleDateString("en-US")}
                </td>
                <td className="p-4 text-slate-700">
                  {new Date(res.checkOut).toLocaleDateString("en-US")}
                </td>
                <td className="p-4 text-slate-700">{res.nights}</td>
                <td className="p-4 font-bold text-indigo-600">
                  ${res.totalPrice}
                </td>
                <td className="p-4">
                  <Badge label={effectiveStatus} />
                </td>
                <td className="p-4 text-right">
                  {effectiveStatus === "Confirmed" ? (
                    <button
                      onClick={() => onCancel(res._id)}
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold text-xs transition cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}