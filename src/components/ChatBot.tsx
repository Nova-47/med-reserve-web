import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { translations } from "../utils/translations";
import type { Language } from "../utils/translations";
import { Send, User, ArrowLeft, Check } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { BookingsAPI } from "../api";
import {
  langLabelToCode,
  deptLabelToCode,
  timeLabelToSlot,
  type SlotCode,
  type DeptCode,
  type LangCode,
} from "../utils/chatbot-helpers";
import type { CreateBookingReq } from "../../type";

interface User {
  email: string;
  name: string;
}

interface ChatBotProps {
  language: Language;
  user?: User | null;
  onBack: () => void;
}

interface AppointmentData {
  name?: string;
  phone?: string;
  symptoms?: string;
  department?: string; // ← 라벨 저장
  location?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // ← 라벨 저장
  language?: string; // ← 라벨 저장
}

interface Message {
  type: "bot" | "user";
  content: string;
  timestamp: Date;
}

type ChatStep =
  | "welcome"
  | "name"
  | "phone"
  | "department"
  | "symptoms"
  | "location"
  | "date"
  | "time"
  | "language"
  | "confirmation"
  | "complete";

export function ChatBot({ language, user, onBack }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ChatStep>("welcome");
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({});
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const t = translations[language];

  const toLocalYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const startOfLocalDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const isPastDay = (date: Date) => {
    const today = startOfLocalDay(new Date());
    return startOfLocalDay(date) < today || date < new Date("1900-01-01");
  };

  useEffect(() => {
    const tLocal = translations[language];

    if (!user) {
      addBotMessage(
        language === "ko"
          ? "안녕하세요! 예약을 진행하려면 먼저 매직 링크 인증이 필요합니다. 인증 후 다시 시도해주세요."
          : language === "en"
          ? "Hello! Magic link authentication is required to proceed with booking. Please authenticate and try again."
          : "Xin chào! Cần xác thực Magic Link để tiếp tục đặt lịch. Vui lòng xác thực và thử lại."
      );
      return;
    }

    addBotMessage(tLocal.chat.welcome);
    const timer = setTimeout(() => {
      setCurrentStep("name");
      addBotMessage(tLocal.chat.askName);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      if (currentStep === "symptoms") {
        textRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  }, [currentStep, isLoading]);

  const addBotMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { type: "bot", content, timestamp: new Date() },
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", content, timestamp: new Date() },
    ]);
  };

  const handleNext = async () => {
    const hasValidInput =
      currentStep === "date" ? selectedDate : inputValue.trim();
    if (!hasValidInput && currentStep !== "confirmation") return;

    setIsLoading(true);

    // 채팅 말풍선: 항상 라벨/표시값으로
    if (currentStep !== "confirmation") {
      const messageContent =
        currentStep === "date" && selectedDate
          ? toLocalYMD(selectedDate)
          : inputValue;
      addUserMessage(messageContent);
    }

    const newData = { ...appointmentData };

    switch (currentStep) {
      case "name":
        newData.name = inputValue;
        setAppointmentData(newData);
        setTimeout(() => {
          setCurrentStep("phone");
          addBotMessage(t.chat.askPhone);
          setIsLoading(false);
        }, 500);
        break;

      case "phone":
        newData.phone = inputValue;
        setAppointmentData(newData);
        setTimeout(() => {
          setCurrentStep("department");
          addBotMessage(t.chat.askDepartment);
          setIsLoading(false);
        }, 500);
        break;

      case "department":
        newData.department = inputValue; // 라벨 저장
        setAppointmentData(newData);
        setTimeout(() => {
          setCurrentStep("symptoms");
          addBotMessage(t.chat.askSymptoms);
          setIsLoading(false);
        }, 500);
        break;

      case "symptoms":
        newData.symptoms = inputValue;
        setAppointmentData(newData);
        setTimeout(() => {
          setCurrentStep("location");
          addBotMessage(t.chat.askLocation);
          setIsLoading(false);
        }, 500);
        break;

      case "location":
        newData.location = inputValue;
        setAppointmentData(newData);
        setTimeout(() => {
          setCurrentStep("date");
          addBotMessage(t.chat.askDate);
          setIsLoading(false);
        }, 500);
        break;

      case "date":
        if (selectedDate) {
          newData.date = toLocalYMD(selectedDate); // YYYY-MM-DD
          setAppointmentData(newData);
        }
        setTimeout(() => {
          setCurrentStep("time");
          addBotMessage(t.chat.askTime);
          setIsLoading(false);
        }, 500);
        break;

      case "time":
        newData.time = inputValue; // 라벨 저장
        setAppointmentData(newData);
        setTimeout(() => {
          setCurrentStep("language");
          addBotMessage(t.chat.askLanguage);
          setIsLoading(false);
        }, 500);
        break;

      case "language":
        newData.language = inputValue; // 라벨 저장
        setAppointmentData(newData);
        setTimeout(() => {
          setCurrentStep("confirmation");
          addBotMessage(t.chat.confirmation);
          setIsLoading(false);
        }, 500);
        break;

      case "confirmation":
        if (user) {
          try {
            // ⚠️ 서버 전송 직전에만 코드로 변환
            const payload: CreateBookingReq = {
              name: newData.name ?? "",
              phone: newData.phone ?? "",
              email: user?.email ?? "",
              symptom_note: newData.symptoms ?? "",
              preferred_date: newData.date ?? "",
              preferred_time_slot: timeLabelToSlot(
                newData.time ?? ""
              ) as SlotCode,
              language: langLabelToCode(newData.language ?? "") as LangCode,
              city: newData.location ?? "",
              department: deptLabelToCode(
                newData.department ?? "",
                language
              ) as DeptCode,
            };
            await BookingsAPI.create(payload);
          } catch {
            setIsLoading(false);
            addBotMessage(
              language === "ko"
                ? "예약 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                : language === "en"
                ? "Failed to save your booking. Please try again."
                : "Lưu lịch hẹn thất bại. Vui lòng thử lại."
            );
            return;
          }
        }

        setTimeout(() => {
          setCurrentStep("complete");
          addBotMessage(t.chat.complete);
          setIsLoading(false);
        }, 500);
        break;
    }

    setInputValue("");
    setSelectedDate(undefined);
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentStep("welcome");
    setAppointmentData({});
    setInputValue("");
    setSelectedDate(undefined);

    setTimeout(() => {
      addBotMessage(t.chat.welcome);
      setTimeout(() => {
        setCurrentStep("name");
        addBotMessage(t.chat.askName);
      }, 1000);
    }, 100);
  };

  const renderInput = () => {
    if (!user) {
      return (
        <div className="text-center py-4">
          <Button onClick={onBack} className="w-full">
            {language === "ko" && "매직 링크 인증하기"}
            {language === "en" && "Magic Link Authentication"}
            {language === "vi" && "Xác thực Magic Link"}
          </Button>
        </div>
      );
    }

    if (currentStep === "complete") {
      return (
        <div className="flex gap-2">
          <Button onClick={handleRestart} variant="outline" className="flex-1">
            {t.buttons.restart}
          </Button>
          <Button onClick={onBack} className="flex-1">
            {t.buttons.confirm}
          </Button>
        </div>
      );
    }

    if (currentStep === "confirmation") {
      // 확인 화면에서는 라벨 그대로 보여줍니다.
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{t.fields.name}:</span>
                <span>{appointmentData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.fields.phone}:</span>
                <span>{appointmentData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.fields.department}:</span>
                <span>{appointmentData.department ?? ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.fields.symptoms}:</span>
                <span className="text-right max-w-48 truncate">
                  {appointmentData.symptoms}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.fields.location}:</span>
                <span className="text-right max-w-48 truncate">
                  {appointmentData.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.fields.date}:</span>
                <span>{appointmentData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.fields.time}:</span>
                <span>{appointmentData.time ?? ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.fields.language}:</span>
                <span>{appointmentData.language ?? ""}</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="flex-1"
            >
              {t.buttons.edit}
            </Button>
            <Button onClick={handleNext} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              {t.buttons.confirm}
            </Button>
          </div>
        </div>
      );
    }

    // ✅ 드롭다운들: value는 라벨, onValueChange도 라벨 그대로 저장
    if (currentStep === "department") {
      return (
        <div className="space-y-3">
          <Select
            value={inputValue}
            onValueChange={(label) => setInputValue(label)}
          >
            <SelectTrigger>
              <SelectValue placeholder="진료과를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {t.departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleNext}
            disabled={!inputValue || isLoading}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {t.buttons.send}
          </Button>
        </div>
      );
    }

    if (currentStep === "time") {
      return (
        <div className="space-y-3">
          <Select
            value={inputValue}
            onValueChange={(label) => setInputValue(label)}
          >
            <SelectTrigger>
              <SelectValue placeholder="시간대를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {t.times.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleNext}
            disabled={!inputValue || isLoading}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {t.buttons.send}
          </Button>
        </div>
      );
    }

    if (currentStep === "language") {
      return (
        <div className="space-y-3">
          <Select
            value={inputValue}
            onValueChange={(label) => setInputValue(label)}
          >
            <SelectTrigger>
              <SelectValue placeholder="언어를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {t.languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleNext}
            disabled={!inputValue || isLoading}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {t.buttons.send}
          </Button>
        </div>
      );
    }

    if (currentStep === "date") {
      return (
        <div className="space-y-3">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isPastDay}
              initialFocus
              className="w-full"
            />
          </Card>
          {selectedDate && (
            <div className="text-center p-2 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                {language === "ko" &&
                  `선택된 날짜: ${selectedDate.toLocaleDateString("ko-KR")}`}
                {language === "en" &&
                  `Selected date: ${selectedDate.toLocaleDateString("en-US")}`}
                {language === "vi" &&
                  `Ngày đã chọn: ${selectedDate.toLocaleDateString("vi-VN")}`}
              </p>
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={!selectedDate || isLoading}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {t.buttons.send}
          </Button>
        </div>
      );
    }

    if (currentStep === "symptoms") {
      return (
        <div className="space-y-3">
          <Textarea
            ref={textRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="증상을 자세히 설명해주세요..."
            className="min-h-20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleNext();
              }
            }}
          />
          <Button
            onClick={handleNext}
            disabled={!inputValue.trim() || isLoading}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {t.buttons.send}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="메시지를 입력하세요..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleNext();
            }
          }}
          disabled={isLoading}
        />
        <Button
          onClick={handleNext}
          disabled={!inputValue.trim() || isLoading}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h2>{t.botName} 🌸</h2>
            <p className="text-sm text-slate-500 mt-1">{t.title}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4">
        <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start gap-3 max-w-xs sm:max-w-md">
                  {message.type === "bot" && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src="/android-chrome-192x192.png" // 👉 favicon 경로
                        alt="Bot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white shadow-sm border"
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-xs sm:max-w-md">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="/android-chrome-192x192.png" // 👉 favicon 이미지
                      alt="Bot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-white shadow-sm border p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">{renderInput()}</div>
      </div>
    </div>
  );
}
