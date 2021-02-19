import React from 'react';
import * as PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: 10,
    },
    group: {
        margin: 10,
    },
});

class AssetRadioButtonsGroup extends React.Component {


    state = {
            currency: 'algo',
        };


    handleChange = event => {
        this.setState({currency: event.target.value});
        this.props.onAssetChange(event.target.value);
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Currency</FormLabel>
                    <RadioGroup
                        aria-label="Currency"
                        name="currency selection"
                        className={classes.group}
                        value={this.state.currency}
                        onChange={this.handleChange}
                        row
                    >
                        <FormControlLabel value="algo" control={<Radio/>} label="Algo"/>
                        <FormControlLabel value="usdc" control={<Radio/>} label="USDC" disabled={!this.props.enabledUsdc}/>
                    </RadioGroup>
                </FormControl>
            </div>
        );
    }
}

AssetRadioButtonsGroup.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssetRadioButtonsGroup);
