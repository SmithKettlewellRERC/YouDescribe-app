import React, { Component } from 'react';
import SupportNav from './SupportNav.jsx';

class SystemUpgradeWarning extends Component {


    render() {
        return (
        <div id="support" tabIndex="-1">

            <header role="banner" className="w3-container w3-indigo">
                <h2>YouDescribe Systems Upgrade</h2>
            </header>

            <main className="w3-row">

                <SupportNav translate={this.props.translate} />
                <a name="top" className="anchor"></a>

                <div id="support-system-upgrade-message-alert" className='w3-content' style={{textAlign: 'center'}}>
                    <h2>YouDescribe Systems Upgrade</h2>


                    <p><b>The describer tool will be locked starting May 8th to May 15th for much needed repairs and updates.</b></p>

                    <p>Published videos will still be viewable at that time but describers will not be able to record new tracks until our work is completed</p>

                    <p><b>Apologies, and thank you for your contributions to YouDescribe.</b></p>

                    <p>There is no YouDescribe without <i>YOU</i></p>
                </div>


                <h3>More Info:</h3>
                <p>
                    We are in the process of upgrading YouDescribe's systems.
                    We will be starting the upgrade process on 05/08/2023.
                    Until 05/15/2023, users will not be able to create/add new Audio Descriptions
                    to make sure that none of our users' hard work is lost during the upgrade.
                    After 05/15/2023, we will continue to upgrade our systems, but users will be
                    allowed to create/add new Audio Descriptions. We are making some quality of life
                    improvements to improve our users' experience on the YouDescribe platform.
                    We are also very excited to announce that we are rolling out a new YouDescribe
                    Audio Description Editor interface that will hopefully make it easier for users
                    to create new audio descriptions.
                </p>
            </main >

        </div >
        );
    };

}



export default SystemUpgradeWarning;
