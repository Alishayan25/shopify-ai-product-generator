import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">
          Configure your app preferences and integrations
        </p>

        <div className="space-y-6">
          {/* API Configuration */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Endpoint
                </label>
                <input
                  type="text"
                  value={process.env.REACT_APP_API_URL}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Image Generation Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Image Generation</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-gray-700">Auto-generate multiple variations</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-gray-700">
                  Enhance image quality (may take longer)
                </span>
              </label>
            </div>
          </div>

          {/* Content Generation Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Generation</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-gray-700">
                  Generate SEO-optimized descriptions
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-gray-700">Generate meta tags</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
