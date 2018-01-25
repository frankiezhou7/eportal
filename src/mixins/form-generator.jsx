const React = require('react');
const _ = require('eplodash');
const { List } = require('epimmutable');
const PropTypes = React.PropTypes;
const ComponentCollection = {
  'DropDownCountries': require('~/src/shared/dropdown-countries'),
  'DropDownShipTypes': require('~/src/shared/dropdown-ship-types'),
  // 'MultiChooseLabels': require('epui-md/multi-choose-labels'),
  'SelectField': require('epui-md/SelectField'),
  'TextField': require('epui-md/TextField'),
  'TextFieldUnit': require('epui-md/TextField/TextFieldUnit'),
};

const KEY_REGEX = /(^n[A-Z].*$)|(^[A-Z].*$)/;

const FormGenerator = {
  /**
   * 生成表单
   * @param  {[type]} modes [description]
   * @return {[type]}       [description]
   */
  _generateForm(modes, prefix) {
    let elements = [], self = this;

    if (modes && List.isList(modes)) {
      let row = [];

      modes.forEach((mode, index) => {
        let isList = List.isList(mode);

        let children = mode.get('children');
        let component = mode.get('component');
        let isArray = mode.get('isArray');
        let isNested = mode.get('isNested');
        let layout = mode.get('layout');
        let name = mode.get('name');
        let props = mode.get('props');
        let value = mode.get('value');
        props = props ? props.toJS() : props;

        if (isList) {
          elements.push(self._generateForm(mode, index));
        } else if (name !== '_id' && name !== '__v') {
          let ref = (prefix || prefix === 0) ? `[${prefix}].${name}` : name;
          let mergedProps = props ? _.merge({ ref: ref, key: Math.random() }, props) : {};
          mergedProps = self._getTranslatedProps(mergedProps);

          // 港口功能处理
          if (component === 'MultiChooseLabels') {
            let items = List([]);

            children.forEach(child => {
              let payload = child.get('name');
              let props = child.get('props');
              let value = child.get('value');
              let text = props.get('text');
              let disabled = !value.get('editable');
              let selected = value.get('available');

              if (payload !== '_id') {
                items = items.push(
                  alt.Map({
                    payload: payload,
                    text: self.t(text),
                    disabled: disabled,
                    selected: selected,
                  })
                );
              }
            });

            let multiChooseElement = React.createElement(
              ComponentCollection[component],
              { ref: ref, key: ref, items: items }
            );

            let section = layout.get('section');

            if (section) {
              let sectionElement = (
                <section
                  key={Math.random()}
                  style={{ width: '100%', margin: '16px 0' }}
                >
                  <div
                    style={{ width: '100%' }}
                  >
                    {self.t(section)}
                  </div>
                  {multiChooseElement}
                </section>
              );

              elements.push( sectionElement );
            } else {
              elements.push( multiChooseElement );
            }
          } else if (component === 'section') {
            let section = layout.get('section');
            let childrenElements = self._generateForm(children);

            let sectionElement = (
              <section
                key={Math.random()}
                style={{ width: '100%' }}
              >
                <div
                  style={{ width: '100%' }}
                >
                  {self.t(section)}
                </div>
                {childrenElements}
              </section>
            );

            elements.push( sectionElement );
          } else if (component === 'TextField' ||
                     component === 'TextFieldUnit' ||
                     component === 'DropDownCountries' ||
                     component === 'DropDownShipTypes'
                   ) {
            let isLast = layout.get('isLast');

            mergedProps = _.merge(mergedProps, { defaultValue: value, style: { margin: '0 8px' } });

            row.push(
              React.createElement(
                ComponentCollection[component],
                mergedProps
              )
            );

            if (isLast) {
               let rowElement = (
                 <div
                   key={`row${index}`}
                   style={{ width: '100%' }}
                 >
                   {row}
                 </div>
               );

               row = [];

               elements.push( rowElement );
            }
          }
        }
      });
    }

    return elements;
  },

  /**
   * 获取表单值
   * @return {[type]} [description]
   */
  _getFormValue(modes, obj, prefix) {
      let elements = [], self = this;

      if (modes && List.isList(modes)) {
        let row = [];

        modes.forEach(mode => {
          let isList = List.isList(mode);

          let children = mode.get('children');
          let component = mode.get('component');
          let isArray = mode.get('isArray');
          let isNested = mode.get('isNested');
          let layout = mode.get('layout');
          let name = mode.get('name');
          let props = mode.get('props');
          let value = mode.get('value');
          let ref = (prefix || prefix === 0) ? `[${prefix}].${name}` : name;
          props = props ? props.toJS() : props;

          if (name === '__v') {
            obj[name] = obj[name] ? obj[name] : value;
          } else if (name !== '_id') {
            // 港口功能处理
            if (component === 'MultiChooseLabels') {
              let el = self.refs[ref];

              if (el) {
                let value = el.getValue();
                _.forEach(value, (val, key) => {
                  value[key] = {
                    available: val,
                  };
                });

                obj[name] = value;
              }
            } else if (component === 'TextField' ||
                       component === 'TextFieldUnit' ||
                       component === 'DropDownCountries' ||
                       component === 'DropDownShipTypes'
                     ) {
              let el = self.refs[ref];

              if (el) {
                let val = el.getValue();

                if (component === 'DropDownCountries' || component === 'DropDownShipTypes') {
                  val = val ? val._id : val;
                }

                obj[name] = val;
              }
            } else if (component === 'section') {
              obj[name] = self._getFormValue(children, {});
            }
          }
        });
      }

      return obj;
  },

 /**
  * 对component的props进行多语言处理
  * @param  {[type]} object [description]
  * @return {[type]}   [description]
  */
 _getTranslatedProps(object) {
   let self = this;

   if (_.isObject(object) && !_.isArray(object)) {
     object = _.mapValues(object, (value) => {
       if (KEY_REGEX.test(value)) {
         return self.t(value);
       } else {
         return value;
       }
     });
   }

   return object;
 },

 _sortModes(modes) {
   // sort section by sectionIndex
   modes = modes && !modes.isEmpty() ? modes.sort((a, b) => {
     let sectionIndexA = a.get('layout') ? (a.get('layout').get('sectionIndex') ? a.get('layout').get('sectionIndex') : -1) : -1;
     let sectionIndexB = b.get('layout') ? (b.get('layout').get('sectionIndex') ? b.get('layout').get('sectionIndex') : -1) : -1;

     return sectionIndexA - sectionIndexB;
   }) : modes;

   return modes;
 },

};

module.exports = FormGenerator;
