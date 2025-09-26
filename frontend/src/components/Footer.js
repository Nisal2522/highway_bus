import React from "react";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Clock, Shield, Truck, Users, Award } from "lucide-react";
import TouristaLogo from "../assets/white.png";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer__main">
        <div className="footer__container">
          {/* Company Info Section */}
          <div className="footer__company">
            <div className="footer__logo">
              <img src={TouristaLogo} alt="TOURISTA" className="footer__logo-image" />
              <p className="footer__tagline">Your Journey, Our Priority</p>
            </div>
            <p className="footer__description">
              Experience seamless travel across Sri Lanka with our premium bus booking service. 
              From scenic routes to comfortable journeys, we connect you to every destination.
            </p>
            <div className="footer__features">
              <div className="footer__feature">
                <Shield className="footer__feature-icon" />
                <span>Safe Travel</span>
              </div>
              <div className="footer__feature">
                <Truck className="footer__feature-icon" />
                <span>Premium Fleet</span>
              </div>
              <div className="footer__feature">
                <Users className="footer__feature-icon" />
                <span>24/7 Support</span>
              </div>
              <div className="footer__feature">
                <Award className="footer__feature-icon" />
                <span>Best Service</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__list">
              <li><a href="/about" className="footer__link">About Us</a></li>
              <li><a href="/routes" className="footer__link">Our Routes</a></li>
              <li><a href="/fleet" className="footer__link">Our Fleet</a></li>
              <li><a href="/careers" className="footer__link">Careers</a></li>
              <li><a href="/blog" className="footer__link">Travel Blog</a></li>
            </ul>
          </div>

          {/* Quick Support */}
          <div className="footer__section">
            <h3 className="footer__title">Quick Support</h3>
            <ul className="footer__list">
              <li><a href="/help" className="footer__link">Help Center</a></li>
              <li><a href="/faqs" className="footer__link">FAQs</a></li>
              <li><a href="/contact" className="footer__link">Contact Us</a></li>
              <li><a href="/feedback" className="footer__link">Feedback</a></li>
              <li><a href="/emergency" className="footer__link">Emergency</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer__section">
            <h3 className="footer__title">Legal</h3>
            <ul className="footer__list">
              <li><a href="/terms" className="footer__link">Terms of Service</a></li>
              <li><a href="/privacy" className="footer__link">Privacy Policy</a></li>
              <li><a href="/refund" className="footer__link">Refund Policy</a></li>
              <li><a href="/cookies" className="footer__link">Cookie Policy</a></li>
              <li><a href="/accessibility" className="footer__link">Accessibility</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h3 className="footer__title">Contact Info</h3>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <MapPin className="footer__contact-icon" />
                <div>
                  <p className="footer__contact-label">Address</p>
                  <p className="footer__contact-value">123 Main Street, Colombo 01, Sri Lanka</p>
                </div>
              </div>
              <div className="footer__contact-item">
                <Phone className="footer__contact-icon" />
                <div>
                  <p className="footer__contact-label">Phone</p>
                  <p className="footer__contact-value">+94 704 222 777</p>
                </div>
              </div>
              <div className="footer__contact-item">
                <Mail className="footer__contact-icon" />
                <div>
                  <p className="footer__contact-label">Email</p>
                  <a href="mailto:hello@tourista.lk" className="footer__contact-value">hello@tourista.lk</a>
                </div>
              </div>
              <div className="footer__contact-item">
                <Clock className="footer__contact-icon" />
                <div>
                  <p className="footer__contact-label">Support Hours</p>
                  <p className="footer__contact-value">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Newsletter */}
      <div className="footer__social-section">
        <div className="footer__container">
          <div className="footer__social-content">
            <div className="footer__newsletter">
              <h4 className="footer__newsletter-title">Stay Updated</h4>
              <p className="footer__newsletter-desc">Get the latest travel updates and exclusive offers</p>
              <div className="footer__newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="footer__newsletter-input"
                />
                <button className="footer__newsletter-btn">Subscribe</button>
              </div>
            </div>
            <div className="footer__social">
              <h4 className="footer__social-title">Follow Us</h4>
              <div className="footer__social-links">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Twitter / X">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__container">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {new Date().getFullYear()} TOURISTA. All rights reserved.
            </p>
            <div className="footer__bottom-links">
              <a href="/sitemap" className="footer__bottom-link">Sitemap</a>
              <a href="/accessibility" className="footer__bottom-link">Accessibility</a>
              <a href="/security" className="footer__bottom-link">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
