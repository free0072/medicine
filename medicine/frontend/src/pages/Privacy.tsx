import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Bell } from 'lucide-react';

const Privacy: React.FC = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Your Privacy Matters</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We are committed to protecting your privacy and ensuring the security of your personal and health information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              online pharmacy platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Information We Collect</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Date of birth and gender</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely)</li>
                  <li>Account credentials</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Health Information</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Prescriptions and medical history</li>
                  <li>Allergies and medical conditions</li>
                  <li>Medication preferences</li>
                  <li>Health insurance information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-semibold text-gray-900">Data Security</h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>We implement comprehensive security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of all sensitive data in transit and at rest</li>
                <li>Secure servers and data centers</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Compliance with HIPAA and other regulations</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Contact Us</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-2">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-1 text-gray-600">
                <p>Email: privacy@pharmacy.com</p>
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
            <span>I Accept This Privacy Policy</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 