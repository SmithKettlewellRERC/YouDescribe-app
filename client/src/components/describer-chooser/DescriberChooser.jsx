import React from 'react';

const DescriberChooser = (props) => {
  const options = [
    <option value="Curt">
      Curt
    </option>,
    <option value="Rodrigo">
      Rodrigo
    </option>,
    <option value="Trung">
      Trung
    </option>,
  ];

  // props.users.forEach((user, i) => {
  //   options.push(
      // <option key={i} value={JSON.stringify(user)}>
      //   {user.first_name} {user.last_name.slice(0, 1)}.
      // </option>);
  // });

  // <option value="select_player" disabled>Select Player</option>
  return (
    <div id="describer-chooser">
      <select onChange={props.handleOption} defaultValue="">
        {options}
      </select>
    </div>
  );
};

export default DescriberChooser;
