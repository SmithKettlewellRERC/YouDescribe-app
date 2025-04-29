import React, { useState } from 'react';
import { BellFill } from 'react-bootstrap-icons';
import './FloatingNotification.scss';

const FloatingNotification = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`floating-notification ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {isExpanded ? (
                <div className="notification-expanded">
                    <div className="notification-header">
                        <h4>New Version Available!</h4>
                        <button onClick={toggleExpanded} className="minimize-button">
                            −
                        </button>
                    </div>
                    <div className="notification-content">
                        <p>Switch to our new platform with AI-powered audio descriptions!</p>
                        <a
                            href="https://ydx.youdescribe.org/"
                            className="switch-button"
                        >
                            Switch Now
                        </a>
                    </div>
                </div>
            ) : (
                <div className="notification-collapsed" onClick={toggleExpanded}>
                    <BellFill size={20} />
                    <span className="notification-badge">1</span>
                </div>
            )}
        </div>
    );
};

export default FloatingNotification;