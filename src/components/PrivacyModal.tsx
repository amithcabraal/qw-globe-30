import React from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

export function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close privacy policy"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Collection</h3>
            <p>
              Country Quiz collects minimal data to enhance your gaming experience. We store:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Your game statistics and scores</li>
              <li>Theme and preference settings</li>
              <li>Progress and achievements</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Storage</h3>
            <p>
              All data is stored securely using Supabase infrastructure. Your data is associated with a randomly
              generated unique identifier stored in your browser's local storage. We do not collect any personally
              identifiable information such as names, email addresses, or IP addresses.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Usage</h3>
            <p>
              The data we collect is used exclusively to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Track your game progress and statistics</li>
              <li>Remember your preferences and settings</li>
              <li>Provide personalized gaming experience</li>
              <li>Display your achievements and streaks</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Third-Party Services</h3>
            <p>
              Country Quiz uses the following third-party services:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong>REST Countries API:</strong> To fetch country information and flags</li>
              <li><strong>Supabase:</strong> For secure data storage and management</li>
            </ul>
            <p className="mt-2">
              These services may have their own privacy policies which we encourage you to review.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cookies and Local Storage</h3>
            <p>
              We use browser local storage to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Store your unique user identifier</li>
              <li>Cache country data for better performance</li>
              <li>Remember your last settings</li>
            </ul>
            <p className="mt-2">
              You can clear this data at any time through your browser settings.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Deletion</h3>
            <p>
              Your data is stored locally in your browser and remotely in our database. If you wish to delete
              your data, you can clear your browser's local storage. Remote data deletion requests can be
              accommodated by contacting support.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Children's Privacy</h3>
            <p>
              Country Quiz is suitable for all ages and does not knowingly collect personal information from
              children. We do not require any personal information to use the service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Changes to Privacy Policy</h3>
            <p>
              We may update this privacy policy from time to time. Any changes will be reflected on this page.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact</h3>
            <p>
              If you have any questions about this privacy policy or how we handle your data,
              please feel free to reach out through the app's support channels.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
