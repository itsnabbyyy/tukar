import React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ExternalLink,
  Calendar,
} from "lucide-react";

export default function Footer() {
  const officeHours = [
    { day: "Sunday", hours: "Closed", closed: true },
    { day: "Monday", hours: "8 am – 5 pm", closed: false },
    { day: "Tuesday", hours: "8 am – 5 pm", closed: false },
    { day: "Wednesday", hours: "8 am – 5 pm", closed: false },
    { day: "Thursday", hours: "8 am – 5 pm", closed: false },
    { day: "Friday", hours: "8 am – 5 pm", closed: false },
    { day: "Saturday", hours: "Closed", closed: true },
  ];

  const handleMapClick = () => {
    window.open(
      "https://www.google.com/maps/place/Sabah+Shell+Petroleum+Co+Ltd/@5.9772978,116.0739937,20z/data=!3m1!5s0x323b6990c4e987eb:0xd868c9432ddb390c!4m6!3m5!1s0x323b6990c48c20c7:0xe7e7d51eaa436e5e!8m2!3d5.9772231!4d116.0747608!16s%2Fg%2F11cs5nf0w2?entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D",
      "_blank"
    );
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fafbff 0%, #f5f7ff 25%, #f0f4ff 50%, #f5f7ff 75%, #fafbff 100%)",
        color: "#2d3748",
      }}
    >
      {/* Background Elements - Removed for cleaner look */}

      <div className="relative max-w-7xl mx-auto px-8 py-24">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Information */}
          <div className="footer-section">
            <div className="bg-white/90 rounded-2xl p-8 backdrop-blur-sm border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/20 shadow-sm">
              <h3 className="text-3xl font-bold mb-8 flex items-center text-blue-600">
                <Mail className="w-6 h-6 mr-3" />
                Contact Us
              </h3>

              <div className="space-y-4">
                <div className="group">
                  <div className="flex items-center text-gray-800 hover:text-blue-700 transition-colors duration-200 cursor-pointer">
                    <Mail className="w-6 h-6 mr-4 text-blue-600" />
                    <div>
                      <p className="font-semibold text-lg mb-1">Email</p>
                      <a
                        href="mailto:Matchin.official@gmail.com.my"
                        className="text-base text-gray-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        Matchin.official@gmail.com.my
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-center text-gray-800 hover:text-green-700 transition-colors duration-200">
                    <Phone className="w-6 h-6 mr-4 text-green-600" />
                    <div>
                      <p className="font-semibold text-lg mb-1">Telephone</p>
                      <div className="text-base text-gray-600 space-y-1">
                        <p className="hover:text-green-700 transition-colors duration-200 cursor-pointer">
                          088-338771
                        </p>
                        <p className="hover:text-green-700 transition-colors duration-200 cursor-pointer">
                          088-338773
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-center text-gray-800 hover:text-green-700 transition-colors duration-200">
                    <MessageCircle className="w-6 h-6 mr-4 text-green-600" />
                    <div>
                      <p className="font-semibold text-lg mb-1">WhatsApp</p>
                      <a
                        href="https://wa.me/+60113672882"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-gray-600 hover:text-green-700 transition-colors duration-200 cursor-pointer"
                      >
                        011-36728821
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="footer-section">
            <div className="bg-white/90 rounded-2xl p-8 backdrop-blur-sm border border-gray-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/20 shadow-sm">
              <h3 className="text-3xl font-bold mb-8 flex items-center text-purple-600">
                <Clock className="w-6 h-6 mr-3" />
                Office Hours
              </h3>

              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div
                    key={schedule.day}
                    className={`flex justify-between items-center py-4 px-4 rounded-lg transition-all duration-200 hover:bg-gray-100/50 ${
                      schedule.closed ? "opacity-70" : "hover:scale-[1.02]"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3 text-gray-600" />
                      <span
                        className={`font-semibold text-lg ${
                          schedule.closed ? "text-gray-500" : "text-gray-800"
                        }`}
                      >
                        {schedule.day}
                      </span>
                    </div>
                    <span
                      className={`text-base font-semibold ${
                        schedule.closed ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="footer-section md:col-span-2 lg:col-span-1">
            <div className="bg-white/90 rounded-2xl p-8 backdrop-blur-sm border border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20 shadow-sm">
              <h3 className="text-3xl font-bold mb-8 flex items-center text-green-600">
                <MapPin className="w-6 h-6 mr-3" />
                Our Location
              </h3>

              <div className="space-y-4">
                <div className="text-gray-800">
                  <p className="font-semibold text-lg mb-3">Address</p>
                  <p className="text-base text-gray-600 leading-relaxed">
                    L2.16 - L2.18, Level 2, Plaza Shell
                    <br />
                    29, Jln Tunku Abdul Rahman
                    <br />
                    Kota Kinabalu, 88000
                    <br />
                    Kota Kinabalu, Sabah
                  </p>
                </div>

                <button
                  onClick={handleMapClick}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group text-lg"
                >
                  <MapPin className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                  Get Directions on Google Maps
                  <ExternalLink className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-section border-t border-gray-300 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Powered By */}
            <div className="flex items-center space-x-4 text-gray-600 group">
              <span className="text-lg font-medium">Powered by</span>
              <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-6 py-3 group-hover:bg-gray-200 transition-colors duration-300">
                <svg
                  className="w-6 h-6 group-hover:animate-spin"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-base font-semibold text-gray-700">
                  Gemini 2.5 Flash Image
                </span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-gray-500 text-base">
                Copyright © 2025{" "}
                <span className="text-blue-700 font-semibold">
                  MATCHIN SDN. BHD.
                </span>
                . All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
