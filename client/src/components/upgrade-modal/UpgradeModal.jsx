import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './UpgradeModal.scss';

const UpgradeModal = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if modal has been dismissed before
        const hasSeenModal = localStorage.getItem('yd_upgrade_modal_dismissed');
        if (!hasSeenModal) {
            // Show modal after a short delay
            const timer = setTimeout(() => {
                setShow(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShow(false);
        // Optional: remember user dismissed the modal
        localStorage.setItem('yd_upgrade_modal_dismissed', 'true');
    };

    const handleDontShowAgain = (e) => {
        if (e.target.checked) {
            localStorage.setItem('yd_upgrade_modal_dismissed', 'true');
        } else {
            localStorage.removeItem('yd_upgrade_modal_dismissed');
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            className="upgrade-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title><h2>🎉 New YouDescribe Version Available!</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="upgrade-feature-list">
                    <h3>What's New:</h3>
                    <ul>
                        <li>✨ AI-generated audio descriptions</li>
                        <li>🔊 Improved audio quality</li>
                        <li>🖥️ Redesigned user interface</li>
                        <li>⚡ Faster performance</li>
                    </ul>
                    <p>The old version will be discontinued in 30 days. Switch now to experience all the new features!</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Form.Check
                    type="checkbox"
                    id="dont-show-again"
                    label="Don't show again"
                    onChange={handleDontShowAgain}
                />
                <Button variant="secondary" onClick={handleClose}>
                    Later
                </Button>
                <Button variant="primary" href="https://ydx.youdescribe.org/">
                    Switch Now
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpgradeModal;