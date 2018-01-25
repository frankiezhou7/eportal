const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const AvatarUploader = require('./avatarUploader');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const UploadAvatar = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/AvatarUploader/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    file: PropTypes.object,
    nTextUplaodAvatar: PropTypes.string,
    nTextUplaodAvatarNotice: PropTypes.string,
    nTextUploadAvatarNoticeInfo: PropTypes.string,
    percent: PropTypes.number,
    size: PropTypes.number,
    src: PropTypes.string,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    uploadAvatar: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getStyles() {
    let styles = {
      root: {},
      h2: {
        color: '#004588',
      },
      p: {
        margin: '10px 0 30px 0',
        color: '#727272',
      },
      content: {
        width: '100%',
        height: '340px',
      },
      footer: {
        display: 'inline-block',
        float: 'right',
      },
      buttonMargin: {
        marginRight: '10px',
      },
      textFieldHeight: {
        margin: 'auto 160px',
        width: '140px',
        height: '140px',
      },
      avatar: {
        width: '140px',
        height: '140px',
      },
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      file,
      nTextUplaodAvatar,
      nTextUplaodAvatarNotice,
      nTextUploadAvatarNoticeInfo,
      percent,
      src,
      size,
      strokeWidth,
      strokeColor,
      uploadAvatar,
      ...other,
    } = this.props;

    return (
      <div style={this.style('root')}>
        <h2 style={this.style('h2')}>
          {nTextUplaodAvatar}
        </h2>
        <p style={this.style('p')}>
          {this.t('nTextUploadAvatarNoticeInfo')}
        </p>
        <div style={this.style('content')}>
          <div style={this.style('textFieldHeight')}>
            <AvatarUploader
              file={file}
              percent={percent}
              size={140}
              src={src}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              uploadAvatar={uploadAvatar}
              nTextUplaodAvatarNotice={this.t('nTextUplaodAvatarNotice')}
            />
          </div>
        </div>
      </div>
    );
  },
});

module.exports = UploadAvatar;
