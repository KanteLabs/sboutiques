import React from 'react';

const Spinner = () => {
    return (
        <div className="ui active inverted dimmer">
            <div className="ui indeterminate text loader" />
        </div>
    );
};

export default Spinner;
