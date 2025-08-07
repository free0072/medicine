import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Users, Lock } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to registration</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Welcome to our online pharmacy platform. These Terms and Conditions govern your use of our website and services. 
              By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of these terms, 
              please do not use our services.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Eligibility</h3>
            <div className="space-y-3 text-gray-700">
              <p>To use our services, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 18 years old</li>
                <li>Have a valid prescription for prescription medications</li>
                <li>Provide accurate and complete information</li>
                <li>Reside in a jurisdiction where our services are available</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          {/* Prescription Requirements */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Prescription Requirements</h3>
            <div className="space-y-3 text-gray-700">
              <p>For prescription medications:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must provide a valid prescription from a licensed healthcare provider</li>
                <li>Prescriptions must be current and not expired</li>
                <li>We reserve the right to verify prescriptions with healthcare providers</li>
                <li>Prescription medications will only be dispensed after verification</li>
                <li>We may refuse to fill prescriptions that appear fraudulent or inappropriate</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Security */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Privacy and Security</h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>We are committed to protecting your privacy and security:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All personal and medical information is encrypted and secure</li>
                <li>We comply with HIPAA and other applicable privacy laws</li>
                <li>Your information is never shared with third parties without consent</li>
                <li>We use industry-standard security measures to protect your data</li>
                <li>You can review and update your information at any time</li>
              </ul>
            </div>
          </section>

          {/* Order and Payment */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Orders and Payment</h3>
            <div className="space-y-3 text-gray-700">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All prices are subject to change without notice</li>
                <li>Payment is required at the time of order</li>
                <li>We accept major credit cards and other secure payment methods</li>
                <li>Orders are processed in the order received</li>
                <li>We reserve the right to cancel orders for any reason</li>
                <li>Shipping costs and delivery times may vary</li>
              </ul>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Returns and Refunds</h3>
            <div className="space-y-3 text-gray-700">
              <p>Due to the nature of pharmaceutical products:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Prescription medications cannot be returned once dispensed</li>
                <li>Over-the-counter products may be returned within 30 days if unopened</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>Damaged or defective products will be replaced or refunded</li>
                <li>Shipping costs for returns are the responsibility of the customer</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Disclaimers</h3>
            <div className="space-y-3 text-gray-700">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We do not provide medical advice or diagnosis</li>
                <li>Consult with your healthcare provider for medical questions</li>
                <li>We are not responsible for adverse reactions to medications</li>
                <li>Product information is for educational purposes only</li>
                <li>We make no warranties about product effectiveness or safety</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              Our liability is limited to the amount paid for the specific product or service. 
              We are not liable for indirect, incidental, or consequential damages. 
              This limitation applies to the fullest extent permitted by law.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to Terms</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-2">
                If you have questions about these terms, please contact us:
              </p>
              <div className="space-y-1 text-gray-600">
                <p>Email: legal@pharmacy.com</p>
                <p>Phone: 1-800-PHARMACY</p>
                <p>Address: 123 Pharmacy Street, Healthcare City, HC 12345</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shield className="h-4 w-4" />
            <span>I Accept These Terms</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms; 