const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Button = require('./button');
const DivButton = require('./div-button');
const PersonItem = require('./person-list/person-item');
const PropTypes = React.PropTypes;
const RemoveButton = require('epui-md/svg-icons/content/remove');
const Transitions = require('epui-md/styles/transitions');
const Translatable = require('epui-intl').mixin;

const ChoosePersons = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    nLabelBtnSelectPerson: PropTypes.string,
    nLabelChoose: PropTypes.string,
    nLabelChoosingPerson: PropTypes.string,
    nLabelPersonInFlight: PropTypes.string,
    nTextCancel: PropTypes.string,
    onChoosePerson: PropTypes.func,
    onRemovePerson: PropTypes.func,
    personsChoosen: PropTypes.array,
    personsToChoose: PropTypes.array,
    showTitle: PropTypes.bool,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {
      personsChoosen: [],
      personsToChoose: [],
      showTitle: true,
    };
  },

  getInitialState() {
    return {
      isChoosing: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let fontSize = 13;
    let theme = this.getTheme();

    const { isChoosing } = this.state;

    let rootStyle = {
      backgroundColor: '#fafafa' || theme.canvasColor,
      border: '1px solid #DCDCDC',
      borderBottom: 'none',
      padding: padding * 5,
      minHeight: 16,
      overflow: 'hidden',
    };

    if(this.props.style) {
      _.merge(rootStyle, this.props.style);
    }

    let styles = {
      root: rootStyle,
      title: {
        fontSize: 15,
        display: 'block',
        textAlign: isChoosing ? 'center' : 'left',
        marginBottom: 8,
        marginLeft: 9,
      },
      choosingPerson: {
        textAlign: 'center',
        width: '100%',
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'top',
        marginLeft: 4,
      },
      personChoosen: {
        width: '100%',
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'top',
        paddingBottom: 5,
      },
      buttonContainer: {
        marginTop: padding * 3,
      },
      button: {
        padding: 7,
      },
      removeIcon: {
        fill: theme.canvasColor,
        position: 'absolute',
      },
      actionBtn: {
        cursor: 'pointer',
        marginRight: padding * 2,
        padding: padding * 2,
        float: 'right',
      },
      actions: {
        display: 'block',
        textAlign: 'right',
      },
    };

    return styles;
  },

  getPersonChoosen() {
    return this.props.personsChoosen;
  },


  renderTitle() {
    if(!this.props.showTitle) return null;

    return(
      <span style={this.style('title')}>
        {this.state.isChoosing ? this.t('nLabelChoosingPerson') : this.t('nLabelPersonInFlight')}
      </span>
    );
  },

  renderChoosingPerson() {
    let theme = this.getTheme();
    let removeIcon = <RemoveButton style={this.style('removeIcon')} />;

    let personsToChoose = _.map(this.props.personsToChoose, person => {
      return (
        <PersonItem
          ref={'choose_' + person.id}
          key={'choose_' + person.id}
          person={person}
          hoverable={false}
          selectable={true}
        />
      );
    });

    let actions = (
      <div style={this.style('actions')}>
        <DivButton
          hoverColor={theme.primary1Color}
          labelButton={this.t('nTextCancel')}
          onClick={this._handleCancleChoose}
          style={this.style('actionBtn')}
        />
        <DivButton
          hoverColor={theme.primary1Color}
          labelButton={this.t('nLabelChoose')}
          onClick={this._handleConfirmChoose}
          style={this.style('actionBtn')}
        />
      </div>
    );

    return (
      <div style={this.style('choosingPerson')}>
        {personsToChoose}
        {actions}
      </div>
    );
  },

  renderPersonChoosen() {
    let personsChoosen = this.props.personsChoosen;
    let personsChoosenElems = [];

    _.forEach(personsChoosen, person => {
      personsChoosenElems.push(
        <PersonItem
          ref={'choosen_' + person.id}
          key={'choosen_' + person.id}
          person={person}
          onRemove={this._handleRemovePerson}
        />
      );
    });

    let action = this.props.personsToChoose.length > 0 ? (
      <Button
        key='btn'
        buttonStyle={this.style('button')}
        nLabelButton={this.t('nLabelBtnSelectPerson')}
        onClick={this._handleChoosePersonAction}
        style={this.style('buttonContainer')}
      />
    ) : null;

    return (
      <div style={this.style('personChoosen')}>
        {personsChoosenElems}
        {action}
      </div>
    );
  },

  render() {
    const { isChoosing } = this.state;

    return (
      <div style={this.style('root')}>
        {this.renderTitle()}
        {isChoosing ? this.renderChoosingPerson() : this.renderPersonChoosen()}
      </div>
    );
  },

  _handleChoosePersonAction() {
    this.setState({
      isChoosing: true,
    });
  },

  _handleCancleChoose() {
    this.setState({
      isChoosing: false,
    });
  },

  _handleConfirmChoose() {
    global.notifyOrderDetailsChange(true);
    if (this.props.onChoosePerson) {
      let personsToChoose = this.props.personsToChoose;
      let personsChoosen = [];
      _.forEach(personsToChoose, person => {
        if (this.refs['choose_' + person.id] && this.refs['choose_' + person.id].isSelected()) {
          personsChoosen.push(person);
        }
      });
      this.props.onChoosePerson(personsChoosen);
    }

    this.setState({
      isChoosing: false,
    });
  },

  _handleRemovePerson(id) {
    global.notifyOrderDetailsChange(true);
    if (this.props.onRemovePerson) {
      this.props.onRemovePerson(id);
    }
  },
});

module.exports = ChoosePersons;
