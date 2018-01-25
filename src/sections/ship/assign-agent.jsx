let React = require('react');
let Router = require('react-router');
let TextField = require('epui-md/TextField/TextField');
let RaisedButton = require('epui-md/RaisedButton');
let FlatButton = require('epui-md/FlatButton');
let StylePropable = require('~/src/mixins/style-propable');
let Colors = require('epui-md/styles/colors');
let ClearFix = require('epui-md/internal/ClearFix');
let DialogBase = require('./dialog-base');
let AssignAgentItemCompany = require('./assign-agent-item-company');
let Error = require('epui-md/svg-icons/alert/error');
let AssignAgentItemService = require('./assign-agent-item-service');
let AssignAgentServiceWithProvider = require('./assign-agent-service-with-provider');


let AssignAgent = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {

  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {
      status: 'confirmAgent'
    };
  },

  componentDidMount() {

  },

  getStyles() {
    let props = this.props;

    let styles = {
      subTitle: {
        marginBottom: '10px',
        color: '#727272',
      },
      error: {
        position: 'relative',
        top: '3px',
        marginRight: '5px',
        width: '14px',
        height: '14px',
        fill: Colors.amberA200,
      },
      warning: {
        margin: '5px 0 10px 0',
        color: Colors.amberA200,
      },
      portName: {
        color: Colors.indigo700,
      },
      button: {
        width: '82px',
      },
      bodyStyle: {
        padding: '20px 40px',
      }
    };

    return styles;
  },

  _getContentObj() {
    let status = this.state.status;
    let props = this.props;
    let body = null, footerLeftNode = null, footerRightNode = null;
    let styles = this.getStyles();

    switch (status) {
      case 'chooseAgent':
        body = (
          <div>
            <div style={styles.subTitle}>我们在<span style={styles.portName}>青岛港</span>找到以下代理服务商，请在下方列表进行选择</div>
            <div style={styles.warning}><Error style={styles.error} />我们有两个服务该代理无法提供，需在下一步增选一家代理</div>
            <AssignAgentItemCompany />
          </div>
        );

        footerLeftNode = (
          <FlatButton label='下一步' secondary={true} style={styles.button} />
        );
        break;
      case 'existAgent':
        body = (
          <div>
            <div style={styles.subTitle}>该航程在<span style={styles.portName}>青岛港</span>已有委托的代理</div>
            <AssignAgentItemCompany />
          </div>
        );

        footerLeftNode = (
          <FlatButton label='选择其他' secondary={true} style={styles.button} />
        );

        footerRightNode = (
          <FlatButton label='下一步' secondary={true} style={styles.button} />
        );
        break;
      case 'increaseAgent':
        let list = [], componayList = [];
        let serviceList = ['更换船员', '更换船员'], companies = ['', '', '', ''];
        serviceList.forEach((item, index) => {
          list.push(
            <AssignAgentItemService key={index} serviceName={item.name} />
          );
        });

        companies.forEach((company, index) => {
          componayList.push(
            <AssignAgentItemCompany key={index} />
          );
        });

        body = (
          <div>
            <div style={styles.subTitle}>
              我们在<span style={styles.portName}>青岛港</span>
              找到列表中的代理可以提供下面的服务，请选择
            </div>
            <div>{list}</div>
            <div>{componayList}</div>
          </div>
        );

        footerRightNode = (
          <div>
            <FlatButton label='上一步' secondary={true} style={styles.button} />
            <FlatButton label='下一步' secondary={true} style={styles.button} />
          </div>
        );
        break;
      case 'confirmAgent':
        let itemArray = [
          {
            companyName: '青岛亚瀚船舶代理有限公司',
            totalPrice: '$23,340.00',
            serviceList: [
              {serviceName: '船员更换', content: '送Mike等7人上船,Jim等3人下船'},
              {serviceName: '船员更换', content: '送Mike等7人上船,Jim等3人下船'},
              {serviceName: '船员更换', content: '送Mike等7人上船,Jim等3人下船'},
              {serviceName: '船员更换', content: '送Mike等7人上船,Jim等3人下船'}
            ]
          },
          {
            companyName: '青岛亚瀚船舶代理有限公司',
            totalPrice: '$23,340.00',
            serviceList: [
              {serviceName: '船员更换', content: '送Mike等7人上船,Jim等3人下船'}
            ]
          },
          {
            companyName: '',
            totalPrice: '',
            serviceList: [
              {serviceName: '船员更换', content: '送Mike等7人上船,Jim等3人下船'},
              {serviceName: '船员更换', content: '送Mike等7人上船,Jim等3人下船'}
            ]
          },
        ];

        body = (
          <div>
            <div style={styles.subTitle}>
              请确认以下服务委托细节
            </div>
            <AssignAgentServiceWithProvider itemArray={itemArray} />
          </div>
        );
        break;
      default:

    }

    return {
      body: body,
      footer: {
        leftNode: footerLeftNode,
        rightNode: footerRightNode
      }
    }
  },

  render() {
    let styles = this.getStyles();

    let {
      ...other
    } = this.props;

    let title = '指定代理';

    let contentObj = this._getContentObj();

    return (
      <DialogBase
      title={title}
      modal={true}
      bodyStyle={styles.bodyStyle}
      contentNode={contentObj.body}
      footerLeftNode={contentObj.footer.leftNode}
      footerRightNode={contentObj.footer.rightNode} />
    );
  }
});

module.exports = AssignAgent;
