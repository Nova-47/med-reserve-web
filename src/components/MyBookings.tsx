import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { translations } from "../utils/translations";
import type { Language } from "../utils/translations";
import {
  ArrowLeft,
  Heart,
  Calendar,
  Clock,
  User,
  MapPin,
  Stethoscope,
  MessageSquare,
  Edit3,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { BookingsAPI } from "../api";
import type { Booking } from "../../type";

interface User {
  email: string;
  name: string;
}

interface MyBookingsProps {
  language: Language;
  user: User;
  onBack: () => void;
}

type UIStatus = "pending" | "confirmed" | "completed" | "cancelled";

const mapStatus = (
  s: Booking["status"]
): "pending" | "confirmed" | "completed" | "cancelled" => {
  if (s === "contacted") return "confirmed";
  if (s === "scheduled") return "completed";
  return s;
};

export function MyBookings({ language, user, onBack }: MyBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modifyNote, setModifyNote] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const t = translations[language];

  const loadBookings = useCallback(async () => {
    try {
      // 예시: /bookings?mine=1 또는 /bookings/mine 같은 엔드포인트를 BookingsAPI.listMine로 래핑
      const list = await BookingsAPI.listMine();
      setBookings(list);
    } catch {
      setBookings([]);
      toast.error(
        language === "ko"
          ? "예약 목록을 불러오지 못했습니다."
          : language === "en"
          ? "Failed to load your bookings."
          : "Không thể tải danh sách lịch hẹn."
      );
    }
  }, [language]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    try {
      await BookingsAPI.requestCancel(
        selectedBooking.id,
        cancelReason.trim() || undefined
      );
      await loadBookings();
      toast.success(t.bookings.requestSubmitted);
      setShowCancelDialog(false);
      setSelectedBooking(null);
      setCancelReason("");
    } catch {
      toast.error(
        language === "ko"
          ? "취소 요청에 실패했습니다."
          : language === "en"
          ? "Failed to cancel the booking."
          : "Hủy lịch hẹn thất bại."
      );
    }
  };

  const handleModifyRequest = async () => {
    if (!selectedBooking || !modifyNote.trim()) return;
    try {
      await BookingsAPI.requestModify({
        bookingId: selectedBooking.id,
        note: modifyNote.trim(),
      });
      toast.success(t.bookings.requestSubmitted);
      setShowModifyDialog(false);
      setSelectedBooking(null);
      setModifyNote("");
    } catch {
      toast.error(
        language === "ko"
          ? "수정 요청에 실패했습니다."
          : language === "en"
          ? "Failed to submit a modification request."
          : "Gửi yêu cầu sửa đổi thất bại."
      );
    }
  };

  const getStatusColor = (ui: UIStatus) => {
    switch (ui) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // null/undefined 안전한 날짜 포맷터
  // null/undefined/ISO 문자열 모두 안전하게 처리
  const formatDate = (s?: string | null) => {
    if (!s) return "-";

    // 1) 먼저 JS Date로 바로 파싱 시도 (ISO datetime 대응)
    let d = new Date(s);
    if (Number.isNaN(d.getTime())) {
      // 2) 실패하면 앞 10자(YYYY-MM-DD)만 잘라 다시 시도
      const day = s.slice(0, 10); // "YYYY-MM-DD"
      const [y, m, dd] = day.split("-").map(Number);
      d = new Date(y, (m ?? 1) - 1, dd ?? 1);
    }

    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString(
      language === "ko" ? "ko-KR" : language === "en" ? "en-US" : "vi-VN",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  const slotToLabel = (slot: Booking["preferred_time_slot"]) => {
    if (slot === "morning") return t.times[0]; // 오전 (09:00-12:00)
    if (slot === "afternoon") return t.times[1]; // 오후 (14:00-17:00)
    return t.times[2]; // 상관없음
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="w-8 h-8 text-blue-600" aria-hidden="true" />
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    {t.bookings.title}
                  </h1>
                  <p className="text-sm text-slate-500">
                    안녕하세요, {user.name}님
                  </p>
                </div>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {language === "ko" && "한국어"}
              {language === "en" && "English"}
              {language === "vi" && "Tiếng Việt"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {t.bookings.noBookings}
            </h3>
            <p className="text-slate-600 mb-6">
              {language === "ko" &&
                "아직 예약하신 내역이 없습니다. 새로운 예약을 시작해보세요."}
              {language === "en" &&
                "No bookings found. Start by making a new appointment."}
              {language === "vi" &&
                "Chưa có lịch hẹn nào. Hãy bắt đầu đặt lịch mới."}
            </p>
            <Button onClick={onBack}>
              {language === "ko" && "새 예약하기"}
              {language === "en" && "Make New Booking"}
              {language === "vi" && "Đặt lịch mới"}
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              // 1) 먼저 계산
              const uiStatus: UIStatus = mapStatus(booking.status);
              // 2) 라벨 타입 안전하게 뽑기
              const statusLabel =
                t.bookings.status[uiStatus as keyof typeof t.bookings.status];

              return (
                <Card
                  key={booking.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {t.bookings.bookingId}: #
                          {String(booking.id).slice(-6).toUpperCase()}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {t.bookings.requestDate}:{" "}
                          {formatDate(booking.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* 3) 계산한 값 재사용 */}
                    <Badge className={getStatusColor(uiStatus)}>
                      {statusLabel}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{booking.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{booking.city}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">
                          {formatDate(
                            booking.preferred_date ?? booking.created_at
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">
                          {slotToLabel(booking.preferred_time_slot)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{booking.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">증상:</span>{" "}
                      {booking.symptom_note}
                    </p>
                  </div>

                  {/* 4) IIFE 제거, 위에서 계산한 uiStatus 사용 */}
                  {uiStatus === "pending" || uiStatus === "confirmed" ? (
                    <div className="flex gap-2 pt-4 border-t">
                      <Dialog
                        open={
                          showModifyDialog && selectedBooking?.id === booking.id
                        }
                        onOpenChange={setShowModifyDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {t.buttons.modify}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {t.bookings.modifyRequest}
                            </DialogTitle>
                            <DialogDescription>
                              {t.bookings.modifyNote}
                            </DialogDescription>
                          </DialogHeader>
                          <Textarea
                            value={modifyNote}
                            onChange={(e) => setModifyNote(e.target.value)}
                            placeholder="예: 날짜를 다음 주로 변경하고 싶습니다..."
                            className="min-h-20"
                          />
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowModifyDialog(false);
                                setModifyNote("");
                                setSelectedBooking(null);
                                setCancelReason("");
                              }}
                            >
                              {t.buttons.cancel}
                            </Button>
                            <Button onClick={handleModifyRequest}>
                              {t.buttons.confirm}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={
                          showCancelDialog && selectedBooking?.id === booking.id
                        }
                        onOpenChange={setShowCancelDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            {t.buttons.cancel}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {t.bookings.cancelRequest}
                            </DialogTitle>
                            <DialogDescription>
                              {t.bookings.cancelConfirm}
                            </DialogDescription>
                          </DialogHeader>

                          <Textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="취소 사유를 적어주세요 (선택)"
                            className="min-h-20"
                          />

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowCancelDialog(false);
                                setSelectedBooking(null);
                                setCancelReason("");
                              }}
                            >
                              {t.buttons.cancel}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleCancelBooking}
                            >
                              {t.buttons.confirm}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-slate-500">
                        {uiStatus === "cancelled" &&
                          (language === "ko"
                            ? "취소된 예약입니다."
                            : language === "en"
                            ? "This booking has been cancelled."
                            : "Lịch hẹn này đã bị hủy.")}
                        {uiStatus === "completed" &&
                          (language === "ko"
                            ? "완료된 예약입니다."
                            : language === "en"
                            ? "This booking has been completed."
                            : "Lịch hẹn này đã hoàn thành.")}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
