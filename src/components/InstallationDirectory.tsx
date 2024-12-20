import React from 'react';

interface InstallationDirectoryProps {
  config: {
    installDir: string;
  };
  setConfig: (config: any) => void;
}

export const InstallationDirectory: React.FC<InstallationDirectoryProps> = ({
  config,
  setConfig,
}) => {
  const handleDirectoryChange = (value: string) => {
    setConfig({
      ...config,
      installDir: value,
    });
  };

  return (
    <div className="installation-directory">
      <h2>Installation Directory</h2>
      <div className="directory-form">
        <div className="field-group">
          <label>Select where to install the components:</label>
          <input
            type="text"
            value={config.installDir}
            onChange={(e) => handleDirectoryChange(e.target.value)}
            className="directory-input"
            placeholder="C:\path\to\install\directory"
          />
          <div className="field-description">
            This is where all the components will be installed. Make sure you have write permissions for this directory.
          </div>
        </div>
      </div>
    </div>
  );
};
