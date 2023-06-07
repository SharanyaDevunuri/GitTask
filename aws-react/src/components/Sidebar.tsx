import React from "react";
import "./Sidebar.css";

interface Props {
  handleButtonClick: (buttonName: string) => void;
  selectedButton: string | null;
}

const Sidebar: React.FC<Props> = ({ handleButtonClick, selectedButton }) => {
  const buttons = [
    // "Login",
    "Request EC2",

    // 'Security Group',
    // 'VPC',
    // 'VPN Gateway',
    // 'EFS',
    // 'S3 Glacier',
    // 'Load Balancer',
    // 'ECS',
    // 'EKS'
    "Modify EC2",
    "Request S3",
    "Modify S3",
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-title">AWS Automation</div>
      <div className="button-container">
        {buttons.map((buttonName) => (
          <button
            key={buttonName}
            className={`button${
              selectedButton === buttonName ? " active" : ""
            }`}
            onClick={() => handleButtonClick(buttonName)}
          >
            {buttonName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
