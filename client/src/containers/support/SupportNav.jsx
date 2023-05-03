import React from 'react';
import { Link } from 'react-router';

const SupportNav = (props) => (
    <ul>
    <li><Link to="/support/system-upgrade-warning"><b>{props.translate('Information regarding YouDescribe System Upgrade')}</b></Link></li>
    <li><Link to="/support/about">{props.translate('General information about YouDescribe')}</Link></li>
    <li><Link to="/support/viewers">{props.translate('FAQ pages for viewers')}</Link></li>
    <li><Link to="/support/describers">{props.translate('FAQ for describers')}</Link></li>
    <li><Link to="/support/tutorial">{props.translate('A step-by-step audio description tutorial with a trouble shooting section')}</Link></li>
    <li><Link to="/support/embed_tutorial">{props.translate('A step-by-step embedding tutorial')}</Link></li>
    <li><Link to="/support/privacy">Privacy Policy</Link></li>
    </ul>
);

export default SupportNav;
