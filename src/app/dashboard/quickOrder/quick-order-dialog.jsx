const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const Dialog = require('epui-md/ep/Dialog/Dialog');
const FlatButton = require('epui-md/FlatButton');
const SearchShip = require('./search-ship-form');
const SelectVoyage = require('./select-voyage-form');
const CreateVoyage = require('./create-voyage-form');
const SelectVoyageConnect = require('./select-voyage-connect');
const Loading = require('epui-md/ep/RefreshIndicator');
const BaseForm = require('./baseForm');
const CreateOrderConnect = require('./create-order-connect');
const RegisterShip = require('./register-ship-form');
const UploadShipParticular = require('./upload-ship-particular');
const CloseButton = require('epui-md/svg-icons/navigation/close');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const { connect } = require('react-redux');
const { updateVoyageSegmentById,
        createVoyageSegment,
        findVoyageSegmentsByShipId,
        updateShipEssentialInfo } = global.api.epds;
const PropTypes = React.PropTypes;

const QuickOrderDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Dashboard/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onCloseDialog: PropTypes.func,
    user: PropTypes.object,
    open: PropTypes.bool,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {
      step: 'searchShip',
      ship: {},
      voyageSegments: {},
      title: 'nTextSearchVessel',
      disabled: true,
      registered: false,
      fromNewVoyage: false,
      option: null,
      shipData: {},
      stepId: 0,
      voyage: {},
    };
  },

  getStyles() {
    let { stepId } = this.state;
    let styles = {
      root: {
      },
      title:{
        position: 'relative',
        fontSize: 20,
        zIndex: 2000,
      },
      button:{
        marginLeft: 30,
      },
      buttonLeft:{
        left: -550,
      },
      buttonLeftX1:{
        left: __LOCALE__ === 'en-US' ? -509 : -550,
      },
      buttonLeftX2:{
        position: 'relative',
        left: -688,
      },
      buttonLeftX3:{
        position: 'fixed',
        left: 13,
      },
      buttonLeftX4:{
        left: -450,
      },
      label:{
        color: '#fff',
      },
      closeBtn:{
        position: 'absolute',
        top: 10,
        right: 10,
        width: 18,
        height: 18,
        fill:'#4d4d4d',
        cursor: 'pointer',
        zIndex: 2000,
      },
      indicator:{
        root:{
          width: 760,
          height: 66,
          position: 'relative',
          marginTop: -8,
        },
        step:{
          width: 530,
          height: 20,
          position: 'absolute',
          top: '30%',
          left: '50%',
          margin: '-10px 0 0 -265px',
        },
        circle:{
          borderRadius: '100%',
          width: 19,
          height: 19,
          display: 'inline-block',
          position: 'relative',
        },
        circleStepOne:{
          border: '1px solid #f5a623',
        },
        circleStepTwo:{
          border: stepId <= 5 && stepId > 2 ? '1px solid #f5a623': '1px solid #9b9b9b',
        },
        circleStepThree:{
          border: stepId === 5 ? '1px solid #f5a623' : '1px solid #9b9b9b',
        },
        center:{
          borderRadius: '100%',
          width: 15,
          height: 15,
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-7.5px 0 0 -7.5px',
        },
        centerStepOne:{
          backgroundColor: '#f5a623',
        },
        centerStepTwo:{
          backgroundColor: stepId <= 5 && stepId > 2 ? '#f5a623': '#9b9b9b',
        },
        centerStepThree:{
          backgroundColor: stepId === 5 ? '#f5a623' : '#9b9b9b',
        },
        line: {
          width: 230,
          height: 1,
          display: 'inline-block',
          verticalAlign: '9px',
        },
        lineStepOne:{
          borderTop: stepId > 2 ? '1px solid #f5a623': '1px solid #9b9b9b',
        },
        lineStepTwo:{
          borderTop: stepId > 4 ? '1px solid #f5a623': '1px solid #9b9b9b',
        },
        stepRow:{
          width: 616,
          height: 16,
          position: 'absolute',
          left: '50%',
          top: '60%',
          marginLeft: '-308px',
        },
        stepName:{
          fontSize: 14,
        },
        stepNameOne:{
          color: '#f5a623',
          position: 'absolute',
          left: __LOCALE__ === 'en-US' ? -10 : 5,
        },
        stepNameTwo:{
          color: stepId <= 5 && stepId > 2 ? '#f5a623': '#9b9b9b',
          position: 'absolute',
          left: __LOCALE__ === 'en-US' ? 240 : 257,
        },
        stepNameThree:{
          color: stepId === 5 ? '#f5a623' : '#9b9b9b',
          position: 'absolute',
          right: __LOCALE__ === 'en-US' ? 20 : 31,
        },
      }
    };

    return styles;
  },

  renderStepIndicator() {
    return (
      <div style={this.style('indicator.root')}>
        <div style={this.style('indicator.step')}>
          <div style={this.style('indicator.circle','indicator.circleStepOne')}>
            <span style={this.style('indicator.center','indicator.centerStepOne')}></span>
          </div>
          <div style={this.style('indicator.line','indicator.lineStepOne')}></div>
          <div style={this.style('indicator.circle','indicator.circleStepTwo')}>
            <span style={this.style('indicator.center','indicator.centerStepTwo')}></span>
          </div>
          <div style={this.style('indicator.line','indicator.lineStepTwo')}></div>
          <div style={this.style('indicator.circle','indicator.circleStepThree')}>
            <span style={this.style('indicator.center','indicator.centerStepThree')}></span>
          </div>
        </div>
        <div style={this.style('indicator.stepRow')}>
          <span style={this.style('indicator.stepName','indicator.stepNameOne')}>
            {this.t('nTextStepOneIndicator')}
          </span>
          <span style={this.style('indicator.stepName','indicator.stepNameTwo')}>
            {this.t('nTextStepTwoIndicator')}
          </span>
          <span style={this.style('indicator.stepName','indicator.stepNameThree')}>
            {this.t('nTextStepThreeIndicator')}
          </span>
        </div>
      </div>
    );
  },

  renderBody(styles) {
    let body = {};

    let { step,
          ship,
          segment,
          voyageSegments,
          shipData,
          disabled,
          registered,
          fromNewVoyage,
          voyage
        } = this.state;

    // case 0: 搜索船舶
    // case 1: 注册船舶
    // case 2: 上传 particular
    // case 3: 选择航程
    // case 4: 创建航程
    // case 5: 创建订单

    switch (step) {
      case 'searchShip':
        body.content = (
          <div>
            <SearchShip
              ref='searchShip'
              onItemTouchTap={this._handleSelectShip}
              onCheckAvailable={this._handleCheckAvailable}
            />
          </div>
        );
        break;
      case 'registerShip':
        body.content = (
          <div>
            <RegisterShip
              ref='registerShip'
              value={shipData}
            />
          </div>
        );
        break;
      case 'uploadShipParticular':
        body.content = (
          <div>
            <UploadShipParticular
              ref='uploadShipParticular'
              value={shipData}
            />
          </div>
        );
        break;
      case 'selectVoyage':
        body.content = (
          <div>
            <SelectVoyageConnect
              ref='searchShip'
              onItemTouchTap={this._handleSelectVoyage}
              ship={ship}
            />
          </div>
        );
        break;
      case 'createVoyage':
        body.content = (
          <div>
            <CreateVoyage
              ref='createVoyage'
              onTouchTap={this._handleCreateVoyage}
              ship={ship}
              voyage={voyage}
              segment={segment}
              fromNewVoyage={fromNewVoyage}
              updateVoyageSegmentById={updateVoyageSegmentById}
              createVoyageSegment={createVoyageSegment}
            />
          </div>
        );
        break;
      case 'createOrder':
        body.content = (
          <div>
            <CreateOrderConnect
              ship={ship}
              segment={segment}
              fromNewVoyage={fromNewVoyage}
              onCloseDialog={this._handleCloseDialog}
            />
          </div>
        );
        break;
      default:
    }
    return body;
  },

  renderCloseBtn(styles) {
    return(
      <CloseButton
        style={styles.closeBtn}
        onClick={this._handleCloseDialog}
      />
    );
  },

  render() {
    let styles = this.getStyles();
    let body = this.renderBody(styles);
    let { title, stepId, disabled } = this.state;
    let actions = [];
    switch(stepId){
      //0: Search Ship
      case 0:
       actions = [
         <FlatButton
           backgroundColor={disabled ? '#d0d0d0' : '#f5a623'}
           label= {this.t('nButtonRegisterShip')}
           labelStyle={styles.label}
           style={styles.button}
           disabled={ disabled }
           onTouchTap={this._handleRegisterVessel.bind(this,'registerShip','nTextRegisterVessel')}
         />
       ];
       break;
       //1: Register Ship
       case 1:
        actions = [
          <div style={styles.buttonLeftX3}>
            <FlatButton
              backgroundColor={'#00599a'}
              style={styles.button}
              labelStyle={styles.label}
              label= {this.t('nButtonBack')}
              onTouchTap={this._handleSwitchPage.bind(this,'searchShip','nTextSearchVessel', null, 0,  true, true, true)}
            />
          </div>,
          <FlatButton
            backgroundColor={'#f5a623'}
            style={styles.button}
            labelStyle={styles.label}
            label= {this.t('nButtonNext')}
            onTouchTap={this._handleRegisterShip.bind(this,'uploadShipParticular','nTextUploadShipParticular')}
          />
        ];
       break;
       //2: Upload Ship Particular
       case 2:
        actions = [
          <FlatButton
            backgroundColor={'#00599a'}
            style={styles.buttonLeftX4}
            labelStyle={styles.label}
            label= {this.t('nButtonBack')}
            onTouchTap={this._handleSwitchPage.bind(this,'registerShip','nTextRegisterVessel', 'UploadShipParticular', 1)}
          />,
          <FlatButton
            backgroundColor={'#f5a623'}
            style={styles.button}
            labelStyle={styles.label}
            label= {this.t('nButtonSkip')}
            onTouchTap={this._handleSwitchPage.bind(this,'createVoyage','nTextCreateVoyage', 'SkipUploadShipParticular', 4)}
          />,
          <FlatButton
            backgroundColor={'#f5a623'}
            style={styles.button}
            labelStyle={styles.label}
            label= {this.t('nButtonNext')}
            onTouchTap={this._handleUpdateShip.bind(this,'createVoyage','nTextCreateVoyage')}
          />
        ];
        break;
      //3: Select Voyage
       case 3:
        actions = [
          <FlatButton
            backgroundColor={'#00599a'}
            style={styles.buttonLeftX1}
            labelStyle={styles.label}
            label= {this.t('nButtonBack')}
            onTouchTap={this._handleSwitchPage.bind(this,'searchShip','nTextSearchVessel', null, 0, true)}
          />,
          <FlatButton
            backgroundColor={'#f5a623'}
            style={styles.button}
            labelStyle={styles.label}
            label= {this.t('nButtonCreateVoyage')}
            onTouchTap={this._handleSwitchPage.bind(this,'createVoyage','nTextCreateVoyage', null, 4)}
          />
        ];
        break;
        //4: Create Voyage  --> create voyage button in ./create-voyage-form.jsx
        case 4:
          actions = [
            <div style={styles.buttonLeftX2}>
              <FlatButton
                backgroundColor={'#00599a'}
                style={styles.button}
                labelStyle={styles.label}
                label= {this.t('nButtonBack')}
                onTouchTap={this._handleSwitchPage.bind(this, 'selectVoyage', 'nTextSelectVoyage', 'CreateVoyage', 3)}
              />
            </div>
          ];
          break;
        //5: Create Order  --> create order button in ./create-order.jsx
        case 5:
          actions = [
            <div style={styles.buttonLeftX2}>
              <FlatButton
                backgroundColor={'#00599a'}
                style={styles.button}
                labelStyle={styles.label}
                label= {this.t('nButtonBack')}
                onTouchTap={this._handleSwitchPage.bind(this, 'selectVoyage', 'nTextSelectVoyage', 'CreateOrder', 3)}
              />
            </div>
          ];
          break;
       default:
    };

    return (
      <Dialog
        ref="dialog"
        title={this.t('nTextQuickOrderTitle')}
        actions={actions}
        maxWidth={850}
        modal={true}
        open={true}
        onRequestClose={this.props.onCloseDialog}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
        showTopClose={true}
        setZIndex={1001}
        maxHeight={650}
        marginTop={-70}
      >
        {this.renderStepIndicator()}
        <BaseForm
          content={body.content}
        />
      </Dialog>
    );
  },

  createShip(ship){
    if(global.api.epds && global.api.epds.createShip){
      let user = this.props.user;
      user = user && user.toJS();
      ship.userCreate = user && user._id;
      global.api.epds.createShip.promise(ship).then((res)=>{
        if(res.status === 'OK'){
          this.setState({ship:res.response});
        }
      }).catch(err=>{
        alert(this.t('nTextCreateFailed'));
      });
    }
  },

  _getVoyageSegements() {
    let ship = this.state.ship;
    let id = ship && ship._id;
    let fn = findVoyageSegmentsByShipId;
    if (_.isFunction(fn)) {
      fn(id, {
        size: 1,
        sortby: {'schedule.timePoints.arrival.time': -1},
      });
    }
  },

  _handleUpdateShip(page, title){
    let { shipData } = this.state;
    let shipParticularData = this.refs.uploadShipParticular.getValue();
    let shipFigure = _.omit(shipData, ['name']);
    _.merge(shipParticularData, shipFigure);
    let particular = this.refs.uploadShipParticular.getComponent();
    if(particular.isDirty() || particular.getFiles().length === 0) {
      if(!particular.checkRemovedStatus()){
        alert(this.t('nTextRequireUpload'));
        return;
      }
    }

    updateShipEssentialInfo.promise(this.state.ship._id, shipParticularData).then((res)=>{
      if(res.status === 'OK'){
        this.setState({
          ship:res.response,
          shipData: shipParticularData,
          title,
          step: page,
          stepId: 4,
        });
      }
    }).catch(err=>{
      alert(this.t('nTextUpdateFailed'));
    });
  },

  _handleRegisterShip(page, title){
    this.refs.registerShip.isValid()
      .then((valid)=>{
        if(valid){
          let shipData = this.refs.registerShip.getValue();
            this.setState({
              step: page,
              title,
              registered: true,
              stepId: 2,
            });

            if(this.state.shipData.imo === shipData.imo) {
              // if(this.state.shipData.shipParticular && this.state.shipData.shipParticular.length > 0){
              //   shipData.shipParticular = this.state.shipData.shipParticular;
              // }
              updateShipEssentialInfo.promise(this.state.ship._id, shipData).then((res)=>{
                if(res.status === 'OK'){
                  this.setState({
                    ship:res.response,
                    shipData
                  });
                }
              }).catch(err=>{
                alert(this.t('nTextCreateFailed'));
              });
              return;
            }
            this.setState({shipData})
            this.createShip(shipData);
        }else{
          // alert(this.t('nTextValidationError'));
        }
      });
  },

  _handleSwitchPage(page, title, option, stepId, disabled, clearRegister, clearShipData){
    const { registered, fromNewVoyage, shipData } = this.state;
    let status = clearRegister ? false : registered;

    if(fromNewVoyage === true){
      if(option === 'CreateOrder'){
        this.setState({
          step:'createVoyage',
          title:'nTextCreateVoyage',
          stepId: 4
        })
      }

      if(registered === true){
        if(option === 'CreateVoyage'){
          this.setState({
            step:'uploadShipParticular',
            title:'nTextUploadShipParticular',
            stepId: 2,
          })
        }

        if(option === 'UploadShipParticular'){
          let shipParticularData = this.refs.uploadShipParticular.getValue();
          let shipFigure = _.omit(shipData, ['name']);
          _.merge(shipParticularData, shipFigure);
          let particular = this.refs.uploadShipParticular.getComponent();
          if(particular.isDirty()) {
            if(!particular.checkRemovedStatus()){
              alert(this.t('nTextRequireUpload'));
              return;
            }
          }
          this.setState({
            step:'registerShip',
            title:'nTextRegisterVessel',
            stepId: 1,
            shipData: shipParticularData,
          })
        }

        if(option === 'SkipUploadShipParticular'){
          this.setState({
            step:'createVoyage',
            title:'nTextCreateVoyage',
            shipData,
            stepId: 4,
          })
        }

      }else{
        if(option === 'CreateVoyage'){
          this.setState({
            step:'selectVoyage',
            title:'nTextSelectVoyage',
            fromNewVoyage: false,
            stepId: 3,
          })
        }
      }
      return;
    }

    if(status === true){
      if(option === 'CreateOrder'){
        this.setState({
          step:'createVoyage',
          title:'nTextCreateVoyage',
          registered: false,
          stepId: 4,
        })
      }

      if(option === 'SkipUploadShipParticular'){
        this.setState({
          step:'createVoyage',
          title:'nTextCreateVoyage',
          shipData,
          registered: true,
          stepId: 4,
        })
      }

      if(option === 'CreateVoyage'){
        this.setState({
          step:'uploadShipParticular',
          title:'nTextUploadShipParticular',
          registered: true,
          stepId: 2,
        })
      }

      if(option === 'UploadShipParticular'){
        let shipParticularData = this.refs.uploadShipParticular.getValue();
        let shipFigure = _.omit(shipData, ['name']);
        _.merge(shipParticularData, shipFigure);
        let particular = this.refs.uploadShipParticular.getComponent();
        if(particular.isDirty()) {
          if(!particular.checkRemovedStatus()){
            alert(this.t('nTextRequireUpload'));
            return;
          }
        }
        this.setState({
          step:'registerShip',
          title:'nTextRegisterVessel',
          registered: true,
          stepId: 1,
          shipData: shipParticularData,
        })
      }

      return;
    }

    this.setState({
      step:page,
      title,
      disabled,
      stepId,
      shipData: clearShipData && {},
    });
  },

  _handleCreateVoyage(page, title, fromNewVoyage, voyage, segment) {
    this.setState({
      step:page,
      title,
      fromNewVoyage,
      stepId: 5,
      voyage,
      segment,
    });
  },

  _handleRegisterVessel(page, title) {
    this.setState({
      step:page,
      title,
      fromNewVoyage: false,
      stepId: 1,
    });
  },

  _handleSelectShip(ship){
    this.setState({
      step:'selectVoyage',
      title: 'nTextSelectVoyage',
      ship,
      stepId: 3,
    });
  },

  _handleSelectVoyage(e,segment,voyageSegments){
    this.setState({
      step:'createOrder',
      title:'nTextCreateOrder',
      segment,
      voyageSegments,
      stepId: 5,
    });
  },

  _handleCheckAvailable(length){
    this.setState({
      disabled: length !== 0,
    });
  },

  _handleCloseDialog(){
    let { onCloseDialog } = this.props;
    if (_.isFunction(onCloseDialog)) { onCloseDialog(); }
  },
});

module.exports = connect(
  (state, props) => {
    return {
      user: state.getIn(['session', 'user']),
    };
  }
)(QuickOrderDialog);
