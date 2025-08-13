import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";

function HeaderSocial() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const socialLinks = [
    {
      href: "https://www.facebook.com/cociug.marina",
      icon: FaFacebookF,
      color: "#1877F2",
      name: "Facebook"
    },
    {
      href: "https://www.instagram.com/marina.cociug/",
      icon: FaInstagram,
      color: "#E1306C",
      name: "Instagram"
    },
    {
      href: "https://youtube.com",
      icon: FaYoutube,
      color: "#FF0000",
      name: "YouTube"
    },
    {
      href: "https://wa.me/37368179176",
      icon: FaWhatsapp,
      color: "#25D366",
      name: "WhatsApp"
    },
    {
      href: "https://t.me/+MqS0PFqPb8UyZjcy",
      icon: FaTelegramPlane,
      color: "#0088cc",
      name: "Telegram"
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {socialLinks.map((social, index) => {
        const IconComponent = social.icon;
        return (
          <a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              w-8 h-8 rounded-full
              flex items-center justify-center
              text-gray-500 hover:text-white
              transition-all duration-300
              transform hover:scale-110
            "
            style={{
              '--hover-bg': social.color
            }}
            aria-label={`Urmărește pe ${social.name}`}
          >
            <div 
              className="
                absolute inset-0 rounded-full 
                opacity-0 group-hover:opacity-100
                transition-all duration-300
              "
              style={{ backgroundColor: social.color }}
            ></div>
            
            <IconComponent 
              className="
                relative z-10 text-base
                transition-all duration-300
              " 
            />
          </a>
        );
      })}
    </div>
  );
}

export default HeaderSocial;