import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { translations } from "../utils/translations";
import type { Language } from "../utils/translations";
import {
  Globe,
  Bot,
  Shield,
  ArrowLeft,
  MessageCircle,
  Users,
  Calendar,
  CheckCircle,
  Stethoscope,
  Heart,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface User {
  email: string;
  name: string;
}

interface MainLandingProps {
  language: Language;
  user?: User | null;
  onBack: () => void;
  onStartChat: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onShowBookings: () => void;
}

export function MainLanding({
  language,
  user,
  onBack,
  onStartChat,
  onLogin,
  onLogout,
  onShowBookings,
}: MainLandingProps) {
  const t = translations[language];

  const features = [
    {
      icon: Globe,
      title: t.main.features.multilingual.title,
      description: t.main.features.multilingual.description,
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Bot,
      title: t.main.features.ai.title,
      description: t.main.features.ai.description,
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Shield,
      title: t.main.features.secure.title,
      description: t.main.features.secure.description,
      color: "text-green-600 bg-green-100",
    },
    {
      icon: Stethoscope,
      title: t.main.features.translation.title,
      description: t.main.features.translation.description,
      color: "text-pink-600 bg-pink-100",
    },
    {
      icon: Star,
      title: t.main.features.quality.title,
      description: t.main.features.quality.description,
      color: "text-yellow-600 bg-yellow-100",
    },
  ];

  const steps = [
    {
      number: "01",
      title: t.main.process.step1.title,
      description: t.main.process.step1.description,
      icon: Users,
    },
    {
      number: "02",
      title: t.main.process.step2.title,
      description: t.main.process.step2.description,
      icon: Stethoscope,
    },
    {
      number: "03",
      title: t.main.process.step3.title,
      description: t.main.process.step3.description,
      icon: Calendar,
    },
    {
      number: "04",
      title: t.main.process.step4.title,
      description: t.main.process.step4.description,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    {t.title}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {language === "ko" && "한국어"}
                {language === "en" && "English"}
                {language === "vi" && "Tiếng Việt"}
              </Badge>

              {user ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={onShowBookings}
                    className="gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    {t.buttons.myBookings}
                  </Button>
                  <Button variant="outline" onClick={onLogout}>
                    {t.buttons.logout}
                  </Button>
                  <Button onClick={onStartChat} className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {t.main.hero.startBooking}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={onLogin}>
                    {t.buttons.login}
                  </Button>
                  <Button onClick={onStartChat} className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {t.main.hero.startBooking}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                  {t.subtitle}
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                    {t.main.hero.title}
                    <br />
                    <span className="text-blue-600">
                      {t.main.hero.titleHighlight}
                    </span>
                  </h1>
                </div>
                <p className="text-lg text-slate-600 max-w-lg">
                  {t.main.hero.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={onStartChat}
                  size="lg"
                  className="gap-2 px-8 py-6 text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t.main.hero.startBooking}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg"
                  onClick={() => {
                    const featuresSection = document.getElementById("features");
                    featuresSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {t.main.hero.learnMore}
                </Button>
              </div>

              {/* Stats */}
              {/* 특별 기능 강조 */}
              <div className="flex flex-wrap gap-3 pt-6">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                  {t.main.hero.nationwide}
                </Badge>
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 px-3 py-1">
                  {t.main.hero.translation}
                </Badge>
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
                  ⭐ {language === "ko" && "엄선된 병원"}
                  {language === "en" && "Selected Hospitals"}
                  {language === "vi" && "Bệnh viện Tuyển chọn"}
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-500">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">3+</div>
                  <div className="text-sm text-slate-500">Languages</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://i.ibb.co/twYPGhcg/med.jpg"
                  alt="Modern hospital"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/10"></div>
              </div>

              {/* Floating card */}
              <Card className="absolute -bottom-6 -left-6 p-4 bg-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Fast Booking</p>
                    <p className="text-sm text-slate-500">2-3 minutes</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t.main.features.title}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-16 h-16 rounded-full ${feature.color} mx-auto mb-4 flex items-center justify-center`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          {/* 추가 기능 강조 카드 */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === "ko" &&
                    "언어가 걱정되시나요? 진료과를 모르시나요?"}
                  {language === "en" &&
                    "Worried about language barrier? Unsure which department?"}
                  {language === "vi" &&
                    "Lo lắng về rào cản ngôn ngữ? Không biết khoa nào?"}
                </h3>
                <p className="text-slate-700 max-w-2xl mx-auto leading-relaxed">
                  {language === "ko" &&
                    "안심하세요! AI가 아닌 실제 대기중인 전문 상담사가 고객님과 직접 소통하며 정확한 예약 처리와 함께 의사에게 보여드릴 완벽한 한국어 메모를 작성해 드립니다. 전국 어디서나 서비스 이용이 가능합니다."}
                  {language === "en" &&
                    "Don't worry! Real professional consultants (not just AI) are standing by to communicate directly with you, ensuring accurate appointment processing and creating perfect Korean memo to show to doctors. Service available nationwide across Korea."}
                  {language === "vi" &&
                    "Đừng lo lắng! Các chuyên viên tư vấn thật (không chỉ AI) đang chờ sẵn để giao tiếp trực tiếp với bạn, đảm bảo xử lý đặt lịch chính xác và tạo ghi chú tiếng Hàn hoàn hảo để trình bác sĩ. Dịch vụ có sẵn trên toàn quốc Hàn Quốc."}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t.main.process.title}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t.main.process.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-slate-200 -translate-x-1/2 z-0"></div>
                )}

                <Card className="p-6 text-center relative z-10 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center relative">
                    <span className="font-bold text-lg">{step.number}</span>
                    <step.icon className="w-6 h-6 absolute -bottom-2 -right-2 bg-white text-blue-600 rounded-full p-1" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              {language === "ko" &&
                `${t.botName}와 함께 의료 예약을 시작하세요`}
              {language === "en" &&
                `Start Your Medical Appointment with ${t.botName} Today`}
              {language === "vi" &&
                `Bắt đầu Đặt lịch Y tế với ${t.botName} ngay hôm nay`}
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {language === "ko" &&
                `${t.botName}가 정보 수집을 도와드리고 전문 상담사가 엄선된 믿을만한 병원으로 정확한 예약 처리와 한국어 메모 작성까지! 2-3분만 투자하세요!`}
              {language === "en" &&
                `${t.botName} helps collect information while professional consultants handle accurate booking at carefully selected trusted hospitals and Korean memo creation! Just 2-3 minutes investment!`}
              {language === "vi" &&
                `${t.botName} hỗ trợ thu thập thông tin trong khi chuyên viên xử lý đặt lịch chính xác tại các bệnh viện được tuyển chọn đáng tin cậy và tạo ghi chú tiếng Hàn! Chỉ mất 2-3 phút!`}
            </p>
            <Button
              onClick={onStartChat}
              size="lg"
              variant="secondary"
              className="gap-2 px-8 py-6 text-lg bg-white text-blue-600 hover:bg-blue-50"
            >
              <MessageCircle className="w-5 h-5" />
              {t.main.hero.startBooking}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-blue-500" />
              <span className="font-semibold text-white">{t.title}</span>
            </div>
            <p className="text-slate-400 max-w-md mx-auto">
              {language === "ko" &&
                "외국인 환자를 위한 안전하고 신뢰할 수 있는 의료 예약 서비스"}
              {language === "en" &&
                "Safe and reliable medical appointment service for international patients"}
              {language === "vi" &&
                "Dịch vụ đặt lịch y tế an toàn và đáng tin cậy cho bệnh nhân quốc tế"}
            </p>
            <div className="pt-8 border-t border-slate-800">
              <p className="text-sm text-slate-500">
                © 2025 Medical Booking System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <Button
        onClick={onStartChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
