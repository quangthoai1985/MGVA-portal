import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../context/ToastContext';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    childName: '',
    childAge: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('registration-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('vi-VN') // Simple date for display
      });
      showToast('Gửi thông tin thành công! Nhà trường sẽ liên hệ sớm nhất.', 'success');
      setFormData({
        parentName: '',
        phone: '',
        email: '',
        childName: '',
        childAge: '',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      showToast('Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-section">
      {/* Orange CTA Banner */}
      <section className="bg-brand-500 py-20 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-300 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-semibold mb-6">
            <Clock className="w-4 h-4 fill-current" />
            <span>Tuyển sinh 2024-2025</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Ba mẹ đã sẵn sàng cho bé gia nhập <br className="hidden md:block" /> gia đình Vàng Anh?
          </h2>

          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-10 font-medium">
            Đăng ký ngay để được tư vấn miễn phí và tham quan cơ sở vật chất của trường. Chúng tôi luôn sẵn sàng đồng hành cùng bé!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="white"
              size="lg"
              onClick={scrollToForm}
              className="gap-2 shadow-xl shadow-brand-600/20"
            >
              <Phone className="w-5 h-5" />
              Đăng ký tư vấn ngay
            </Button>
            <Button
              variant="outline-white"
              size="lg"
              className="gap-2"
              onClick={() => window.location.href = 'tel:0901234567'}
            >
              <Phone className="w-5 h-5" />
              090 123 4567
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="registration-form" className="py-24 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-block bg-sky-100 text-sky-600 px-4 py-1.5 rounded-lg font-bold text-sm">
                Liên hệ
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
                Để lại thông tin, chúng tôi sẽ liên hệ ngay!
              </h2>
              <p className="text-gray-600 text-lg">
                Điền form bên dưới hoặc liên hệ trực tiếp qua hotline. Đội ngũ tư vấn sẽ phản hồi trong vòng 24 giờ.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Địa chỉ</h4>
                    <p className="text-gray-600">123 Đường Hạnh Phúc, Quận 1, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Điện thoại</h4>
                    <p className="text-gray-600">090 123 4567 - 028 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@vanganh.edu.vn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Parent Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Họ tên phụ huynh *</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Số điện thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="090 123 4567"
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Child Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Tên bé</label>
                      <input
                        type="text"
                        name="childName"
                        value={formData.childName}
                        onChange={handleChange}
                        placeholder="Bé Bi"
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                    {/* Child Age */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Tuổi của bé</label>
                      <select
                        name="childAge"
                        value={formData.childAge}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-600 bg-white cursor-pointer hover:bg-gray-50"
                      >
                        <option value="">Chọn độ tuổi</option>
                        <option>12 - 18 tháng</option>
                        <option>18 - 24 tháng</option>
                        <option>2 - 3 tuổi</option>
                        <option>3 - 4 tuổi</option>
                        <option>4 - 5 tuổi</option>
                        <option>5 - 6 tuổi</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Lời nhắn</label>
                    <textarea
                      rows={3}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ba mẹ muốn biết thêm điều gì về trường?"
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    className="shadow-brand-500/25 shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi yêu cầu tư vấn'
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};